# Moraya Land Surveyors — Frontend Rules & UI Standards

## 1. Primary UI References

The frontend should take UX inspiration from:

- Zoho Invoice — business/invoice workflow, dashboards, expenses, reports, roles and permissions.
- FreshBooks — clean invoice, project, expense and detail-page experience.

These are references only. Do not copy their branding, layouts, assets, or proprietary designs.

The Moraya application must have its own identity and workflow.

## 2. User-Side Rendering First

The application should be designed primarily as a client-rendered React PWA.

Recommended architecture:

Browser
→ React + TypeScript
→ Cloudflare static assets
→ Cloudflare Worker API
→ Supabase

The main authenticated application UI should render in the user's browser.

Do not unnecessarily use server-side rendering for authenticated dashboards.

## 3. Keep Cloudflare Workers Lightweight

Cloudflare Workers should primarily act as the secure API/business-logic layer.

Frontend responsibilities:
- UI rendering
- Form interaction
- Local UI state
- Loading states
- Client-side validation
- Responsive layouts
- Local filtering where appropriate

Worker responsibilities:
- Authentication verification
- Authorization
- Business rules
- Sensitive operations
- Database operations
- Verification actions
- Trusted financial calculations
- Audit logging

Do not send every small UI interaction through the Worker.

## 4. Protect the Free Tier

Design the application to stay comfortably within Cloudflare Workers Free limits.

Current documented limits include:
- 100,000 requests/day
- 10 ms CPU time/request
- 50 external subrequests/request
- 128 MB memory
- 64 environment variables
- 5 cron triggers/account

Avoid:
- Polling every few seconds
- Unnecessary dashboard refreshes
- Repeated API calls for the same data
- Huge API responses
- Fetching entire tables when only a small page is needed
- Unnecessary server-side rendering
- Expensive calculations on every page load

## 5. Pagination

Never load thousands of records into the browser unnecessarily.

Suggested defaults:
- Employees: 20/page
- Work Entries: 25–50/page
- Expenses: 25–50/page
- Audit Logs: 25–50/page

Use server-side pagination for large datasets.

## 6. Search

Search must be efficient.

For small datasets such as 21 employees, load active employees once and filter locally where practical.

For server search, use approximately 300–500 ms debounce before making a request.

## 7. Dashboard Performance

Avoid many independent API requests.

Prefer optimized summary endpoints.

Example:

GET /api/admin/dashboard

Can return:
- employees
- sites
- pendingVerification
- income
- expenses
- salary
- recentWork

The dashboard should feel instant.

## 8. Never Expose Secrets

Never put these in frontend code:
- Supabase service-role key
- Database password
- Cloudflare API token
- Private API keys
- Secret signing keys
- Encryption keys
- Admin credentials
- Third-party private credentials

Anything bundled into the frontend should be treated as publicly visible.

Server-only secrets should follow:

Browser
→ Cloudflare Worker
→ Secret
→ Supabase/external service

Never expose private credentials to the browser.

## 9. Never Trust Frontend Authorization

The frontend may hide/show UI for usability, but it must not be the security boundary.

Correct flow:

Browser
→ Authenticated request
→ Cloudflare Worker
→ Identify user
→ Check role
→ Check permission
→ Execute operation

Supabase RLS provides additional protection.

## 10. No Vibecoded UI

The application must not look AI-generated, template-generated, or vibecoded.

Avoid:
- Excessive gradients
- Random glassmorphism
- Giant glowing cards
- Excessive rounded containers
- Random emojis
- Generic AI-dashboard layouts
- Too many colors
- Giant numbers everywhere
- Decorative elements with no purpose
- Excessive animations
- Every section being a card
- Fake-looking charts
- Inconsistent spacing

The UI should look like a real commercial SaaS product.

Design benchmark:
Zoho Invoice's business clarity + FreshBooks' polished simplicity + Moraya-specific workflow.

## 11. Design Consistency

Create a proper design system.

Define:
- Typography
- Heading sizes
- Body text
- Table text
- Labels
- Helper text
- Financial number styles
- Spacing scale
- Border radius
- Border thickness
- Divider style
- Shadow rules

Use semantic colors:
- Primary
- Success
- Warning
- Danger
- Info
- Neutral
- Background
- Surface
- Text
- Muted Text

Do not choose colors randomly page by page.

