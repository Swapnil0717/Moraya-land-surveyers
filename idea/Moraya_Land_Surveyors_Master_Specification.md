# Moraya Land Surveyors — Invoice Management App
## Master Product & Development Specification

**Project:** Invoice Management App  
**Client:** Moraya Land Surveyors  
**Document Type:** Master specification for AI/development agents  
**Current target:** Production-ready web application with role-based access, work tracking, financial tracking, salary management, and a centralized report/invoice engine.

---

# 1. Product Goal

Build a web-based invoice and management system for **Moraya Land Surveyors**.

The system must allow administrators to manage employees/users, sites, site income, salaries, and permissions. Surveyors/users must be able to record their own work, assistants, expenses, and remarks.

The application must generate multiple invoices/reports from the **same centralized database**.

## Core principle

Do **NOT** create 14 independent invoice databases/modules.

Instead:

```text
Authentication
      ↓
Users / Employees
      ↓
Sites
      ↓
Work Entries
      ↓
Expenses / Income / Salaries
      ↓
Central Report & Invoice Engine
      ↓
14 Invoice / Report Types
```

A single data record should automatically appear in every report where it is relevant.

Example:

If Rahul records ₹500 expense for ABC Site on 06/10/2026, that same transaction should automatically contribute to:

- Rahul's Employee Expense Invoice
- Rahul's Personal Employee Work Invoice
- Overall Employee Work Invoice
- ABC Site Invoice
- Individual Site Expense Invoice
- Overall Site Expense Invoice
- Employee Salary + Expense Summary
- Site Profit/Loss
- Overall Financial Summary

There must be no duplicate manual entry.

---

# 2. User Roles

There are exactly three role levels.

## 2.1 Main Admin

There must always be exactly **one Main Admin**.

Main Admin has full control over the application.

Permissions include:

- Manage users/employees
- Create users
- Edit employee records
- Activate/deactivate users
- Create/promote Sub-Admins
- Change Sub-Admin permissions
- Revoke Sub-Admin access
- Manage sites
- Manage site income
- Manage salary records
- View all work
- View all expenses
- View all financial reports
- Generate/export invoices and reports
- View audit logs
- Manage application settings where applicable

### Main Admin protection

The system must prevent:

- Accidental deletion of the only Main Admin
- Demotion of the only Main Admin
- Removing the last Main Admin
- Any operation that would leave the system without a Main Admin

The backend must enforce this.

---

## 2.2 Sub-Admin

Sub-Admins are created/promoted only by an authorized Admin.

Sub-Admins can access Admin Home.

Their permissions must be configurable.

Possible permissions:

- View users
- Manage users
- View sites
- Manage sites
- View work
- View expenses
- Manage income
- Manage salary
- View reports
- Export reports

Main Admin must be able to:

- Change Sub-Admin permissions
- Revoke Sub-Admin access
- Change role where allowed

The exact permission matrix can be finalized later, but authorization must be enforced by the backend.

---

## 2.3 User / Surveyor

Users are predefined employees created by Admin.

There is:

- No public self-registration
- No user-created accounts
- No access to Admin Home

Users can access **User Home** only.

Users can:

- Create work entries
- Select site
- Select assistant
- Enter site expense
- Enter remarks
- View their own relevant work
- View their own expense history
- View allowed salary information if enabled

Users cannot:

- Create Admins
- Create Sub-Admins
- Manage other employees
- Manage sites
- Enter/edit site income
- Edit salary records
- Access Admin-only functionality

Role permissions must be checked on the backend, not only hidden in the frontend.

---

# 3. Employee / User Onboarding

Admin creates predefined employee/user records.

## Required fields

| Field | Description |
|---|---|
| SR NO | System-generated serial number |
| Employee Name | Full employee name |
| Employee Aadhaar Card Number | Sensitive employee identification |
| Employee ID | Unique employee identifier |
| Login Email | Unique email address used to sign in |
| Designation | Employee designation |
| Date of Birth | Employee DOB |
| Date of Joining | Joining date |

## Recommended internal fields

