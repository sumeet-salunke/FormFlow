# FormFlow — Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** V1 Scope Frozen  
**Product:** FormFlow  
**Last Updated:** 2026-09-26

---

## 1. Product Overview

FormFlow is a simplified full-stack form creation and response collection platform inspired by products such as Google Forms.

The platform allows authenticated users to:
- Create forms from scratch or predefined templates.
- Build forms using supported field types.
- Save drafts and preview forms.
- Publish forms using public shareable URLs.
- Collect anonymous responses.
- View and manage responses.
- Export responses as CSV.
- View basic response statistics.
- Close, reopen, duplicate, and delete forms.
- Manage their account.

Respondents do not need a FormFlow account.

V1 intentionally focuses on the core form lifecycle and response workflow rather than reproducing the complete feature set of mature form platforms.

---

## 2. Problem Statement

A useful form platform requires more than rendering input fields. It must handle dynamic form structures, field-specific validation, draft persistence, publishing and immutability, anonymous access, backend response validation, authorization, response storage, availability windows, and response management.

FormFlow provides a focused implementation of these problems while keeping V1 deliberately constrained.

---

## 3. Product Goals

### Primary Goals

1. Allow users to create and manage forms.
2. Support dynamic forms with multiple field types.
3. Support explicit draft persistence.
4. Publish validated forms.
5. Make published forms immutable.
6. Provide public URLs.
7. Allow anonymous response submission.
8. Validate responses against the published form definition.
9. Store responses reliably.
10. Allow owners to view and manage responses.
11. Provide CSV export.
12. Provide basic response statistics.
13. Support scheduled response availability.
14. Provide secure authentication and authorization.
15. Provide clear loading, empty, success, and error states.

### Learning Goals

The project should provide practical experience with:
- Full-stack architecture.
- React and Vite.
- Node.js and Express.
- MongoDB and Mongoose.
- Dynamic data modeling.
- REST API design.
- Authentication and sessions.
- Authorization.
- Request and domain validation.
- Frontend/backend state interaction.
- Backend security.
- Data export.
- Future third-party integrations.

---

## 4. Non-Goals

The following are excluded from V1.

### Authentication
- Email verification.
- Password recovery.
- OTP authentication.
- MFA.
- OAuth/social login.
- Refresh-token authentication.
- Account locking.
- Remember-me functionality.

### Form Features
- File upload.
- Image upload.
- Rating fields.
- Linear scale.
- URL field.
- Signature field.
- Matrix/grid fields.
- Quiz functionality.
- Custom form themes.
- Custom CSS.
- Custom domains.
- QR codes.
- User-created templates.
- Collaboration.
- Advanced autosave.

### Response Features
- Google Sheets integration.
- Email response notifications.
- Respondent accounts.
- Response editing links.
- One-response-per-person enforcement.
- Advanced filtering.
- Advanced analytics.
- Cross-form analytics.
- Bulk response deletion.

### Abuse Prevention
- CAPTCHA.
- Browser fingerprinting.
- IP-based one-response enforcement.
- Device-based identity tracking.

---

## 5. Target Users and Roles

### 5.1 Form Owner

An authenticated FormFlow user who can:
- Create forms.
- Edit drafts.
- Publish forms.
- View and share forms.
- View and manage responses.
- Export responses.
- View basic statistics.
- Close and reopen forms.
- Duplicate published forms.
- Delete forms.
- Manage their account.

### 5.2 Respondent

An anonymous visitor who can:
- Open a public form.
- View its questions.
- Enter answers.
- Submit a response.

Respondents cannot access creator dashboards, existing responses, private creator information, or internal application data.

---

## 6. Core User Journeys

### Registration

```text
Landing → Sign Up → Validate → Create User → Create Session → Dashboard
```

Successful registration automatically authenticates the user.

### Login

```text
Login → Validate → Find User → Verify Password → Create Session → Dashboard
```

Invalid credentials use the generic message:

> Invalid email or password.

### Create From Scratch

```text
Dashboard → Create Form → Start From Scratch → Create Draft
→ Builder → Edit → Save Draft → Preview → Publish
```

### Create From Template

```text
Dashboard → Create Form → Use Template → Select Template
→ Create Draft → Pre-populate → Builder → Save → Publish
```

### Public Submission

```text
Public URL → Load Form → Render → Client Validation
→ Submit → Backend Availability Check → Backend Validation
→ Store Response → Success
```