## 12. Financial Numbers

Money is a primary part of the application.

Use clear formatting:

₹1,25,000
₹8,45,000
₹12,500

Avoid displaying financial values without formatting unless raw numeric input requires it.

Financial columns should generally be right-aligned.

## 13. Status Design

Use consistent status badges:

- VERIFIED
- PENDING
- CHANGES REQUESTED
- REJECTED
- CANCELLED

Status appearance must remain consistent across the application.

## 14. Professional Tables

Tables should support:
- Sorting
- Filtering
- Pagination
- Search
- Column alignment
- Sticky headers where useful
- Row actions
- Empty states
- Loading states

Desktop example:

Date | Employee | Site | Expense | Status

On mobile, convert suitable tables into cards or use controlled horizontal scrolling.

## 15. Do Not Put Everything in Tables

Use cards on mobile when appropriate.

Desktop:
Date | Employee | Site | Expense | Status

Mobile:
Employee
Site
Date
Expense
Status

The user should not need to zoom in to use the application.

## 16. Detail Pages and Side Panels

Use:
- Detail pages
- Tabs
- Side panels
- Dialogs where appropriate

Example Site Details:

Overview
Work
Expenses
Income
Reports
Activity

Example Employee Details:

Profile
Work
Expenses
Salary
Activity

## 17. Forms Should Feel Fast

For Work Entry:

Site
→ Date + Time
→ Assistant
→ Expense
→ Remarks
→ Submit

Do not show unnecessary fields.

Use:
- Clear labels
- Helpful placeholders
- Inline validation
- Keyboard-friendly inputs
- Appropriate input types
- Clear error messages
- Loading state during submission

## 18. Worker UI Must Differ From Admin UI

Admin:
- Information-dense
- Tables
- Financial summaries
- Verification
- Reports
- Management tools

Worker:
- Action-focused
- Add Work Entry
- My Work
- My Expenses
- My Sites
- My Salary
- Pending
- Changes Requested

Workers should reach Add Work Entry quickly.

## 19. Mobile-First Worker Experience

Worker UI should prioritize:
- Large buttons
- Large form controls
- Easy site search
- Easy assistant search
- Numeric expense entry
- Simple date/time selection
- Clear submission status
- Minimal typing

Primary action:
+ Add Work Entry

## 20. Admin Dashboard

Do not overload the dashboard with dozens of cards.

Recommended:
- Active Employees
- Active Sites
- Pending Verification
- Site Income
- Site Expenses
- Salary Pending

Then:
- Financial Overview
- Recent Work
- Pending Verification
- Recent Expenses

The dashboard should answer:
"What needs my attention right now?"

## 21. Invoice Design

Invoices should be professional and printable.

Include:
- MORAYA LAND SURVEYORS
- Invoice/Report Title
- Invoice Number
- Date/Period
- Employee/Site/Client information
- Description
- Date
- Work
- Expense
- Income
- Subtotal
- Total
- Status
- Generated Date

Avoid overly decorative invoice designs.

Invoices must remain professional when printed in black and white.

## 22. Reports

Reports should feel like a product, not a raw database export.

Structure:

Reports
├── Work
├── Expenses
├── Income
├── Salary
└── Financial

Then:
- Date Range
- Employee
- Site
- Client
- Status
- Generate Report
- Preview
- Download PDF
- Export Excel
- Print

## 23. Loading States

Never show a blank screen while data loads.

Use:
- Skeleton loaders
- Button loading states
- Table skeletons
- Dashboard skeletons

## 24. Empty States

Use useful empty states.

Instead of:
"No data"

Use:
"No work entries found for this date range."

Provide a relevant action when appropriate:
[Add Work Entry]

## 25. Error Handling

Do not expose raw technical errors to normal users.

Avoid:
"500 Internal Server Error"

Prefer:
"We couldn't save this work entry. Please try again."

Validation should be understandable:
"Expense amount must be greater than ₹0."

## 26. Confirmation for Dangerous Actions

Require confirmation for:
- Delete/deactivate
- Reject
- Cancel income
- Cancel expense
- Revoke user
- Revoke Sub-Admin
- Change permissions

Financial operations should require a reason where appropriate.

## 27. Animations

Use subtle animation only for:
- Page transitions
- Dropdowns
- Dialogs
- Toasts
- Hover states
- Loading transitions