- User ID
- Role
- Account Status
- Created At
- Updated At
- Created By

## Account statuses

Recommended:

- Active
- Inactive
- Revoked

Employee ID must be unique.

Aadhaar is sensitive information and must have appropriate security, restricted access, and masking where appropriate.

---

# 4. Site Onboarding

Admin creates and manages sites.

## Required fields

| Field | Description |
|---|---|
| SR NO | System-generated serial number |
| Date | Site creation/onboarding date |
| Site Location | Physical location |
| Site Name | Name of site |
| Client Name | Client associated with site |

The source sheet used the spelling `CLINT NAME`, but the application should use **CLIENT NAME** unless the client specifically requires the original spelling.

## Explicitly NOT part of Site Onboarding

Do not store these as Site Onboarding fields:

- Surveyor Name
- Assistant Name

Those are determined from work entries.

## Recommended internal fields

- Site ID
- Status
- Created At
- Updated At
- Created By

## Site statuses

Recommended:

- Active
- Completed
- Inactive

---

# 5. Work Entry / Daily Work Log

After onboarding, a User/Surveyor creates a work entry.

## Work Entry fields

- Work Entry ID
- Site
- Date
- Time
- Surveyor
- Assistant
- Site Expense
- Remarks
- Created At
- Updated At

## User-facing entry flow

The user:

1. Selects Site
2. Enters/selects Date
3. Enters/selects Time
4. Selects Assistant from predefined employees
5. Enters Site Expense
6. Enters Remarks
7. Saves the work entry

The Surveyor is automatically the logged-in user.

The user must not manually choose another Surveyor.

## Work Entry ID

Use a unique identifier such as:

`WE-2026-00001`

## Date/time rule

Users may create entries for:

- Current date/time
- Past date/time

Users must NOT create future work entries.

This must be validated:

- In frontend
- In backend

Backend validation is mandatory because frontend restrictions can be bypassed.

---

# 6. Assistant Rule

An assistant is a separate employee/user selected on a work entry.

Recommended manpower logic:

If:

```text
Rahul = Surveyor
Amit = Assistant
```

then:

```text
Unique workers = 2
```

However, if Rahul and Amit appear in multiple work entries, they should still count only once when calculating **unique workers**.

The system should distinguish:

- Work Entry Count
- Unique Worker Count

Example:

```text
ABC Site

Work Entries: 12
Unique Workers: 4
```

This is the recommended business rule and should remain configurable if the client later changes the requirement.

---

# 7. Expense Management

## Critical rule

**Site Expense is entered by the Employee/Surveyor, NOT by Admin.**

Expense belongs to a specific:

- Employee
- Site
- Date
- Work Entry where applicable

Example:

```text
Employee: Rahul
Site: ABC Site
Date: 06/10/2026
Expense: ₹500
Remark: Travel
```

## Expense model

Expenses should be modeled as separate financial transactions rather than only storing a total on a work entry.

Recommended fields:

- Expense ID
- Employee ID
- Site ID
- Work Entry ID
- Date
- Amount
- Category (optional/future)
- Remarks
- Status
- Created At
- Updated At
- Created By

## Expense calculations

System must support:

- Employee total expense
- Site total expense
- Overall total expense
- Expense by date
- Expense by employee
- Expense by site
- Expense by reporting period

Financial records should not be permanently deleted.

Use:

- Active
- Cancelled/Void

If a financial transaction is cancelled, retain the original record and cancellation reason.

---

# 8. Site Income

## Critical rule

**Site Income is Admin-controlled.**

Users/Surveyors do not enter site income.

Recommended income fields:

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

## Income statuses

Recommended:

- Pending
- Received
- Partially Received
- Cancelled/Void

Example:

```text
Site: ABC Site
Date: 06/10/2026
Amount: ₹25,000
Description: Client payment
```

The system should support multiple income transactions for the same site.

Example:

```text
Income #001 = ₹25,000
Income #002 = ₹30,000
Income #003 = ₹45,000

Total = ₹100,000
```

---

# 9. Salary Management

Salary is Admin-controlled.

Users must not edit salary information.