### View Responses

```text
Dashboard → My Forms → Select Form → Responses → List → Detail
```

---

## 7. Product Structure

```text
Public Website
├── Landing Page
├── Login
├── Sign Up
└── Public Form

Authenticated Application
├── Dashboard
├── My Forms
├── Create Form
├── Form Builder
├── Preview
├── Responses
└── Profile / Account Settings
```

---

## 8. Landing Page Requirements

The landing page is public.

### Navigation
- FormFlow branding.
- Login.
- Sign Up.
- Theme option where appropriate.

### Hero
Must communicate the product value and provide:
- `Get Started`
- `Create Form`

Both actions lead unauthenticated users toward signup.

The hero may contain an animated representation of multiple form previews/cards. Exact animation is a UI implementation decision.

### Benefits
Communicate:
- Easy form creation.
- Shareable forms.
- Simple response collection.
- Centralized response management.
- Basic response insights.
- Simple accessible UX.

### FAQ
Include an FAQ section. Exact copy is a content/design decision.

Anonymous users may view public content but cannot access authenticated application features.

---

## 9. Authentication Requirements

### Registration

Fields:
- Name.
- Email.
- Password.
- Confirm Password.

`confirmPassword` is validation-only and must never be stored.

Client validation:
- Required fields.
- Basic email format.
- Password constraints.
- Password confirmation match.

Server:
- Validate request.
- Check duplicate email.
- Hash password with Argon2.
- Create user.
- Create session.

### Login

Fields:
- Email.
- Password.

Server:
- Validate input.
- Locate user.
- Verify password.
- Create session.

Invalid authentication attempts must not reveal whether an email exists.

### Authentication State

The frontend must support:

```text
UNKNOWN / CHECKING
AUTHENTICATED
UNAUTHENTICATED
```

This prevents redirect/UI flashes during authentication checks.

### Auth Status

Provide an endpoint conceptually equivalent to:

```text
GET /api/auth/me
```

### Sessions

V1 uses `cookie-session`.

Session data must be minimal, such as:

```text
userId
```

It must not contain passwords or full sensitive user documents.

Cookies must use appropriate security settings including `httpOnly`, `secure` in production, and suitable `sameSite`.

### Logout

Conceptually:

```text
POST /api/auth/logout
```

Logout destroys/clears the session and returns the user to the public application.

### Expiration

A `401 Unauthorized` response from an authenticated API must clear client auth state and redirect to login where appropriate.

---

## 10. Account Management

Profile/Account must support:
- View name.
- View email.
- Change name.
- Change password.
- Delete account.
- Logout.

### Email

Email is read-only in V1 because email verification is not implemented.

### Change Password

Requires:
- Current password.
- New password.
- Confirm new password.

Backend:
1. Verify current password.
2. Validate new password.
3. Hash using Argon2.
4. Replace password hash.
5. Invalidate current session.
6. Require login again.

### Delete Account

Requires explicit confirmation and password confirmation.

Deletion permanently removes:
- User.
- Forms.
- Responses.

Session is destroyed and the user is redirected home.

Deleted users' public form URLs must no longer resolve to available forms.

---

## 11. Dashboard Requirements

Authenticated users have access to a dashboard.

Navigation:
- Dashboard.
- My Forms.
- Create Form.
- Profile.
- Theme option where appropriate.
- Logout.

Responses are form-specific and are not a global sidebar item in V1.

### Empty Dashboard

When no forms exist, show an empty state with:

```text
Create Form
```

---

## 12. My Forms Requirements

Each form entry should show:
- Title.
- Status.
- Response count.
- Created date.
- Relevant actions.

Exact visual layout is a UI decision.

---

## 13. Form Creation

Create Form provides:
1. Start From Scratch.
2. Use a Template.

Both paths create a normal draft and converge on the same builder.

---

## 14. Form Data Model Requirements

A form conceptually contains:

```text
Form
├── title
├── description
└── questions[]
```

Title and description are form-level metadata, not field types.

Each question must have:
- Stable unique field ID.
- Field type.
- Question text.
- Required state.
- Explicit order.
- Type-specific configuration.

Choice fields additionally contain options.

---

## 15. V1 Field Types

### Basic
1. Short Answer
2. Paragraph
3. Number
4. Email
5. Date

