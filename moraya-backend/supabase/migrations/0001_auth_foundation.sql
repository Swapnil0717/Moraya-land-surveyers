-- Moraya Land Surveyors — Step 1: authentication foundation
-- Run in Supabase Dashboard → SQL Editor (or `supabase db push`).
-- Tables: employees, user_permissions, audit_logs. No public sign-up: admins create accounts.

-- ───────── Types ─────────
create type public.user_role as enum ('main_admin', 'sub_admin', 'worker');
create type public.account_status as enum ('active', 'inactive', 'revoked');
create type public.app_permission as enum (
  'employee_management',
  'site_management',
  'verification',
  'income_management',
  'salary_management',
  'report_view',
  'export'
);

-- ───────── employees ─────────
create sequence public.employees_sr_no_seq;

create table public.employees (
  id               uuid primary key default gen_random_uuid(),
  sr_no            integer not null unique default nextval('public.employees_sr_no_seq'),
  auth_user_id     uuid unique references auth.users (id) on delete restrict,
  employee_code    text not null unique check (length(btrim(employee_code)) > 0),   -- "Employee ID"
  full_name        text not null check (length(btrim(full_name)) > 0),
  login_email      text not null unique check (login_email = lower(login_email)),
  designation      text,
  date_of_birth    date,
  date_of_joining  date,
  role             public.user_role not null default 'worker',
  status           public.account_status not null default 'active',
  created_by       uuid references public.employees (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
-- Aadhaar is added later (encrypted + masked) in the Employee module migration.

-- Exactly one Main Admin: at most one row may have role = main_admin ...
create unique index employees_single_main_admin on public.employees (role) where role = 'main_admin';

-- ───────── user_permissions (Sub-Admin only) ─────────
create table public.user_permissions (
  employee_id  uuid not null references public.employees (id) on delete cascade,
  permission   public.app_permission not null,
  granted_by   uuid references public.employees (id),
  granted_at   timestamptz not null default now(),
  primary key (employee_id, permission)
);

-- ───────── audit_logs (append-only) ─────────
create table public.audit_logs (
  id           bigint generated always as identity primary key,
  actor_id     uuid references public.employees (id),
  action       text not null,
  entity_type  text not null,
  entity_id    text,
  old_value    jsonb,
  new_value    jsonb,
  reason       text,
  created_at   timestamptz not null default now()
);
create index audit_logs_created_at_idx on public.audit_logs (created_at desc);

-- ───────── Triggers ─────────
create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger employees_set_updated_at
  before update on public.employees
  for each row execute function public.set_updated_at();

-- ... and that one can never be removed, demoted, deactivated or revoked. Users are never deleted.
create function public.guard_employee_changes() returns trigger
language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Employees cannot be deleted. Deactivate or revoke the account instead.';
  end if;
  if old.role = 'main_admin' and (new.role <> 'main_admin' or new.status <> 'active') then
    raise exception 'The Main Admin cannot be demoted, deactivated or revoked. Transfer the Main Admin role first.';
  end if;
  return new;
end $$;

create trigger employees_guard_update
  before update on public.employees
  for each row execute function public.guard_employee_changes();
create trigger employees_guard_delete
  before delete on public.employees
  for each row execute function public.guard_employee_changes();

-- Permissions only make sense for Sub-Admins.
create function public.guard_permission_target() returns trigger
language plpgsql as $$
begin
  if not exists (select 1 from public.employees where id = new.employee_id and role = 'sub_admin') then
    raise exception 'Permissions can only be assigned to Sub-Admins.';
  end if;
  return new;
end $$;

create trigger user_permissions_guard
  before insert or update on public.user_permissions
  for each row execute function public.guard_permission_target();

-- If someone stops being a Sub-Admin, their permissions are cleared.
create function public.clear_permissions_on_role_change() returns trigger
language plpgsql as $$
begin
  if new.role <> 'sub_admin' then
    delete from public.user_permissions where employee_id = new.id;
  end if;
  return new;
end $$;

create trigger employees_clear_permissions
  after update of role on public.employees
  for each row when (old.role is distinct from new.role)
  execute function public.clear_permissions_on_role_change();

-- Audit logs cannot be edited or deleted.
create function public.audit_logs_read_only() returns trigger
language plpgsql as $$
begin
  raise exception 'Audit logs are read-only.';
end $$;

create trigger audit_logs_no_update
  before update or delete on public.audit_logs
  for each row execute function public.audit_logs_read_only();

-- ───────── Row Level Security (defense in depth) ─────────
-- The Cloudflare Worker uses the service-role key (bypasses RLS) and enforces permissions itself.
-- Browsers use the anon key: they can only read their OWN employee row + permissions, never write.
alter table public.employees        enable row level security;
alter table public.user_permissions enable row level security;
alter table public.audit_logs       enable row level security;

revoke all on public.employees, public.user_permissions, public.audit_logs from anon, authenticated;
grant select on public.employees, public.user_permissions to authenticated;

create policy employees_select_own on public.employees
  for select to authenticated
  using (auth_user_id = (select auth.uid()));

create policy user_permissions_select_own on public.user_permissions
  for select to authenticated
  using (employee_id in (select id from public.employees where auth_user_id = (select auth.uid())));
-- audit_logs: no policies and no grants → invisible to browsers.