## 9.1 Individual Employee Salary

Fields:

- Employee Name
- Employee ID
- Designation
- Salary Period
- Salary Amount
- Salary Credited Date
- Payment Status
- Remarks

## Salary statuses

- Pending
- Paid
- Partially Paid

## 9.2 Overall Salary

Consolidated salary report for all employees.

Recommended columns:

```text
SR NO
EMPLOYEE NAME
EMPLOYEE ID
DESIGNATION
SALARY PERIOD
SALARY AMOUNT
CREDITED DATE
STATUS
```

Show:

- Total employees
- Total salary
- Total paid
- Total pending
- Total partially paid

Salary history must be retained.

Potential future salary features:

- Advances
- Deductions
- Bonuses
- Attendance-based salary
- Fixed monthly salary

These are not required unless added later.

---

# 10. Dashboard

## 10.1 Admin Dashboard

Recommended dashboard cards:

- Active Employees
- Active Sites
- Site Income
- Site Expenses
- Salary Paid
- Salary Pending

Additional sections:

- Recent Work
- Recent Expenses
- Recent Income
- Pending Salaries
- Active Sites
- Employee Activity

Example:

```text
Active Employees: 25
Active Sites: 12
Site Income: ₹10,00,000
Site Expenses: ₹2,50,000
Salary Paid: ₹3,00,000
Salary Pending: ₹50,000
```

All values should be calculated from actual database records.

---

## 10.2 Employee Dashboard

Employee Home should contain:

- Welcome/current employee
- Add Work Entry
- My Work Count
- My Sites
- My Expenses
- My Salary/Salary History if permitted

Employees should see only data permitted by their role.

---

# 11. Reporting Periods

All major reports should support:

- Today
- This Week
- This Month
- Previous Month
- Custom Date Range

Example:

```text
01/10/2026 → 31/10/2026
```

Reports should use the selected reporting period consistently.

---

# 12. Report Filters

Major reports should support filters such as:

- Employee
- Site
- Client
- Designation
- Status
- Date range

Filters should work together.

Example:

```text
Date: 01/10/2026 - 31/10/2026
Employee: Rahul
Site: ABC Site
```

---

# 13. Final 14 Invoice / Report Types

The system must support exactly these core 14 report/invoice types.

---

## 13.1 Overall Work/Site Invoice

Purpose:

Shows all work across employees and sites.

Recommended columns:

```text
SR NO
DATE
SURVEYOR NAME
ASSISTANT NAME
SITE LOCATION
SITE NAME
CLIENT NAME
SITE EXPENSES
SITE INCOME
REMARKS
```

Data sources:

- SR NO → system
- DATE → Work Entry
- SURVEYOR NAME → logged-in user
- ASSISTANT NAME → selected assistant
- SITE LOCATION → Site
- SITE NAME → Site
- CLIENT NAME → Site
- SITE EXPENSES → employee-entered expense
- SITE INCOME → admin-controlled income
- REMARKS → employee-entered work/expense remark

---

## 13.2 Personal Employee Work Invoice

Purpose:

Shows one employee's work history.

Should include:

- Employee
- Employee ID
- Designation
- Date
- Time
- Site
- Client
- Assistant
- Expense
- Remarks

Filters:

- Date range
- Site
- Employee

---

## 13.3 Overall Employee Work Invoice

Purpose:

Consolidated work report for all employees.

Should show:

- Employee
- Employee ID
- Date
- Site
- Client
- Assistant
- Work entry
- Expense
- Remarks

---

## 13.4 Site Invoice

Purpose:

Shows all workers/work entries for a selected site.

Should include:

- Site
- Location
- Client
- Date
- Time
- Surveyor
- Assistant
- Expense
- Remarks

Also show:

- Total work entries
- Unique workers

---

## 13.5 Overall Site Total Expense Invoice

Purpose:

Shows total expenses across all sites for a selected reporting period.

Should include:

- Site
- Employee
- Date
- Expense
- Remarks

Summary:

```text
Total Sites
Total Expense Transactions
Total Expense Amount
```

---

## 13.6 Individual Site Expense Invoice