### Choice
6. Multiple Choice
7. Checkboxes
8. Dropdown

Unsupported field types must not be exposed in the V1 builder.

---

## 16. Form Builder Requirements

The builder should visually resemble the final respondent experience rather than functioning solely as a configuration panel.

Initial draft contains:
- Title.
- Description.
- `+ Add Field`.

Field selector:

```text
Basic
- Short Answer
- Paragraph
- Number
- Email
- Date

Choice
- Multiple Choice
- Checkboxes
- Dropdown
```

New fields should have sensible defaults such as:
- `Untitled question`
- Required off

Choice fields should receive a small default set of options. Exact count is a UI decision.

---

## 17. Field Management

Creators can:
- Add.
- Edit.
- Delete.
- Reorder.
- Duplicate.
- Toggle Required.

### Field IDs

Every field has a unique stable ID.

Field IDs:
- Are independent of question text.
- Remain stable while editing a draft.
- Are regenerated for duplicated fields.
- Are used as response keys.

Duplicating a field must never reuse the original field ID.

---

## 18. Choice Fields

Multiple Choice, Checkboxes, and Dropdown support:
- Add option.
- Edit option.
- Delete option.
- Reorder options where appropriate.

Publishing must reject invalid choice configurations such as empty or invalid options and inappropriate duplicates.

---

## 19. Reordering

Fields must support reordering. Drag-and-drop is preferred.

The explicit order must be persisted.

---

## 20. Preview

Builder controls:

```text
Edit | Preview | Save Draft | Publish
```

Preview:
- Hides creator controls.
- Resembles respondent experience.
- Uses current local builder state.
- Does not create a response.
- Does not publish the form.

---

## 21. Draft Persistence

V1 uses explicit Save Draft. There is no autosave.

### Draft Creation

A draft is created when the user selects:
- Start From Scratch.
- A system template.

Backend creates the draft and returns its form ID.

### Local Editing

Changes remain local until Save Draft.

UI should distinguish:

```text
✓ Saved
● Unsaved changes
```

### Save Draft

```text
Frontend state
→ Backend authentication
→ Ownership check
→ Form validation
→ Persistence
→ Saved state
```

### Save Failure

If save fails:
- Preserve local state.
- Show clear error.
- Allow retry.

### Unsaved Changes

Leaving with unsaved changes shows:

> You have unsaved changes. Leave without saving?

Actions:
- Stay.
- Leave.

---

## 22. Publishing

A form can only be published from its latest successfully saved state.

Publishing:
```text
Publish
→ Check unsaved changes
→ Save if needed
→ Final backend validation
→ Publish
```

Backend validation is mandatory even if frontend validation passes.

---

## 23. Form Lifecycle

Primary states:

```text
DRAFT
PUBLISHED
CLOSED
```

Deletion is a terminal operation:

```text
DRAFT → PUBLISHED → CLOSED → DELETED
```

---

## 24. Draft State

Drafts can:
- Edit title and description.
- Add/delete/reorder/duplicate fields.
- Modify field configuration.
- Configure availability.
- Save.
- Preview.
- Publish.
- Delete.

Drafts cannot accept public submissions.

---

## 25. Published State

Once published, the form definition is immutable.

No one can modify:
- Title.
- Description.
- Questions.
- Question text.
- Field type.
- Field configuration.
- Required state.
- Options.
- Field order.

Published forms can:
- Be viewed.
- Be shared.
- Receive responses when available.
- Show responses to their owner.
- Be closed.
- Be duplicated into a new draft.

---

## 26. Closed State

Closed forms:
- Do not accept new responses.
- Retain existing responses.
- Keep their public URL.
- Can be viewed by owners.
- Can have responses viewed.
- Can be reopened.
- Can be permanently deleted.

They cannot be structurally edited.

---

## 27. Modifying Published Forms

Published forms must be duplicated:

```text
Published → Duplicate → New Draft → Edit → Save → Publish
```

The original remains unchanged.

---

## 28. Form Availability

Lifecycle status and availability are separate.

### Status
```text
DRAFT
PUBLISHED
CLOSED
```

### Availability
```text
ALWAYS
SCHEDULED
```

Scheduled forms contain:
- `startAt`
- `endAt`

Before start: published but not accepting.  
During window: accepting.  
After end: not accepting.

Manual closing and scheduled availability are separate concepts.

---

## 29. Submission Race Condition

