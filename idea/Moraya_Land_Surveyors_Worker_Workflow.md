# Moraya Land Surveyors — Worker Workflow

## 1. Worker Role

Workers/Surveyors can:
- Create work entries
- Select a site
- Select an assistant
- Enter their own site expense
- Enter remarks
- View their relevant work history
- View their own expenses
- View assigned/relevant sites
- View salary if enabled
- See verification status
- Respond to change requests

Workers cannot:
- Create employees
- Create Sub-Admins
- Manage permissions
- Manage sites
- Enter site income
- Edit salary
- Verify submissions
- Access Admin Home
- Access Admin APIs

## 2. Worker Login

1. Worker opens the application.
2. Enters credentials.
3. Supabase Auth authenticates the account.
4. Backend identifies the authenticated employee.
5. Backend checks that the account is active.
6. Worker is routed to Worker Dashboard.

There is no public self-registration.

## 3. Worker Dashboard

Dashboard should show:
- Welcome/current employee
- Add Work Entry
- My Work count
- My Sites
- My Expenses
- My Salary if enabled
- Pending submissions
- Changes Requested
- Recent submissions
- Verification status

## 4. Add Work Entry

Worker selects:

1. Site
2. Date
3. Time
4. Assistant, if applicable
5. Own site expense
6. Remarks

Surveyor is automatically set to the logged-in worker.

The worker cannot choose another Surveyor.

Example:

Worker = Rahul
Site = ABC Site
Assistant = Amit
Expense = ₹500
Remarks = Travel expense

## 5. Surveyor and Assistant Rule

Surveyor and Assistant are contextual roles for each Work Entry.

The same employee can be:
- Surveyor on one work entry
- Assistant on another work entry

Example:

Work Entry 1:
Surveyor = Rahul
Assistant = Amit

Work Entry 2:
Surveyor = Amit
Assistant = Rahul

This is valid.

Normally prevent:

Surveyor = Rahul
Assistant = Rahul

on the same work entry.

## 6. Work Entry ID

The system generates the Work Entry ID.

Example:

WE-2026-00001

Worker does not manually create the ID.

## 7. Date and Time Validation

Worker can submit current or past work.

Future work entries must not be allowed.

Validation should happen:
- In the frontend
- Again on the backend

Backend validation is authoritative.

## 8. Expense Entry

The worker enters their own site expense.

Example:

Employee: Rahul
Site: ABC Site
Date: 06/10/2026
Expense: ₹500
Remarks: Travel

Expense may optionally have a category such as:
- Travel
- Food
- Transport
- Other

The worker cannot enter site income.

## 9. Remarks

Worker can add remarks related to:
- Work performed
- Site activity
- Expense details
- Relevant notes

Remarks are submitted with the work entry.

## 10. Submission

After completing the form:

Worker submits
→ PENDING_VERIFICATION

The worker should see confirmation that the submission is awaiting Admin verification.

## 11. Verification Workflow

Worker submission lifecycle:

DRAFT
→ PENDING_VERIFICATION
→ VERIFIED

or:

PENDING_VERIFICATION
→ CHANGES_REQUESTED
→ Worker edits
→ Resubmits
→ PENDING_VERIFICATION

or:

PENDING_VERIFICATION
→ REJECTED

Statuses:
- DRAFT
- PENDING_VERIFICATION
- VERIFIED
- CHANGES_REQUESTED
- REJECTED
- CANCELLED

## 12. Changes Requested

If Admin requests changes:

1. Worker receives/ sees the change request.
2. Worker opens the submission.
3. Worker reads Admin's reason.
4. Worker edits permitted fields.
5. Worker resubmits.
6. Status becomes PENDING_VERIFICATION.
7. Admin reviews again.

Previous history/version should be retained.

## 13. Rejected Submission

If Admin rejects a submission:

- Worker can see REJECTED status.
- Worker can see the rejection reason.
- Original submission remains in history.
- Rejected records are excluded from official totals.
- If the business rules allow correction, worker may create/resubmit a corrected entry.

## 14. Verified Submission

Once Admin approves:

Status = VERIFIED

The record becomes official for reporting.

Worker should not directly edit a verified financial/work record.

If correction is required later, it must use a controlled correction/admin workflow.

## 15. My Work

Worker can view their own work history.

Suggested fields:
- Work Entry ID
- Date
- Time
- Site
- Surveyor
- Assistant
- Expense
- Remarks
- Verification Status

Useful filters:
- Date
- Site
- Status

## 16. My Expenses

Worker can view their own expense history.

Suggested fields:
- Date
- Site
- Work Entry
- Amount
- Category
- Remarks
- Status

Useful totals:
- Total expense
- Verified expense
- Pending expense

## 17. My Sites

Worker can view relevant sites.

Possible information:
- Site Name
- Site Location
- Client
- Site Status
- Recent work
- Relevant activity

Workers cannot create or modify sites.

## 18. My Salary

If enabled by the Admin, worker can view their own salary information.

Suggested fields:
- Salary Period
- Salary Amount
- Credited Date
- Payment Status
- Remarks

Worker cannot modify salary.

## 19. Worker Mobile Experience

The Worker UI should be mobile-first.

Recommended:
- Large buttons
- Simple navigation
- Searchable site selector
- Searchable assistant selector
- Numeric expense input
- Easy date/time controls
- Quick Add Work Entry
- Card-based work history
- Clear verification badges
- Minimal typing

The PWA can be installed on Android/iPhone.

## 20. Worker Navigation

Dashboard
- Add Work Entry
- My Work
- My Expenses
- My Sites
- My Salary

## 21. Worker Security Rules

- Worker can access only authorized worker functionality.
- Worker cannot access Admin Home.
- Worker cannot create Admin/Sub-Admin accounts.
- Worker cannot change their role.
- Worker cannot change permissions.
- Worker cannot enter site income.
- Worker cannot edit salary.
- Worker cannot verify submissions.
- Worker cannot select another Surveyor.
- Backend must enforce all restrictions.
- Frontend restrictions alone are not sufficient.

## 22. Worker Data Flow

Worker Login
→ Worker Dashboard
→ Add Work Entry
→ Select Site
→ Date/Time
→ Assistant
→ Own Expense
→ Remarks
→ Submit
→ PENDING_VERIFICATION
→ Admin Review
→ VERIFIED / CHANGES_REQUESTED / REJECTED

## 23. Official Data Rule

Only VERIFIED worker-submitted data should be included in official/final financial reports.

Pending data may be shown separately.

Rejected data is excluded from official totals.
