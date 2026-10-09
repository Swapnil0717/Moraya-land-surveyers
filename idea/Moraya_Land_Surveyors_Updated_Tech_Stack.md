# Moraya Land Surveyors — Updated Tech Stack

## 1. Frontend

| Technology | Purpose |
|---|---|
| React | Build the web application UI |
| TypeScript | Type-safe development |
| Vite | Fast development and production build |
| Tailwind CSS | Responsive UI styling |
| React Hook Form | Form handling |
| Zod | Form and data validation |
| TanStack Query | Server-state, API data fetching, caching |

## 2. Backend

### Cloudflare Workers

Cloudflare Workers will be the backend/API layer.

Responsibilities:
- Authentication checks
- Role and permission checks
- Business logic
- Input validation
- Work-entry processing
- Expense processing
- Income processing
- Salary processing
- Verification workflow
- Report calculations
- PDF/Excel generation where appropriate
- Audit logging
- Secure communication with Supabase

Architecture:

React PWA → Cloudflare Workers API → Supabase

## 3. Database

### Supabase PostgreSQL

Core entities:
- Users
- Employees
- Roles
- Permissions
- Sites
- Work Entries
- Expenses
- Income Transactions
- Salary Records
- Verification Records
- Audit Logs

PostgreSQL is appropriate because the application contains relational and financial data.

## 4. Authentication

### Supabase Auth

Use Supabase Auth for:
- Login
- Password authentication
- Session management
- User identity
- Password reset
- Authentication tokens

## 5. Authorization

Use:

### RBAC + Permissions + Supabase RLS

Main roles:
- Main Admin
- Sub-Admin
- Worker / Surveyor

Sub-Admin access is controlled through individual permissions such as:
- employee_management
- site_management
- verification
- income_management
- salary_management
- report_view
- export

Backend authorization is mandatory. Frontend UI restrictions are not considered security.

## 6. Row Level Security

### Supabase RLS

Use RLS as an additional database-level security layer.

Security model:

Frontend authorization
+
Cloudflare Worker authorization
+
Supabase RLS

## 7. File Storage

### Supabase Storage

Use for:
- Employee documents
- Generated documents
- Attachments
- Supporting financial documents

Access must be controlled through authentication and authorization.

## 8. PWA

The application will be a Progressive Web App.

Technologies:
- Web App Manifest
- Service Worker
- Workbox where useful
- Responsive CSS
- Mobile-first UI

The application can be installed on Android, iPhone, Windows, macOS, and tablets.

Separate Android/iOS applications are not required for V1.

## 9. Mobile UI

Worker interface should be mobile-first.

Important UX:
- Large touch targets
- Searchable site selection
- Searchable assistant selection
- Numeric expense input
- Quick Add Work Entry
- Easy date/time selection
- Card-based history
- Clear verification status
- Minimal typing
- Responsive tables/cards

## 10. Forms and Validation

### React Hook Form + Zod

Use for:
- Employee forms
- Site forms
- Work Entry forms
- Expense forms
- Income forms
- Salary forms
- Permission forms

Validation must happen on both frontend and backend.

## 11. API/Data Management

### TanStack Query

Use for:
- Fetching employees
- Fetching sites
- Fetching work entries
- Fetching expenses
- Fetching income
- Fetching salary
- Verification queues
- Dashboard statistics
- Caching
- Loading states
- Mutations
- Refetching after updates

## 12. PDF Generation

Use a Cloudflare-compatible PDF generation approach.

PDFs should support:
- Company information
- Report title
- Filters/date range
- Tables
- Totals
- Page numbers
- Generated date
- Employee/site information
- Financial summaries

## 13. Excel Export

Use ExcelJS or another Cloudflare-compatible Excel generation solution.

Exports:
- PDF
- Excel
- Print

Exports must respect permissions and selected filters.

## 14. Reporting

Use one central report engine rather than 14 independent report systems.

Database
→ Central Report Engine
→ Report Queries
→ 14 Report Types
→ PDF / Excel / Print

Report types:
1. Overall Work/Site Invoice
2. Personal Employee Work Invoice
3. Overall Employee Work Invoice
4. Site Invoice
5. Overall Site Total Expense
6. Individual Site Expense
7. Employee Expense
8. Overall Site Total Income
9. Individual Site Income
10. Individual Employee Salary
11. Overall Salary
12. Employee Salary + Expense Summary
13. Site Net Balance
14. Overall Financial Summary

## 15. Testing

### Vitest

For:
- Utility functions
- Validation
- Business calculations
- Report calculations
- Permission logic

### Playwright

For end-to-end testing:
- Login
- Dashboard
- Create Work Entry
- Submit
- Admin Verification
- Approve
- Reports
- Export

Test roles:
- Main Admin
- Sub-Admin
- Worker

## 16. Version Control

### Git + GitHub

Recommended flow:

GitHub Repository
→ Development
→ Testing
→ Production

Use Git branches for development and controlled production releases.

## 17. Deployment

Frontend/API:
- Cloudflare

Database/Authentication/Storage:
- Supabase

Architecture:

React PWA
→ Cloudflare Workers
→ Supabase PostgreSQL / Auth / RLS / Storage

## 18. Environment Management

Use separate configurations for:
- Development
- Testing
- Production

Secrets such as Supabase credentials and API credentials must not be committed to GitHub.

## 19. Security

The application contains:
- Aadhaar information
- Employee information
- Salary
- Expenses
- Income
- Financial reports

Required:
- Supabase Auth
- RBAC
- Permissions
- Cloudflare Worker authorization
- Supabase RLS
- Server-side validation
- Audit Logs
- Financial record protection

Aadhaar should be restricted and masked where appropriate and should not be unnecessarily exposed in reports.

## 20. Financial Data Protection

Financial records should not be hard-deleted.

Use:
Active → Cancelled / Void → Reason + Audit Log

Changes to financial records should record:
- Who made the change
- Timestamp
- Old value
- New value
- Reason where applicable

## 21. Offline Support

Full offline synchronization is not required for V1.

The architecture can support offline functionality later, but V1 should remain online-first to avoid unnecessary synchronization and conflict complexity.

## 22. Scale

Current users: 21.

Do not hard-code a 21-user limit. The system should allow growth without code changes.

There is no need for:
- Kubernetes
- Microservices
- Kafka
- Elasticsearch
- Redis
- Separate mobile applications
- Complex distributed infrastructure

for the current application size.

# Final Recommended Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Forms | React Hook Form |
| Validation | Zod |
| API Data | TanStack Query |
| Backend | Cloudflare Workers |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Authorization | RBAC + Permissions |
| Database Security | Supabase RLS |
| File Storage | Supabase Storage |
| PWA | Web Manifest + Service Worker / Workbox |
| PDF | Cloudflare-compatible PDF solution |
| Excel | ExcelJS / compatible solution |
| Unit Testing | Vitest |
| E2E Testing | Playwright |
| Version Control | Git + GitHub |
| Deployment | Cloudflare + Supabase |
| ORM | None initially |

# Overall Architecture

React + TypeScript + Vite
        ↓
Tailwind CSS
        ↓
React Hook Form + Zod
        ↓
TanStack Query
        ↓
Cloudflare Workers
        ↓
Supabase
 ├── PostgreSQL
 ├── Auth
 ├── RLS
 └── Storage

## Final Recommendation

This stack is designed for the current 21-user Moraya Land Surveyors system. It prioritizes security, data correctness, reliability, mobile usability, maintainability, and low infrastructure cost without introducing unnecessary infrastructure.