If a respondent opens a form while it is accepting but it closes before submission, the backend must reject the submission.

Availability must be checked at submission time.

The respondent must receive a clear failure message.

---

## 30. Public Sharing

Published forms receive a URL conceptually equivalent to:

```text
https://formflow.com/f/:publicId
```

Public ID must:
- Be random.
- Be unique.
- Be separate from MongoDB `_id`.
- Remain stable for the form lifetime.
- Be sufficiently unpredictable to make practical enumeration difficult.

No title-based slugs in V1.

---

## 31. Public URL Lifecycle

- Draft: no public submission access.
- Published: URL active.
- Closed: same URL, submissions disabled.
- Deleted: URL no longer resolves to an available form.

Sharing actions:
- Copy Link.
- Open Form.

V1 excludes QR codes, URL regeneration, custom domains, and advanced social previews.

---

## 32. Public Form Rendering

Public responses may expose only the safe form definition needed for submission.

Must not expose:
- Creator private information.
- Existing responses.
- Dashboard information.
- Internal database details.
- Sensitive configuration.

---

## 33. Public Form States

Support:
- Form Not Found.
- Draft/unavailable.
- Closed.
- Scheduled before start.
- Scheduled after end.

Example not-found message:

> Form Not Found

The UI may explain that the link is incorrect or the form is no longer available.

---

## 34. Response Submission

Respondents do not need accounts.

Frontend:
1. Render published form.
2. Collect answers.
3. Validate client-side.
4. Prevent repeated submission while processing.
5. Send response.
6. Show success/failure.

---

## 35. Response Data Model

Use one MongoDB document per response.

Conceptually:

```json
{
  "_id": "...",
  "formId": "...",
  "submittedAt": "...",
  "answers": {
    "field_abc123": "Sumeet",
    "field_def456": "sumeet@example.com",
    "field_ghi789": 2,
    "field_jkl012": ["JavaScript", "Node.js"]
  }
}
```

Each response contains:
- Response ID.
- Form ID.
- Submission timestamp.
- Dynamic answers.

JSON files are not used as the primary response store.

---

## 36. Dynamic Answer Structure

Answers are keyed by stable field IDs.

Example:

```text
Form:
field_abc123 → What is your name?

Response:
field_abc123 → Sumeet
```

Question text is not used as the response key.

---

## 37. Response Validation

The backend must load the effective published form definition and validate each response.

Reject or safely handle:
- Unknown field IDs.
- Missing required fields.
- Wrong types.
- Invalid choices.
- Invalid email.
- Invalid date.
- Invalid number.
- Invalid checkbox arrays.
- Values not present in allowed options.

Client validation is UX only.

---

## 38. Field Answer Types

| Field | Expected Answer |
|---|---|
| Short Answer | String |
| Paragraph | String |
| Number | Number |
| Email | Valid email string |
| Date | Valid date |
| Multiple Choice | One allowed option |
| Checkboxes | Array of allowed options |
| Dropdown | One allowed option |

---

## 39. Anonymous Submission Policy

V1 allows unlimited valid anonymous submissions from the same person/device.

No:
- IP-based blocking.
- Fingerprinting.
- Forced accounts.
- Mandatory identity cookies.
- One-response-per-person.

---

## 40. Double Submission and Network Failure

The frontend should disable submission while processing.

V1 does not guarantee duplicate prevention for network retries.

If a request fails:
- Show clear error.
- Do not claim success.
- Allow retry.

Advanced idempotency may be considered later.

---

## 41. Submission Success

Display:

> ✓ Response submitted successfully

V1 does not provide receipts, respondent accounts, edit links, or response tracking.

---

## 42. Responses Dashboard

Navigation:

```text
My Forms → Select Form → Responses
```

Only the form owner can access responses.

---

## 43. Response List

Must provide:
- Response count.
- Submission timestamp.
- Response number/identifier.
- Pagination.

Anonymous responses must not imply known respondent identity.

Example:

```text
Response #127
Submitted: ...
```

---

## 44. Response Detail

Display:
- Questions from the immutable published form definition.
- Corresponding answers.

Question labels/order come from the form definition, not the response document.

---

## 45. Pagination

Conceptually:

```text
GET /api/forms/:formId/responses?page=1&limit=20
```

Backend enforces a reasonable maximum page size.

Cursor pagination may be considered later.

---

