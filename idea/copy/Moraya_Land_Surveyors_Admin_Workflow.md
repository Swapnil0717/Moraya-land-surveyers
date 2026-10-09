# Moraya Land Surveyors — Admin Workflow

## 1. Admin Roles

### Main Admin
Exactly one Main Admin must always exist.

Full access:
- Manage employees/users
- Create users
- Create/promote Sub-Admins
- Revoke Sub-Admin access
- Manage permissions
- Manage sites
- Manage site income
- Manage salary
- View and verify work and expenses
- Generate reports/invoices
- View audit logs
- Full admin access

The backend must prevent the last Main Admin from being deleted or demoted.

### Sub-Admin
Created or promoted by an authorized Admin.

Access is permission-based, such as:
- Employee management
- Site management
- Verification
- Income management
- Salary management
- Report viewing
- Export

Main Admin can change permissions or revoke access.

## 2. Admin Login

Admin:
1. Opens the application.
2. Enters email address and password.
3. Supabase Auth authenticates the user.
4. Backend determines the authenticated employee/user and role.
5. Backend checks permissions.
6. User is routed to the appropriate Admin Dashboard.

The frontend must never be trusted to determine the user's role.

## 3. Admin Dashboard

Dashboard should show:
- Active Employees
- Active Sites
- Pending Verification
- Site Income
- Site Expenses
- Salary Paid
- Salary Pending
- Recent Work
- Recent Expenses
- Recent Income
- Pending Salaries
- Active Sites
- Employee Activity

## 4. Employee Management

### Employee Fields
- SR NO
- Employee Name
- Employee Aadhaar Card Number
- Employee ID
- Login Email (unique, used to sign in)
- Designation
- Date of Birth
- Date of Joining

Internal fields:
- User ID
- Role
- Account Status
- Created At
- Updated At
- Created By

Employee ID must be unique.

Statuses:
- Active
- Inactive
- Revoked

Aadhaar is sensitive and must be restricted/masked where appropriate.

### Employee Actions
Admin can:
- Create employee
- Create login account
- Assign role
- Promote to Sub-Admin
- Change permissions
- Deactivate
- Reactivate
- Revoke access
- View employee history

Workers cannot create employees or accounts.

## 5. Site Management

### Site Fields
- SR NO
- Date
- Site Location
- Site Name
- Client Name

Internal:
- Site ID
- Status
- Created At
- Updated At
- Created By

Statuses:
- Active
- Completed
- Inactive

Surveyor and Assistant are NOT permanent site fields. They are selected per Work Entry.

Admin can:
- Create site
- Edit site
- Change site status
- View site history
- View site work
- View site expenses
- View site income

## 6. Verification Center

Every worker-submitted work/expense data starts as:

PENDING_VERIFICATION

Workflow:

Worker submits
→ PENDING_VERIFICATION
→ Admin reviews
→ Approve / Request Changes / Reject

Verification statuses:
- DRAFT
- PENDING_VERIFICATION
- VERIFIED
- CHANGES_REQUESTED
- REJECTED
- CANCELLED

### Approve
- Set status to VERIFIED
- Store Verified By
- Store Verified At
- Add audit log
- Include record in official calculations

### Request Changes
- Set status to CHANGES_REQUESTED
- Admin must provide a reason
- Worker edits the requested information
- Worker resubmits
- Status returns to PENDING_VERIFICATION
- Previous version/history is retained

### Reject
- Set status to REJECTED
- Reason is required
- Original submission remains in history
- Rejected data is excluded from official totals

A worker cannot verify their own submission.

## 7. Work Review

Admin can review:
- Work Entry ID
- Employee/Surveyor
- Assistant
- Site
- Date
- Time
- Expense
- Remarks
- Verification status

Admin can:
- View
- Approve
- Request Changes
- Reject

Official reports use VERIFIED worker submissions.

## 8. Expense Management

Employee/site expense submitted by workers is reviewed by Admin.

Expense fields:
- Expense ID
- Employee ID
- Site ID
- Work Entry ID
- Date
- Amount
- Category
- Remarks
- Status
- Created At
- Updated At
- Created By

Admin can:
- View expenses
- Filter expenses
- Verify expenses
- Cancel/Void financial records
- View history

Financial records must not be hard-deleted.

## 9. Site Income Management

Only authorized Admins can create or modify site income.

Fields:
- Income ID
- Site ID
- Date
- Income Amount
- Description/Reference
- Remarks
- Status
- Created At
- Updated At
- Created By

Statuses:
- Pending
- Received
- Partially Received
- Cancelled/Void

Multiple income transactions are supported.

Example:
₹25,000 + ₹30,000 + ₹45,000 = ₹100,000 total income.

Workers cannot enter site income.

## 10. Salary Management

Only authorized Admins manage salary.

Fields:
- Employee Name
- Employee ID
- Designation
- Salary Period
- Salary Amount
- Salary Credited Date
- Payment Status
- Remarks

Statuses:
- Pending
- Paid
- Partially Paid

Salary history is retained.

Workers cannot edit salary.

## 11. Reports and Invoices

Admin can access reports according to permissions.

Supported reports:
1. Overall Work/Site Invoice
2. Personal Employee Work Invoice
3. Overall Employee Work Invoice
4. Site Invoice
5. Overall Site Total Expense Invoice
6. Individual Site Expense Invoice
7. Employee Expense Invoice
8. Overall Site Total Income Invoice
9. Individual Site Income Invoice
10. Individual Employee Salary Invoice
11. Overall Salary Invoice
12. Employee Salary + Expense Summary
13. Site Net Balance Invoice
14. Overall Financial Summary Invoice

Filters:
- Today
- This Week
- This Month
- Previous Month
- Custom Date Range
- Employee
- Site
- Client
- Designation
- Status

Exports:
- PDF
- Excel
- Print

Official financial calculations should use VERIFIED worker-submitted records.

## 12. Site Net Balance

Recommended terminology:

Site Net Balance = Verified Site Income - Verified Site Expenses

After Salary Balance:

Income - Site Expenses - Salary

Avoid formal accounting terminology such as "profit" unless the client confirms it.

## 13. Audit Logs

Track:
- User created/updated/deactivated/reactivated/revoked
- Sub-Admin created/revoked
- Permissions changed
- Site created/updated/status changed
- Work entry created/modified
- Expense created/modified/cancelled
- Income created/modified/cancelled
- Salary created/modified/status changed
- Submission approved/rejected/changes requested

Example:
Admin changes income from ₹20,000 to ₹25,000.

Audit record:
- Actor
- Timestamp
- Old value
- New value
- Action
- Reason where applicable

## 14. Admin Navigation

Dashboard
- Employees
- Sites
- Verification Center
- Work Entries
- Expenses
- Income
- Salary
- Reports / Invoices
- Users & Permissions
- Audit Logs
- Settings

## 15. Security Rules

- Backend derives authenticated user identity.
- Never trust a role supplied by the browser.
- Never trust an employee ID supplied by the browser for authorization.
- Enforce permissions on backend APIs.
- Use Supabase RLS as defense in depth.
- Protect Aadhaar information.
- Workers cannot access Admin APIs.
- Workers cannot verify submissions.
- Financial records are not hard-deleted.
- Main Admin cannot be removed if it would leave no Main Admin.