Avoid excessive motion.

The interface should feel fast, not animated for the sake of animation.

## 28. Accessibility

Support:
- Keyboard navigation
- Proper labels
- Visible focus states
- Adequate contrast
- Screen-reader-friendly controls
- Accessible dialogs
- Proper button semantics

## 29. Responsive Design

Support:
- Mobile
- Tablet
- Laptop
- Desktop
- Large Desktop

Worker pages should be mobile-first.

Admin pages can be desktop-first with strong tablet/mobile adaptation.

## 30. Avoid Unnecessary API Calls

Use caching and query invalidation intelligently.

For example:
Employee list
→ Fetch once
→ Cache
→ Reuse across forms

This reduces Worker usage and improves performance.

## 31. Static Assets

Serve React static assets efficiently through Cloudflare.

Keep:
- JS
- CSS
- Images
- Icons
- Fonts
as static assets where possible.

Keep the Worker for actual backend/API work.

## 32. Avoid Heavy Frontend Dependencies

Do not install libraries without a real requirement.

Preferred base:
- React
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query

Add another dependency only when there is a genuine requirement.

## 33. No Secrets in GitHub

Never commit:
- .env
- .env.production
- Service-role keys
- Database passwords
- Private API keys
- Cloudflare API tokens
- JWT signing secrets

Use:
- Local environment files for development
- Cloudflare/Supabase secret management for production

Sensitive files must be in .gitignore.

## 34. Browser Storage

Do not store highly sensitive information unnecessarily in:
- localStorage
- sessionStorage
- IndexedDB

Especially avoid storing:
- Aadhaar
- Salary data
- Private credentials
- Service-role tokens
- Database passwords

## 35. Financial Calculations

The frontend may display calculations for responsiveness, but trusted financial calculations must be performed or verified server-side.

Example:

Site Net Balance
= Verified Income
- Verified Expenses

The frontend must not be able to manipulate the final trusted value.

## 36. Verification UX

Verification should be immediately understandable.

Example:

Pending Verification — 8

Rahul
ABC Site
₹500
06 Oct 2026

[View]
[Approve]
[Request Changes]
[Reject]

Request Changes and Reject should require a reason.

## 37. Audit UX

Audit logs should be human-readable.

Example:

Admin changed Site Income

ABC Site

₹20,000 → ₹25,000

Changed by: Main Admin
Date: 06 Oct 2026
Reason: Client payment updated

Do not expose raw database records directly.

## 38. Performance Target

The application should feel fast on a normal Indian mobile connection.

Priorities:
1. Small initial bundle
2. Lazy-loaded admin modules
3. Optimized images
4. Cached API data
5. Pagination
6. Debounced search
7. Minimal Worker calls
8. Skeleton loading
9. Optimistic UI only where safe
10. No unnecessary animations

## 39. Security Priority

Frontend development priority:

1. Security
2. Data correctness
3. Reliability
4. Performance
5. Usability
6. Visual polish

A beautiful UI that exposes Aadhaar, salary, or financial information is unacceptable.

## 40. Final Frontend Principle

The application should feel like:

"A professionally designed business SaaS product built by an experienced product team."

Not:

"A collection of AI-generated dashboard screens."

The visual benchmark should be:

Zoho Invoice's business clarity
+
FreshBooks' polished simplicity
+
Moraya-specific field-work workflow.

## Recommended Architecture

USER'S BROWSER
        ↓
React + TypeScript
        ↓
Client-side rendering
        ↓
┌───────────────────────┐
│                       │
│ Static UI             │ API Calls
│                       │
↓                       ↓
Cloudflare Static     Cloudflare Worker
Assets                    │
                          ↓
                  Auth + RBAC +
                  Business Rules
                          │
                          ↓
                       Supabase
                    ┌─────┼─────┐
                    │     │     │
                PostgreSQL Auth Storage
                    │
                   RLS

## Final Recommendation

Build the frontend as a polished, client-rendered React PWA with a strong mobile worker experience and an information-rich admin experience.

Use Zoho Invoice and FreshBooks as real-product UX references, but create an original Moraya design.

Keep Cloudflare Workers lightweight and API-focused so the application comfortably fits the current free-tier architecture.

Never expose secrets in the frontend, never trust frontend authorization, and never sacrifice security for visual polish.