Purpose:

Shows expenses for one selected site.

Columns:

```text
SR NO
DATE
EMPLOYEE
SITE
EXPENSE
REMARKS
```

Summary:

```text
Total Expense
```

---

## 13.7 Employee Expense Invoice

Purpose:

Shows one employee's complete expense history across all sites.

Columns:

```text
SR NO
DATE
EMPLOYEE
SITE
CLIENT
EXPENSE
REMARKS
```

Summary:

```text
Total Expense
Number of Expense Transactions
Number of Sites
```

---

## 13.8 Overall Site Total Income Invoice

Purpose:

Shows income across all sites.

Columns may include:

```text
SR NO
DATE
SITE
CLIENT
INCOME
REFERENCE/DESCRIPTION
STATUS
REMARKS
```

Summary:

```text
Total Income
Received
Pending
Partially Received
```

---

## 13.9 Individual Site Income Invoice

Purpose:

Shows all income transactions for one site.

Columns:

```text
SR NO
DATE
SITE
CLIENT
INCOME
REFERENCE
STATUS
REMARKS
```

Summary:

```text
Total Income
Total Received
Total Pending
```

---

## 13.10 Individual Employee Salary Invoice

Purpose:

Salary report for one employee.

Fields:

```text
EMPLOYEE NAME
EMPLOYEE ID
DESIGNATION
SALARY PERIOD
SALARY AMOUNT
SALARY CREDITED DATE
STATUS
REMARKS
```

---

## 13.11 Overall Salary Invoice

Purpose:

Consolidated salary report for all employees.

Columns:

```text
SR NO
EMPLOYEE NAME
EMPLOYEE ID
DESIGNATION
SALARY PERIOD
SALARY AMOUNT
CREDITED DATE
STATUS
```

Summary:

```text
Total Employees
Total Salary
Total Paid
Total Pending
Total Partially Paid
```

---

## 13.12 Employee Salary + Expense Summary

Purpose:

A combined employee financial summary.

For each employee show:

```text
EMPLOYEE
EMPLOYEE ID
SALARY
TOTAL EXPENSE
NUMBER OF WORK ENTRIES
NUMBER OF SITES
```

This report is useful for management-level employee cost analysis.

---

## 13.13 Site Profit/Loss Invoice

Purpose:

Shows financial performance of each site.

Calculation:

```text
Site Net Balance = Site Income - Site Expenses
```

Example:

```text
ABC Site

Total Income       ₹2,50,000
Total Expenses       ₹75,000
----------------------------
Net Balance        ₹1,75,000
```

Recommended columns:

```text
SITE
CLIENT
TOTAL INCOME
TOTAL EXPENSE
NET BALANCE
```

Do not interpret the result as formal accounting profit unless the client confirms that this definition is acceptable.

---

## 13.14 Overall Financial Summary Invoice

Purpose:

Company-level financial overview.

Example:

```text
Period: 01/10/2026 - 31/10/2026

Total Site Income       ₹10,00,000
Total Site Expenses      ₹2,50,000
Total Salary             ₹3,00,000
-----------------------------------
Net Balance              ₹4,50,000
```

Recommended sections:

### Income

- Total income
- Received income
- Pending income
- Partially received income

### Expenses

- Total site expenses
- Expense by employee
- Expense by site

### Salary

- Total salary
- Paid salary
- Pending salary

### Overall

- Income
- Expenses
- Salary
- Net balance

Important: define the calculation explicitly in implementation so the client can distinguish:

```text
Operating Site Balance = Income - Site Expenses

After Salary Balance = Income - Site Expenses - Salary
```

---

# 14. Central Data Model

Recommended entities:

```text
Users / Employees
Sites
Work Entries
Expenses
Income Transactions
Salary Records
Roles
Permissions
Audit Logs
```

---

# 15. Suggested Relationships

## User

A User/Employee can have:

- Many Work Entries
- Many Expenses
- Many Salary Records

## Site

A Site can have:

- Many Work Entries
- Many Expenses
- Many Income Transactions

## Work Entry

A Work Entry belongs to:

