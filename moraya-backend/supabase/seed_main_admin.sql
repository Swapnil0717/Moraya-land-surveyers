-- Create the FIRST Main Admin (run once, in the SQL Editor).
-- 1) Supabase Dashboard → Authentication → Users → Add user (email + password, Auto Confirm ON).
-- 2) Put the same email below and run this script.
insert into public.employees
  (auth_user_id, employee_code, full_name, login_email, designation, date_of_joining, role, status)
select id, 'E-001', 'YOUR FULL NAME', lower(email), 'Director', current_date, 'main_admin', 'active'
from auth.users
where lower(email) = lower('YOUR-EMAIL@example.com');

-- To add a test worker later: create the auth user, then
-- insert into public.employees (auth_user_id, employee_code, full_name, login_email, designation, role)
-- select id, 'E-002', 'Test Surveyor', lower(email), 'Surveyor', 'worker' from auth.users where lower(email)=lower('worker@example.com');