## 46. Response Authorization

Every response endpoint must verify:
1. Authentication.
2. Ownership/authorization for the form.

Knowing a form ID alone must never grant access.

---

## 47. Response Deletion

Owners may delete individual responses.

Deletion requires explicit confirmation.

V1 does not support delete-all or bulk response deletion.

---

## 48. CSV Export

V1 provides `Export CSV`.

CSV:
- Uses published form question labels as columns.
- Uses published field order.
- Represents checkbox answers with a suitable delimited representation.
- Must produce valid CSV.

---

## 49. Basic Statistics

V1 supports:
- Total response count.
- Responses over time.
- Choice distribution.
- Checkbox selection counts.

No full BI platform or advanced analytics.

---

## 50. Templates

V1 system templates:
1. Event Registration.
2. Customer Feedback.
3. Job Application.
4. Contact Form.
5. Survey.
6. Registration Form.

Templates create normal drafts.

Existing forms are independent from future template changes.

Quiz is excluded because scoring, correct answers, points, and results introduce additional domain complexity.

---

## 51. Form Management Actions

### Draft
- Edit.
- Delete.
- Publish.

### Published
- Open.
- Responses.
- Copy Link.
- Close.
- Duplicate.

### Closed
- Open.
- Responses.
- Reopen.
- Delete.
- Duplicate.

Published forms must be closed before permanent deletion.

---

## 52. Form Deletion

Deletion is permanent.

Before deletion:
- Require explicit confirmation.
- Active published forms must first be closed.

Deleting a form deletes associated responses.

Its public URL becomes unavailable.

---

## 53. Duplicate Form

Duplicating a published/closed form creates a new draft.

The duplicate receives:
- New form ID.
- Independent field identities as required.
- Independent lifecycle.
- New public identity when eventually published.

Existing responses are not copied.

---

## 54. Theme Requirements

V1 supports:
- Light.
- Dark.
- System preference.

No per-form custom themes or custom branding.

---

## 55. Error, Loading, and Empty States

These are required product states.

### Errors
- Invalid authentication.
- Unauthorized access.
- Not found.
- Validation errors.
- Save failure.
- Submission failure.
- Server errors.
- Closed form.
- Scheduled unavailable state.

### Loading
- Auth check.
- Dashboard.
- Forms.
- Builder.
- Save.
- Publish.
- Submission.
- Responses.
- Export where applicable.

### Empty
- No forms.
- No responses.
- Empty statistics where applicable.

Production errors must not expose stack traces, secrets, or internal database details.

---

## 56. Security Requirements

V1 baseline:
- Argon2 password hashing.
- `cookie-session`.
- `httpOnly` cookies.
- `secure` cookies in production.
- Appropriate `sameSite`.
- Helmet.
- CORS.
- Environment variables.
- Request validation.
- Backend authorization.
- Generic authentication errors.
- Backend form/response validation.
- Rate limiting where appropriate.

Rate limiting should be considered especially for authentication and public submission endpoints.

---

## 57. Validation Strategy

### Client Validation
Immediate UX feedback.

### Request Validation
Standard API payload validation using `express-validator` where appropriate.

### Domain Validation
Application logic based on the form definition.

Examples:
- Checkbox answers must be arrays.
- Choices must belong to allowed options.
- Required fields must be present.
- Unknown field IDs must be rejected.

Backend validation is authoritative.

---

## 58. Data Integrity

The system must preserve consistency between:
- Users.
- Forms.
- Published form definitions.
- Field IDs.
- Responses.

Published form definitions must remain stable so historical responses remain interpretable.

---

## 59. Backend Source of Truth

The frontend must not be authoritative for:
- Authentication.
- Authorization.
- Form ownership.
- Publishability.
- Availability.
- Response validation.
- Choice validation.
- Lifecycle transitions.

Security-sensitive rules must be enforced by the backend.

---

## 60. Functional Requirement Summary

### Authentication
- Registration.
- Login.
- Cookie sessions.
- Logout.
- Auth status.
- Change password.
- Account deletion.

### Dashboard
- Dashboard.
- My Forms.
- Form management.
- Profile.

### Creation
- Scratch creation.
- Six templates.
- Eight field types.
- Dynamic builder.
- Add/edit/delete/reorder/duplicate.
- Required fields.
- Choice options.
- Save Draft.
- Preview.