- One Surveyor
- One Site
- One Assistant (if selected)

A Work Entry may be associated with:

- One or more expense records

## Expense

An Expense belongs to:

- One Employee
- One Site
- Optionally one Work Entry

## Income

An Income transaction belongs to:

- One Site

## Salary

A Salary record belongs to:

- One Employee

---

# 16. Financial Architecture

Do not store only calculated totals.

Store individual transactions.

Example:

```text
Income:
₹25,000
₹30,000
₹45,000

Total:
₹1,00,000
```

Expenses should work the same way.

This allows:

- Historical records
- Corrections
- Auditing
- Filtering
- Reporting
- Financial reconciliation

Totals should be calculated from transaction records.

---

# 17. Financial Record Deletion

Do not permanently delete financial records.

Instead use:

```text
Active
Cancelled / Void
```

When cancelling a record, store:

- Cancelled At
- Cancelled By
- Cancellation Reason

The original transaction must remain available in the audit/history system.

---

# 18. Audit Log

Because the system handles sensitive employee and financial information, maintain an audit log.

Track events such as:

- User created
- User updated
- User deactivated
- User reactivated
- User revoked
- Sub-Admin created
- Sub-Admin permission changed
- Sub-Admin access revoked
- Site created
- Site updated
- Work entry created
- Work entry modified
- Expense created
- Expense modified
- Expense cancelled
- Income created
- Income modified
- Income cancelled
- Salary created
- Salary modified
- Salary status changed

Example:

```text
Admin changed Site Income

Old Amount: ₹20,000
New Amount: ₹25,000
Changed By: Main Admin
Timestamp: 06/10/2026 14:30
```

---

# 19. Security Requirements

The application handles:

- Aadhaar numbers
- Employee information
- Salary
- Expenses
- Income
- Financial reports

Therefore security is mandatory.

Minimum requirements:

- Secure authentication
- Password hashing
- Role-based authorization
- Backend permission checks
- Protected admin routes
- Protected APIs
- Aadhaar access restriction
- Aadhaar masking where appropriate
- Input validation
- Server-side validation
- Protection against unauthorized data access
- Audit logging
- Secure session/token handling
- Financial record history

Never rely solely on frontend route hiding for security.

---

# 20. Access Control Rules

Examples:

### User attempts to access Admin API

Result:

```text
403 Forbidden
```

### User attempts to modify salary

Result:

```text
403 Forbidden
```

### User attempts to create site income

Result:

```text
403 Forbidden
```

### Sub-Admin without salary permission attempts to manage salary

Result:

```text
403 Forbidden
```

The backend must enforce all such rules.

---

# 21. Employee Count and Site Count

Dashboard should track:

- Active employee count
- Active site count

Example:

```text
25 Active Employees
12 Active Sites
```

Do not count inactive/revoked employees as active.

Do not count inactive/completed sites as active unless the report explicitly requests them.

---

# 22. Exporting Reports

All major reports should support:

- PDF
- Excel
- Print

Exports should respect:

- Current filters
- Current date range
- Current employee/site selection
- User permissions

An employee should not be able to export information they are not authorized to view.

---

# 23. Invoice / Report Generation

Reports should be generated dynamically from the central database.

Do not manually duplicate data into report-specific tables unless there is a strong technical reason.

Example:

```text
Work Entry
    ↓
Report Engine
    ├── Overall Work/Site
    ├── Personal Employee Work
    ├── Overall Employee Work
    ├── Site Invoice
    └── Financial reports
```

---

# 24. Recommended Navigation

## Main Admin / Admin Home

Suggested navigation:

```text
Dashboard
Employees
Sites
Work Entries
Expenses
Income
Salary
Reports / Invoices
Users & Permissions
Audit Logs
Settings
```

## User Home

Suggested navigation:

```text
Dashboard
Add Work Entry
My Work
My Expenses
My Sites
My Salary
```

Only show modules allowed by permissions, while still enforcing permissions on the backend.

---

# 25. Recommended Work Entry UI

Example:

```text
---------------------------------------
Add Work Entry
---------------------------------------

Site:
[ Select Site ]

Date:
[ 06/10/2026 ]

Time:
[ 10:30 AM ]

Surveyor:
[ Rahul Patil ]  ← automatically logged-in user

Assistant:
[ Select Assistant ]

Site Expense:
[ ₹ 500 ]

Remarks:
[ Travel to site ]

[ Save Work Entry ]
```

The Surveyor field must not be user-editable.

---

# 26. Recommended Admin Site Income UI

```text
---------------------------------------
Add Site Income
---------------------------------------

Site:
[ ABC Site ]

Date:
[ 06/10/2026 ]

Amount:
[ ₹25,000 ]

Description:
[ Client Payment ]

Status:
[ Received ]

Remarks:
[ First payment ]

[ Save Income ]
```

---

# 27. Important Business Rules

## Rule 1 — Main Admin

Exactly one Main Admin must always exist.

## Rule 2 — No public registration

Users are created by Admin.

## Rule 3 — User access

Users cannot access Admin Home.

## Rule 4 — Backend authorization

Permissions must be enforced server-side.

## Rule 5 — Employee expenses

Employees/Surveyors enter their own site expenses.

## Rule 6 — Site income

Admin controls site income.

## Rule 7 — Salary

Admin controls salary.

## Rule 8 — Future work

Future work date/time is prohibited.

## Rule 9 — Financial deletion

Financial records are not permanently deleted.

## Rule 10 — Centralized reporting

All reports use centralized data.

## Rule 11 — Unique Employee ID

Employee ID must be unique.

## Rule 12 — Sensitive Aadhaar

Aadhaar must be protected and access-restricted.

---

# 28. Open Business Decisions

These should be confirmed before final production implementation.

## 28.1 Work quantity

Define exactly how employee work is measured:

- Work entries
- Working days
- Sites
- Hours
- Combination

## 28.2 Assistant counting

Current recommended rule:

- Assistant counts as a separate worker
- Unique workers are deduplicated

Confirm with client if billing/manpower calculations depend on this.

## 28.3 Invoice numbering

Define format such as:

```text
INV-2026-00001
```

or separate numbering per report type.

## 28.4 Report status

Determine whether generated reports need:

- Draft
- Final
- Cancelled

## 28.5 Salary calculation

Confirm whether salary is:

- Fixed monthly
- Attendance based
- Work based
- Combination

## 28.6 Completed sites

Determine whether completed sites:

- Remain visible
- Become read-only
- Are archived

## 28.7 Sub-Admin permissions

Finalize exact permission matrix.

## 28.8 Income semantics

Confirm whether income represents:

- Client payment
- Invoice amount
- Advance
- Other receipt

## 28.9 Expense categories

Optional future categories:

- Travel
- Fuel
- Food
- Accommodation
- Equipment
- Other

---

# 29. Recommended Development Order

Build in this order.

## Phase 1 — Foundation

- Project setup
- Database
- Authentication
- User roles
- Main Admin protection
- Authorization middleware

## Phase 2 — Employee Management

- Employee onboarding
- User accounts
- Employee status
- Employee management

## Phase 3 — Site Management

- Site onboarding
- Site status
- Site management

## Phase 4 — Work Management

- Work entry
- Assistant selection
- Date/time validation
- Employee expenses
- Remarks

## Phase 5 — Financial Management

- Expense transactions
- Site income
- Income statuses
- Salary records

## Phase 6 — Dashboards

- Admin dashboard
- Employee dashboard
- Metrics and summaries

## Phase 7 — Report Engine

Build centralized report queries/services.

Then implement all 14 reports.

## Phase 8 — Export

- PDF
- Excel
- Print

## Phase 9 — Audit & Security

- Audit logs
- Financial history
- Security hardening
- Permission testing

## Phase 10 — Production QA

Test:

- Roles
- Permissions
- Date validation
- Financial calculations
- Report filters
- Export accuracy
- Main Admin protection
- Data privacy

---

# 30. Recommended Testing Scenarios

## Authentication

- Valid login
- Invalid login
- Inactive user login
- Revoked user login
- Logout
- Session expiration