### Lifecycle
- Draft.
- Published.
- Closed.
- Reopen.
- Permanent deletion.
- Immutability.
- Duplicate.
- Scheduled availability.

### Sharing
- Random public IDs.
- Public URLs.
- Copy Link.
- Open Form.

### Responses
- Anonymous submission.
- Backend validation.
- MongoDB documents.
- List.
- Detail.
- Pagination.
- Individual deletion.
- CSV.
- Basic statistics.

### UX
- Loading states.
- Empty states.
- Error states.
- Success states.
- Unsaved-change warnings.
- Light/dark/system theme.

---

## 61. Non-Functional Requirements

### Security
Protect credentials, sessions, private forms, responses, and authorization boundaries.

### Reliability
Saved forms and stored responses must not be silently lost.

### Maintainability
Separate authentication, form management, lifecycle, response handling, validation, and account management.

### Scalability
The data model should support large numbers of forms and responses without requiring advanced distributed infrastructure in V1.

### Usability
The primary workflow should be understandable:

```text
Create → Build → Save → Publish → Share → Collect → Review
```

---

## 62. Acceptance Criteria

### Authentication
- Valid registration succeeds.
- Duplicate emails are rejected.
- Passwords are hashed.
- Registration creates a session.
- Valid login succeeds.
- Invalid credentials use a generic error.
- Logout destroys the session.
- Protected routes reject unauthenticated users.
- Expired sessions return users to login.
- Password changes require the current password.
- Password change invalidates the current session.
- Account deletion permanently removes the user's data.

### Form Creation
- Blank drafts can be created.
- All six templates can create drafts.
- Drafts receive unique IDs.
- All eight field types can be added.
- Fields can be edited, deleted, reordered, and duplicated.
- Duplicated fields receive new IDs.
- Choice options can be managed.
- Required state can be configured.
- Invalid configurations prevent publishing.

### Drafts
- Changes are not autosaved.
- Save Draft persists valid changes.
- Failed saves preserve local state.
- Saved/unsaved state is visible.
- Leaving with unsaved changes prompts the user.
- Preview does not publish or create responses.

### Publishing
- Publishing uses the latest successfully saved state.
- Backend validation runs before publishing.
- Published forms become immutable.
- A public ID is generated.

### Public Forms
- Published forms resolve through public URLs.
- Anonymous users can submit.
- Drafts cannot accept responses.
- Closed forms cannot accept responses.
- Scheduled forms enforce availability.
- Public APIs do not expose private data.

### Responses
- Valid responses are stored.
- Responses reference the correct form.
- Answers use stable field IDs.
- Invalid IDs/types/choices are rejected.
- Required fields are enforced.
- Owners can view responses.
- Non-owners cannot.
- Responses are paginated.
- Individual responses can be deleted.
- CSV export works.
- Basic statistics are available.

### Lifecycle
- Published forms can be closed.
- Closed forms can be reopened.
- Existing responses remain after close.
- Published forms cannot be directly edited.
- Published forms can be duplicated.
- Active published forms cannot be directly deleted.
- Closed forms can be permanently deleted.
- Deleted forms become unavailable publicly.

---

## 63. V1 Scope Freeze

### Included

Authentication:
- Registration.
- Login.
- Cookie-session authentication.
- Logout.
- Change password.
- Account deletion.

Dashboard:
- Dashboard.
- My Forms.
- Form management.
- Profile.

Creation:
- Scratch creation.
- Six system templates.
- Dynamic builder.
- Eight field types.
- Field management.
- Required fields.
- Choice options.
- Save Draft.
- Preview.

Lifecycle:
- Draft.
- Published.
- Closed.
- Permanent deletion.
- Immutable published forms.
- Duplicate published forms.
- Scheduled availability.

Sharing:
- Random public IDs.
- Public URLs.
- Copy Link.
- Open Form.

Responses:
- Anonymous submissions.
- Backend validation.
- MongoDB response documents.
- List.
- Detail.
- Pagination.
- Individual deletion.
- CSV export.
- Basic statistics.

UX:
- Light.
- Dark.
- System theme.
- Loading.
- Empty.
- Error.
- Success.
- Unsaved-change warnings.

---

## 64. V2 Backlog

### Integrations
- Google Sheets.
- External storage.
- Additional response destinations.

Google Sheets should use proper Google authorization/OAuth and the Sheets API, not arbitrary sheet URLs.