## Authorization

- User → Admin route
- User → Admin API
- Sub-Admin without permission
- Main Admin full access

## Work

- Current work entry
- Past work entry
- Future work rejection
- Assistant selection
- Expense entry
- Remarks entry

## Financial

- Add expense
- Modify expense
- Cancel expense
- Add income
- Modify income
- Cancel income
- Salary creation
- Salary payment status

## Reporting

Verify the same transaction appears correctly in every relevant report.

Example:

```text
One ₹500 expense
        ↓
All relevant expense/work/financial reports
        ↓
Totals remain consistent
```

---

# 31. Important Consistency Requirement

All report calculations must use the same business logic.

For example:

If:

```text
Site Income = ₹100,000
Site Expenses = ₹20,000
```

then:

```text
Site Net Balance = ₹80,000
```

The same values must appear consistently across:

- Site Profit/Loss
- Overall Financial Summary
- Site Invoice where applicable
- Income reports
- Expense reports

There must not be different totals caused by duplicate calculation logic.

Prefer centralized services/query logic for financial calculations.

---

# 32. Data Integrity

Use database constraints where possible.

Examples:

- Unique Employee ID
- Valid foreign keys
- Required Site on Work Entry
- Required Surveyor on Work Entry
- Valid employee references
- Valid site references
- Non-negative financial amounts where appropriate
- Valid dates
- Valid statuses

Use transactions for multi-record financial operations where required.

---

# 33. Final Architecture Principle

The application is fundamentally a **work + employee + site + financial management system with an invoice/report layer**.

Do not think of it as 14 independent invoices.

Think of it as:

```text
                    ┌───────────────┐
                    │    USERS      │
                    │  Employees    │
                    └───────┬───────┘
                            │
                            │
                    ┌───────▼───────┐
                    │     SITES     │
                    └───────┬───────┘
                            │
                    ┌───────▼────────┐
                    │  WORK ENTRIES  │
                    └───────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         EXPENSES         INCOME        SALARY
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                 ┌────────────────────┐
                 │ REPORT/INVOICE     │
                 │      ENGINE        │
                 └─────────┬──────────┘
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
       WORK REPORTS   FINANCIAL REPORTS   SALARY REPORTS
```

This architecture should be the source of truth for implementation.

---

# 34. Final Scope Summary

## Core entities

**7+ core areas:**

1. Users / Employees
2. Sites
3. Work Entries
4. Expenses
5. Income
6. Salary
7. Roles / Permissions
8. Audit Logs

## Core dashboards

2:

1. Admin Dashboard
2. Employee Dashboard

## Core invoice/report types

**14:**

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
13. Site Profit/Loss Invoice
14. Overall Financial Summary Invoice

## Export formats

- PDF
- Excel
- Print

## Key access rules

- Exactly one Main Admin
- Admin creates users
- Users cannot self-register
- Users cannot access Admin Home
- Backend authorization is mandatory
- Employee enters expense and remarks
- Admin controls site income
- Admin controls salary
- Future work entries are prohibited
- Financial records are retained, not hard-deleted
- Aadhaar is protected

---

# 35. Instruction to Development / AI Agent

When implementing this project:

1. Treat this document as the current master specification.
2. Do not invent conflicting business rules.
3. Do not revert the expense rule: **employees enter their own expenses and remarks**.
4. Do not allow users to enter site income.
5. Do not allow users to edit salary.
6. Do not create duplicate databases/tables solely for each invoice.
7. Build a centralized data model and report engine.
8. Enforce permissions in backend APIs/services.
9. Preserve financial history.
10. Protect the only Main Admin from deletion/demotion.
11. Validate future dates/times on the backend.
12. Keep report calculations consistent.
13. Use the 14 reports listed in this specification as the initial reporting scope.
14. Keep unresolved business decisions configurable where practical rather than hard-coding assumptions.
15. If a requirement changes later, update the central business logic and all dependent reports rather than adding inconsistent special-case logic.

**This document represents the current agreed product direction for the Moraya Land Surveyors Invoice Management App.**