### Richer Fields
- Image upload.
- File upload.
- Rating.
- Linear scale.
- URL.
- Signature.
- Matrix/grid.
- Other advanced types.

Files/images should use external storage; spreadsheet cells should contain references/URLs rather than binary data.

### Authentication
- OAuth.
- Email verification.
- Password recovery.
- MFA.

### Forms
- QR codes.
- Custom themes.
- Custom branding.
- Custom domains.
- User-created templates.
- Quizzes.
- Collaboration.
- Advanced autosave.

### Responses
- Email notifications.
- One-response-per-person.
- Advanced filtering.
- Advanced analytics.
- Cross-form analytics.
- Bulk deletion.
- Response editing.

### Abuse Protection
- CAPTCHA.
- Advanced anti-bot controls.
- Stronger submission abuse protection.

---

## 65. Future Google Sheets Direction

A future integration may follow:

```text
FormFlow
→ User authorizes Google account
→ Select/Create Google Sheet
→ Form submission
→ FormFlow validates
→ FormFlow stores response
→ Response synchronized to Google Sheet
```

An arbitrary Google Sheet URL must not be treated as authorization.

For future file/image fields:

```text
Upload
→ External Storage
→ File URL/Reference
→ Google Sheet reference
```

Binary files should not be stored directly in spreadsheet cells.

---

## 66. Product Design Principles

### Simplicity Before Feature Count
V1 solves the core workflow without reproducing all Google Forms features.

### Backend as Source of Truth
Frontend validation is UX. Backend validation and authorization enforce correctness.

### Published Forms Are Immutable
Changes require duplication into a new draft.

### Templates Are Convenience
Templates generate normal drafts.

### Anonymous by Default
Public respondents need no FormFlow account.

### Explicit V1 Boundaries
Complex integrations and advanced functionality are deliberately deferred.

### Functional Over Decorative
The project prioritizes working full-stack behavior over design-heavy features.

### Learning Through a Real Product
FormFlow should provide practical engineering experience rather than isolated CRUD exercises.

---

## 67. Product Success Criteria

FormFlow V1 is functionally successful when a user can complete:

```text
Register
→ Login
→ Create Form
→ Build Form
→ Save Draft
→ Preview
→ Publish
→ Copy Public Link
→ Open Public Form
→ Submit Anonymous Response
→ Open Dashboard
→ View Responses
→ Inspect Individual Response
→ View Basic Statistics
→ Export CSV
→ Close Form
→ Reopen Form
```

The product must also correctly handle invalid input, unauthorized access, failed saves, unavailable forms, scheduled availability, deleted forms, and other defined edge states.

---

## 68. Open Implementation Decisions

These belong to the Architecture phase:

- Exact MongoDB schemas.
- Mongoose model design.
- API route naming beyond conceptual endpoints.
- Controller/service/repository boundaries.
- Backend folder architecture.
- Frontend component architecture.
- React state management.
- Exact session configuration.
- CORS configuration.
- Rate limits.
- Public ID generation.
- Exact password policy.
- Date/time and timezone representation.
- CSV implementation.
- Pagination implementation.
- Statistics aggregation queries.
- API error format.
- API response envelope.
- Deployment architecture.
- Production environment configuration.
- Testing strategy.
- Logging.
- Monitoring.

---

## 69. Requirements-to-Architecture Boundary

This PRD defines:

> **WHAT FormFlow must do.**

The Architecture phase will define:

> **HOW FormFlow will do it.**

Architecture should be derived from these requirements without introducing unnecessary V1 features.

---

## 70. Final V1 Product Definition

FormFlow V1 is a full-stack anonymous form collection platform with:

- Secure user authentication.
- Session-based authorization.
- Dynamic form creation.
- Eight field types.
- Six system templates.
- Explicit draft persistence.
- Preview.
- Immutable published forms.
- Scheduled response availability.
- Public random form URLs.
- Anonymous response submission.
- Backend-driven response validation.
- MongoDB response storage.
- Owner-only response management.
- Pagination.
- Individual response deletion.
- CSV export.
- Basic response statistics.
- Form lifecycle management.
- Account management.
- Light/dark/system themes.

Advanced integrations, complex authentication, advanced analytics, collaboration, file uploads, quizzes, and other high-complexity functionality remain outside V1.

**Next phase: Architecture Design.**
