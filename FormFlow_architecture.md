# FormFlow — Architecture Document

**Version:** 1.0  
**Status:** V1 Architecture  
**Product:** FormFlow  
**Last Updated:** 2026-09-26  
**Architecture Style:** Layered Full-Stack REST Architecture  
**Primary Goal:** Define how the finalized FormFlow V1 requirements will be implemented.

---

# 1. Architecture Overview

FormFlow V1 is a single full-stack application consisting of:

```text
React + Vite Frontend
        │
        │ HTTP / JSON
        ▼
Node.js + Express Backend
        │
        ├── Middleware
        ├── Controllers
        ├── Services
        ├── Repositories
        ├── Validation
        └── Mongoose Models
                │
                ▼
             MongoDB
```

The project uses one repository containing the frontend, backend, and project documentation.

The architecture follows a layered approach:

```text
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Mongoose Models
  ↓
MongoDB
```

The main architectural principle is:

> Routes handle routing. Controllers handle HTTP. Services handle business rules. Repositories handle persistence. Models represent persisted data.

---

# 2. Technology Stack

## Frontend

- React
- Vite
- JavaScript
- React Router
- Fetch API
- CSS

TypeScript is intentionally not used in FormFlow V1.

## Backend

- Node.js
- Express
- JavaScript
- cookie-session
- express-validator
- Argon2
- Helmet
- CORS
- Rate limiting where appropriate

## Database

- MongoDB
- Mongoose

## Authentication

- Server-side session-based authentication using `cookie-session`
- HTTP-only cookie
- Secure cookie in production
- Appropriate SameSite configuration

## Documentation

Project-level engineering documentation:

```text
discussion.md
prd.md
architecture.md
```

A later final technical specification will consolidate the finalized implementation decisions.

---

# 3. Repository Structure

```text
formflow/
│
├── frontend/
│
├── backend/
│
├── discussion.md
├── prd.md
├── architecture.md
├── README.md
└── .gitignore
```

The repository is intentionally kept as one project.

Frontend and backend are separate applications but belong to the same product.

---

# 4. Backend Project Structure

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── env.js
│   │   ├── cors.js
│   │   ├── session.js
│   │   └── security.js
│   │
│   ├── constants/
│   │   ├── fieldTypes.js
│   │   ├── formStatus.js
│   │   ├── availabilityTypes.js
│   │   └── errorCodes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   ├── form.controller.js
│   │   ├── response.controller.js
│   │   ├── publicForm.controller.js
│   │   └── statistics.controller.js
│   │
│   ├── databases/
│   │   └── mongo.js
│   │
│   ├── helpers/
│   │
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── validateRequest.js
│   │   ├── rateLimiter.js
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Form.js
│   │   └── Response.js
│   │
│   ├── repositories/
│   │   ├── user.repository.js
│   │   ├── form.repository.js
│   │   └── response.repository.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   ├── form.routes.js
│   │   ├── response.routes.js
│   │   └── publicForm.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── account.service.js
│   │   ├── form.service.js
│   │   ├── response.service.js
│   │   ├── publicForm.service.js
│   │   ├── template.service.js
│   │   └── statistics.service.js
│   │
│   ├── utils/
│   │   ├── publicId.js
│   │   ├── csv.js
│   │   ├── date.js
│   │   └── errors.js
│   │
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── account.validation.js
│   │   ├── form.validation.js
│   │   └── response.validation.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env
├── .env.example
├── package.json
└── README.md
```

Some files may be merged or split during implementation if doing so improves clarity. The architectural responsibilities must remain intact.

---

# 5. Backend Layer Responsibilities

## 5.1 Routes

Routes define the HTTP API.

They should:

- Map HTTP methods to controllers.
- Attach required middleware.
- Stay thin.
- Avoid business logic.

Example:

```text
POST /api/v1/forms/:formId/publish
```

should route to a controller and middleware chain rather than implementing publishing logic directly in the route file.

---

# 6. Middleware Layer

Middleware handles cross-cutting request concerns.

## Authentication Middleware

Conceptually:

```text
authenticate
```

Responsibilities:

1. Read session.
2. Determine whether a user is authenticated.
3. Attach safe authentication context to the request.
4. Reject unauthenticated protected requests.

Example request context:

```text
req.user = {
    userId: "..."
}
```

The full User document should not be attached unnecessarily.

---

## Authorization Middleware

Authorization may be implemented partly through middleware and partly through services.

For resource ownership, the service should normally perform the final authorization check because it has the resource context.

Example:

```text
authenticate
    ↓
controller
    ↓
formService
    ↓
verify form.ownerId === req.user.userId
```

Authentication and ownership are distinct concerns.

---

## Request Validation Middleware

Uses `express-validator` where appropriate.

Examples:

- Registration.
- Login.
- Change password.
- Change name.
- Create/update draft payload.
- Query parameters.

Dynamic response validation cannot be represented entirely by static request validators because it depends on the actual form definition.

---

## Rate Limiting Middleware

Rate limiting should be applied especially to:

- Login.
- Registration.
- Public response submission.

Exact thresholds are implementation/deployment decisions.

---

## Error Handler

All unexpected backend errors should eventually reach a centralized error handler.

Production responses must not expose:

- Stack traces.
- Database internals.
- Secrets.
- Internal implementation details.

---

# 7. Controller Responsibilities

Controllers are the HTTP boundary.

A controller should generally:

```text
Request
  ↓
Extract input
  ↓
Call service
  ↓
Build HTTP response
```

Controllers should not contain:

- Complex lifecycle rules.
- Password hashing logic.
- Response validation rules.
- Ownership logic scattered across endpoints.
- Large Mongoose queries.

Those belong in lower layers.

---

# 8. Service Layer

Services contain business/domain logic.

Core services:

```text
auth.service.js
account.service.js
form.service.js
response.service.js
publicForm.service.js
template.service.js
statistics.service.js
```

---

# 9. Authentication Service

Responsibilities:

- Register user.
- Normalize email.
- Check duplicate account.
- Hash password with Argon2.
- Verify password.
- Create authenticated session.
- Destroy/logout session.
- Get current authenticated user.

Conceptual operations:

```text
register()
login()
logout()
getCurrentUser()
verifyPassword()
```

---

# 10. Account Service

Responsibilities:

- Update name.
- Change password.
- Delete account.

Change password flow:

```text
Current Session
      ↓
Verify Current Password
      ↓
Validate New Password
      ↓
Argon2 Hash
      ↓
Update User
      ↓
Invalidate Session
```

Account deletion:

```text
Authenticate
    ↓
Verify Password
    ↓
Start Transaction
    ↓
Find User Forms
    ↓
Delete Related Responses
    ↓
Delete Forms
    ↓
Delete User
    ↓
Commit
    ↓
Destroy Session
```

---

# 11. Form Service

This is the central domain service.

Responsibilities include:

- Create draft.
- Create form from template.
- Get owned form.
- Update draft.
- Validate form definition.
- Publish form.
- Close form.
- Reopen form.
- Duplicate form.
- Delete form.
- Configure availability.
- Generate public ID.
- Verify ownership.

Conceptual operations:

```text
createDraft()
createFromTemplate()
getOwnedForm()
updateDraft()
validateFormDefinition()
publishForm()
closeForm()
reopenForm()
duplicateForm()
deleteForm()
```

---

# 12. Response Service

Responsibilities:

- Validate public submission.
- Check form availability.
- Validate answers against form fields.
- Create response.
- List responses.
- Get individual response.
- Delete individual response.
- Export responses.

Conceptual operations:

```text
submitResponse()
validateAnswers()
listResponses()
getResponse()
deleteResponse()
exportCsv()
```

---

# 13. Public Form Service

Separating public form retrieval from authenticated form management keeps the public API boundary explicit.

Responsibilities:

- Find form by public ID.
- Verify form is publicly viewable.
- Return safe public form definition.
- Hide private owner information.
- Hide existing responses.
- Determine public availability state.

Conceptual:

```text
getPublicForm()
getPublicAvailability()
```

---

# 14. Template Service

Templates are system-defined data.

The template service should:

- List available templates.
- Retrieve a template definition.
- Create a draft based on a template.

Templates should not require a MongoDB collection in V1.

They can be defined as application-level configuration/data.

---

# 15. Statistics Service

Responsibilities:

- Total response count.
- Responses over time.
- Choice distribution.
- Checkbox selection counts.

Statistics should operate only on responses belonging to the requested form and authorized owner.

---

# 16. Repository Layer

Repositories encapsulate persistence operations.

Core repositories:

```text
user.repository.js
form.repository.js
response.repository.js
```

Examples:

```text
UserRepository
- findByEmail()
- findById()
- create()
- update()
- delete()

FormRepository
- create()
- findById()
- findByPublicId()
- findByOwner()
- update()
- delete()

ResponseRepository
- create()
- findByForm()
- findById()
- delete()
- deleteByForm()
```

Repositories should not decide whether a form is publishable.

That is service/domain logic.

---

# 17. Model Layer

Three primary Mongoose models:

```text
User
Form
Response
```

No separate models for:

- Questions.
- Options.
- Templates.
- Published forms.
- Closed forms.

Questions are embedded inside Form documents.

---

# 18. Database Architecture

MongoDB collections:

```text
users
forms
responses
```

Relationship:

```text
User
  │
  │ 1:N
  ▼
Forms
  │
  │ 1:N
  ▼
Responses
```

---

# 19. User Schema

Conceptual schema:

```text
User
├── _id: ObjectId
├── name: String
├── email: String
├── passwordHash: String
├── createdAt: Date
└── updatedAt: Date
```

### Constraints

- `name` required.
- `email` required.
- `email` normalized to lowercase.
- `email` unique.
- `passwordHash` required.

### Not included in V1

```text
role
isActive
lastLoginAt
deletedAt
emailVerified
mfaEnabled
oauthProviders
```

These belong to future features.

---

# 20. Form Schema

Conceptual schema:

```text
Form
├── _id: ObjectId
├── ownerId: ObjectId
├── publicId: String | null
├── title: String
├── description: String
├── status: Enum
├── availability:
│   ├── type: Enum
│   ├── startAt: Date | null
│   └── endAt: Date | null
├── questions: Array
│   ├── fieldId: String
│   ├── type: Enum
│   ├── question: String
│   ├── required: Boolean
│   └── options: Array<String> when applicable
├── publishedAt: Date | null
├── createdAt: Date
└── updatedAt: Date
```

---

# 21. Form Status

Allowed values:

```text
DRAFT
PUBLISHED
CLOSED
```

Lifecycle:

```text
DRAFT
  ↓
PUBLISHED
  ↓
CLOSED
```

Closed forms can be reopened:

```text
CLOSED
  ↓
PUBLISHED
```

Published forms can be duplicated:

```text
PUBLISHED
  ↓
New DRAFT
```

Permanent deletion removes the document.

---

# 22. Availability Schema

Availability is separate from lifecycle status.

```text
availability:
{
    type: ALWAYS | SCHEDULED,
    startAt: Date | null,
    endAt: Date | null
}
```

For `ALWAYS`:

```text
{
    type: "ALWAYS",
    startAt: null,
    endAt: null
}
```

For `SCHEDULED`:

```text
{
    type: "SCHEDULED",
    startAt: Date,
    endAt: Date
}
```

Validation rules:

- Scheduled forms require both timestamps.
- `startAt` must precede `endAt`.
- Non-scheduled forms do not require timestamps.

---

# 23. Form Questions Schema

Each question is embedded:

```text
questions: [
    {
        fieldId,
        type,
        question,
        required,
        options
    }
]
```

### Field ID

Stable unique identifier within the form.

It must not depend on question text.

### Type

Allowed values:

```text
SHORT_ANSWER
PARAGRAPH
NUMBER
EMAIL
DATE
MULTIPLE_CHOICE
CHECKBOXES
DROPDOWN
```

### Question

The respondent-visible question text.

### Required

Boolean.

### Options

Only choice fields use options.

---

# 24. Field Order

Field order is represented by the array order.

We intentionally do not store:

```text
order: 1
order: 2
```

inside each question.

The authoritative order is:

```text
questions[0]
questions[1]
questions[2]
```

This avoids duplicated state such as:

```text
array position = 2
order = 3
```

---

# 25. Form Public ID

`publicId` is separate from MongoDB `_id`.

Example:

```text
_id:
66f123...

publicId:
x7Kp92mQ4
```

Public URL:

```text
/f/x7Kp92mQ4
```

### Rules

- Random.
- Unique.
- Stable for form lifetime.
- Generated on first publication.
- Null for drafts.
- Never reused for a different form.

---

# 26. Form Timestamps

Mongoose timestamps provide:

```text
createdAt
updatedAt
```

Additionally:

```text
publishedAt
```

is stored when the form is first published.

`publishedAt` is not equivalent to `updatedAt`.

---

# 27. Response Schema

Conceptual schema:

```text
Response
├── _id: ObjectId
├── formId: ObjectId
├── answers: Map<String, Mixed>
└── submittedAt: Date
```

---

# 28. Response `answers`

Example:

```json
{
  "field_a1": "Sumeet",
  "field_b2": "sumeet@example.com",
  "field_c3": 21,
  "field_d4": [
    "JavaScript",
    "Node.js"
  ]
}
```

MongoDB storage is flexible, but application-level validation is strict.

The schema being flexible does not mean arbitrary answers are accepted.

---

# 29. Response Validation

The backend loads the published Form and evaluates:

```text
submitted answers
        ↓
published questions
        ↓
field type
        ↓
required state
        ↓
allowed options
        ↓
valid response
```

Validation includes:

- Unknown field ID rejection.
- Required-field validation.
- Type validation.
- Email validation.
- Date validation.
- Number validation.
- Choice validation.
- Checkbox array validation.
- Allowed-option validation.

---

# 30. Response Answer Types

| Field | Answer |
|---|---|
| SHORT_ANSWER | String |
| PARAGRAPH | String |
| NUMBER | Number |
| EMAIL | Valid email String |
| DATE | Valid date representation |
| MULTIPLE_CHOICE | One allowed String |
| CHECKBOXES | Array of allowed Strings |
| DROPDOWN | One allowed String |

---

# 31. Response Indexes

Primary response access pattern:

```text
Find responses for Form X
ordered by newest submission.
```

Recommended index:

```text
(formId, submittedAt)
```

This supports:

- Response list.
- Pagination.
- Recent-first ordering.

Dynamic `answers` are not indexed in V1.

---

# 32. Database Index Strategy

## Users

```text
email: unique
```

## Forms

```text
ownerId: index
publicId: unique
```

## Responses

```text
(formId, submittedAt): compound index
```

Indexes should be based on actual access patterns rather than indexing every field.

---

# 33. Embedded Questions vs Separate Collection

V1 uses embedded questions.

Preferred:

```text
forms
└── questions[]
```

Not:

```text
forms
formQuestions
```

Reasons:

1. Questions belong exclusively to a form.
2. Questions are always loaded with the form definition.
3. Published forms are immutable.
4. Response validation requires the form definition.
5. A normal form remains comfortably within MongoDB document limits.
6. It reduces database round trips.

---

# 34. Soft Deletion

V1 does not use soft deletion.

There is no:

```text
deletedAt
isDeleted
```

A deleted form is actually removed.

A deleted account is actually removed.

A deleted response is actually removed.

If a future version introduces Trash/Recovery, soft deletion can be deliberately added.

---

# 35. Transactions

MongoDB transactions are justified for destructive multi-document operations.

## Form deletion

```text
Start transaction
    ↓
Delete responses for form
    ↓
Delete form
    ↓
Commit
```

## Account deletion

```text
Start transaction
    ↓
Find user's forms
    ↓
Delete related responses
    ↓
Delete forms
    ↓
Delete user
    ↓
Commit
```

This prevents partial deletion states.

The production/local MongoDB environment must support transactions.

---

# 36. Why No Form Version Field

V1 does not need:

```text
version
```

Published forms are immutable.

When a published form is modified, the product creates a new form:

```text
Old Form
   ↓
Duplicate
   ↓
New Draft
   ↓
New Published Form
```

Therefore versions are represented by separate form entities rather than versions of one entity.

---

# 37. Why No Question Collection

A separate Question collection would introduce:

- Additional queries.
- More complicated ordering.
- More complicated publishing.
- More complicated duplication.
- More complicated validation.

Embedded questions are sufficient for V1.

---

# 38. API Architecture

API prefix:

```text
/api/v1
```

Primary domains:

```text
/api/v1/auth
/api/v1/account
/api/v1/forms
/api/v1/public
```

---

# 39. Authentication API

## Register

```text
POST /api/v1/auth/register
```

Request:

```json
{
  "name": "Sumeet",
  "email": "sumeet@example.com",
  "password": "********",
  "confirmPassword": "********"
}
```

Successful registration:

- Creates user.
- Creates session.
- Returns authenticated user data.

---

## Login

```text
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "sumeet@example.com",
  "password": "********"
}
```

Successful login creates session.

Invalid credentials:

```text
401
```

with generic error.

---

## Current User

```text
GET /api/v1/auth/me
```

Protected.

Returns safe authenticated-user information.

---

## Logout

```text
POST /api/v1/auth/logout
```

Protected.

Destroys/clears session.

---

# 40. Account API

## Update Name

```text
PATCH /api/v1/account
```

Example:

```json
{
  "name": "New Name"
}
```

---

## Change Password

```text
POST /api/v1/account/change-password
```

Request:

```json
{
  "currentPassword": "********",
  "newPassword": "********",
  "confirmPassword": "********"
}
```

Successful change invalidates current session.

---

## Delete Account

```text
DELETE /api/v1/account
```

Requires password confirmation.

Deletes:

```text
User
Forms
Responses
```

within a transaction.

---

# 41. Form API

## Create Blank Draft

```text
POST /api/v1/forms
```

Creates a draft.

Initial form:

```text
title
description
questions: []
status: DRAFT
publicId: null
```

---

## Create From Template

Conceptually:

```text
POST /api/v1/forms/from-template
```

Request:

```json
{
  "templateId": "event-registration"
}
```

The backend creates an independent draft from the system template.

---

## List My Forms

```text
GET /api/v1/forms
```

Returns only forms owned by the authenticated user.

---

## Get Owned Form

```text
GET /api/v1/forms/:formId
```

Protected.

Requires ownership.

---

## Update Draft

```text
PATCH /api/v1/forms/:formId
```

Only allowed for DRAFT forms.

Updates:
- Title.
- Description.
- Questions.
- Availability.

The backend validates the complete resulting draft definition.

---

## Publish

```text
POST /api/v1/forms/:formId/publish
```

Only DRAFT forms can be published.

Backend:
1. Authenticate.
2. Verify ownership.
3. Verify status is DRAFT.
4. Validate complete form.
5. Validate availability.
6. Generate public ID if missing.
7. Set status to PUBLISHED.
8. Set `publishedAt`.
9. Persist.

---

## Close

```text
POST /api/v1/forms/:formId/close
```

Only PUBLISHED forms can be closed.

---

## Reopen

```text
POST /api/v1/forms/:formId/reopen
```

Only CLOSED forms can be reopened.

The form returns to PUBLISHED.

---

## Duplicate

```text
POST /api/v1/forms/:formId/duplicate
```

Creates a new DRAFT.

The duplicate receives:
- New `_id`.
- New field IDs.
- `publicId: null`.
- `status: DRAFT`.
- No responses.

---

## Delete

```text
DELETE /api/v1/forms/:formId
```

Rules:

- Draft → can delete.
- Closed → can delete.
- Published → must close first.

Deletion includes associated responses.

---

# 42. Public Form API

Public APIs do not require authentication.

## Get Public Form

```text
GET /api/v1/public/forms/:publicId
```

Returns only safe form information:

```text
title
description
questions
availability state
```

Does not return:
- Owner details.
- Responses.
- Private fields.
- Internal database information.

---

## Submit Response

```text
POST /api/v1/public/forms/:publicId/responses
```

Example:

```json
{
  "answers": {
    "fld_a1": "Sumeet",
    "fld_b2": "sumeet@example.com",
    "fld_c3": [
      "JavaScript",
      "Node.js"
    ]
  }
}
```

Backend flow:

```text
Find public form
    ↓
Verify PUBLISHED
    ↓
Check availability
    ↓
Validate answers
    ↓
Create Response
    ↓
Return success
```

---

# 43. Response Management API

## List Responses

```text
GET /api/v1/forms/:formId/responses?page=1&limit=20
```

Protected.

Requires form ownership.

---

## Get Response

```text
GET /api/v1/forms/:formId/responses/:responseId
```

Protected.

Requires form ownership.

---

## Delete Response

```text
DELETE /api/v1/forms/:formId/responses/:responseId
```

Protected.

Requires form ownership.

---

## Export CSV

```text
GET /api/v1/forms/:formId/responses/export
```

Protected.

Requires form ownership.

CSV columns are generated from the published form definition.

---

# 44. Statistics API

Conceptually:

```text
GET /api/v1/forms/:formId/statistics
```

Protected.

Returns:

```text
totalResponses
responsesOverTime
choiceDistributions
checkboxCounts
```

The exact response shape will be finalized during implementation.

---

# 45. API Authorization Matrix

| Operation | Auth | Owner |
|---|---:|---:|
| Register | No | No |
| Login | No | No |
| Public Form | No | No |
| Submit Response | No | No |
| Dashboard | Yes | N/A |
| Create Form | Yes | N/A |
| List Forms | Yes | Own forms |
| Edit Draft | Yes | Yes |
| Publish | Yes | Yes |
| Close | Yes | Yes |
| Reopen | Yes | Yes |
| Duplicate | Yes | Yes |
| Delete Form | Yes | Yes |
| View Responses | Yes | Yes |
| Delete Response | Yes | Yes |
| Export CSV | Yes | Yes |
| Statistics | Yes | Yes |
| Account Management | Yes | Own account |

---

# 46. Form Ownership Rule

The backend must enforce:

```text
authenticated user ID
        ==
form.ownerId
```

before any private form operation.

Never rely on:

- Frontend route protection.
- Hidden buttons.
- Form IDs being difficult to guess.

Authorization is always enforced server-side.

---

# 47. Form Lifecycle State Machine

```text
                 ┌───────────────┐
                 │     DRAFT     │
                 └───────┬───────┘
                         │ publish
                         ▼
                 ┌───────────────┐
          ┌──────│   PUBLISHED   │──────┐
          │      └───────┬───────┘      │
          │              │ close        │ duplicate
          │              ▼              ▼
          │      ┌───────────────┐   NEW DRAFT
          │      │    CLOSED     │
          │      └───────┬───────┘
          │              │ reopen
          └──────────────┘

DRAFT / CLOSED
      │
      │ delete
      ▼
   DELETED
```

Deletion is terminal.

---

# 48. Availability Evaluation

Submission eligibility is determined by both status and availability.

Conceptually:

```text
if status !== PUBLISHED
    reject

if availability.type === ALWAYS
    accept

if availability.type === SCHEDULED
    if now < startAt
        reject

    if now >= endAt
        reject

    otherwise
        accept
```

This check must occur on the backend at submission time.

---

# 49. Published Immutability Enforcement

The frontend should disable editing controls for published forms.

But this is not sufficient.

Backend update logic must enforce:

```text
if form.status !== DRAFT
    reject structural update
```

Therefore even a manually crafted HTTP request cannot modify a published form.

---

# 50. Public Form Safety

The public-form response should be a deliberately constructed DTO/view model.

Do not return the raw Mongoose Form document.

Instead:

```text
Database Form
     ↓
Public Form Service
     ↓
Safe Public DTO
     ↓
Client
```

This prevents accidental exposure of:

- `ownerId`.
- Internal metadata.
- Private fields.
- Future sensitive properties.

---

# 51. Authenticated Form Safety

Likewise, private form endpoints should not blindly return raw database documents.

Response objects should contain only fields needed by the frontend.

This gives us a controlled API boundary.

---

# 52. API Error Format

V1 should use a consistent error structure.

Conceptually:

```json
{
  "success": false,
  "error": {
    "code": "FORM_NOT_FOUND",
    "message": "Form not found."
  }
}
```

Validation errors may additionally contain field-level information:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fields": {
      "email": "Enter a valid email address."
    }
  }
}
```

Internal errors should map to safe generic messages.

---

# 53. API Success Format

A consistent success structure may be used:

```json
{
  "success": true,
  "data": {}
}
```

For lists:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

The exact envelope can be finalized during implementation.

---

# 54. Frontend Structure

```text
frontend/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   ├── builder/
│   │   ├── responses/
│   │   └── layout/
│   │
│   ├── constants/
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   └── AppLayout.jsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   └── PublicForm.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   └── app/
│   │       ├── Dashboard.jsx
│   │       ├── MyForms.jsx
│   │       ├── CreateForm.jsx
│   │       ├── FormBuilder.jsx
│   │       ├── FormPreview.jsx
│   │       ├── Responses.jsx
│   │       ├── ResponseDetail.jsx
│   │       └── Profile.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── form.service.js
│   │   ├── response.service.js
│   │   └── account.service.js
│   │
│   ├── utils/
│   │
│   ├── validations/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── package.json
└── vite.config.js
```

---

# 55. Frontend Routing

Public routes:

```text
/
 /login
 /signup
 /f/:publicId
```

Authenticated routes:

```text
/dashboard
/forms
/forms/create
/forms/:formId/edit
/forms/:formId/preview
/forms/:formId/responses
/forms/:formId/responses/:responseId
/profile
```

Exact URL naming may be adjusted during implementation, but the separation between public and authenticated routes should remain.

---

# 56. React Authentication Architecture

Use an `AuthContext` to maintain application authentication state.

Conceptually:

```text
AuthContext
├── status
│   ├── CHECKING
│   ├── AUTHENTICATED
│   └── UNAUTHENTICATED
│
├── user
├── login()
├── logout()
└── refreshAuth()
```

Application startup:

```text
App starts
   ↓
AuthContext checks /auth/me
   ↓
CHECKING
   ↓
AUTHENTICATED or UNAUTHENTICATED
```

This prevents premature redirects.

---

# 57. Protected Routes

Frontend route protection improves UX but is not security.

Conceptually:

```text
ProtectedRoute
    ↓
AuthContext
    ↓
Authenticated?
    ├── Yes → Render page
    └── No  → Login
```

The backend independently protects APIs.

---

# 58. Form Builder State

The builder should maintain a local draft state.

Conceptually:

```text
builderState
├── title
├── description
├── availability
└── questions[]
```

And a save state:

```text
saveState
├── SAVED
├── UNSAVED
└── SAVING
```

This directly supports the explicit Save Draft requirement.

---

# 59. Form Builder Components

Potential component structure:

```text
FormBuilder
├── BuilderHeader
│   ├── SaveStatus
│   ├── PreviewButton
│   └── PublishButton
│
├── FormMetadataEditor
│   ├── TitleInput
│   └── DescriptionInput
│
├── FieldList
│   └── FieldEditor
│       ├── FieldType
│       ├── QuestionInput
│       ├── RequiredToggle
│       ├── ChoiceOptionsEditor
│       └── FieldActions
│
└── AddFieldButton
```

The exact component split can change during implementation.

---

# 60. Dynamic Field Rendering

Both builder and public form rendering should use field type mapping.

Conceptually:

```text
field.type
   ↓
component mapping
   ↓
correct field component
```

Example:

```text
SHORT_ANSWER
→ ShortAnswerField

PARAGRAPH
→ ParagraphField

NUMBER
→ NumberField

MULTIPLE_CHOICE
→ MultipleChoiceField
```

This avoids large repetitive conditional blocks.

---

# 61. Frontend API Service

Components should not directly scatter raw `fetch()` calls everywhere.

Instead:

```text
components/pages
       ↓
service functions
       ↓
api.js
       ↓
fetch
```

For example:

```text
formService.getForms()
formService.createDraft()
formService.updateDraft()
formService.publishForm()
```

This keeps API communication centralized.

---

# 62. Public Form Architecture

Public forms are intentionally separate from authenticated form editing.

Flow:

```text
/f/:publicId
      ↓
PublicForm page
      ↓
GET public form
      ↓
Render respondent fields
      ↓
Collect answers
      ↓
POST response
      ↓
Success
```

The public form should never load the authenticated dashboard form-management payload.

---

# 63. Response Dashboard Architecture

Response page:

```text
Responses
├── Header
│   ├── Response Count
│   ├── Export CSV
│   └── Statistics
│
├── Response List
│   └── Response Row
│
└── Pagination
```

Response detail:

```text
ResponseDetail
├── Submission Metadata
└── Answer List
    ├── Question
    └── Answer
```

Question labels are reconstructed from the published Form.

---

# 64. CSV Architecture

CSV export should be generated from:

```text
Published Form Definition
+
Responses
```

Column order:

```text
Form questions array order
```

Example:

```text
Name,Email,Backend Technology,Submitted At
Sumeet,sumeet@example.com,Node.js,2026-09-26T...
```

Checkbox arrays are serialized into a readable delimited representation.

---

# 65. Statistics Architecture

Statistics are derived from response documents and form definition.

Example:

```text
Total responses
→ count documents

Choice distribution
→ aggregate selected values

Checkbox counts
→ aggregate array elements

Responses over time
→ group submittedAt
```

Statistics must respect form ownership.

---

# 66. Template Architecture

Templates are application-defined.

Possible structure:

```text
backend/src/
└── services/
    └── template.service.js
```

with template definitions stored as constants/data modules.

Example conceptual template:

```text
{
    id,
    name,
    description,
    title,
    formDescription,
    questions[]
}
```

When selected:

```text
Template
   ↓
Clone definition
   ↓
Generate new form ID
   ↓
Generate new field IDs
   ↓
Create DRAFT
```

The original template remains unchanged.

---

# 67. Security Architecture

Security layers:

```text
Browser
   ↓
HTTPS
   ↓
CORS
   ↓
Helmet
   ↓
Rate Limiting
   ↓
Session Authentication
   ↓
Request Validation
   ↓
Authorization
   ↓
Business Validation
   ↓
Database
```

---

# 68. Password Security

Password flow:

```text
Raw Password
    ↓
Argon2
    ↓
passwordHash
    ↓
MongoDB
```

Login:

```text
Submitted Password
    ↓
Argon2 Verify
    ↓
Match?
```

Passwords are never returned through APIs.

---

# 69. Session Security

Session cookie should be configured with:

```text
httpOnly: true
secure: true in production
sameSite: appropriate configuration
```

The exact SameSite/CORS arrangement depends on deployment topology.

Session contents remain minimal:

```text
{
    userId
}
```

No password or full user object.

---

# 70. CORS

CORS must explicitly allow the trusted frontend origin.

Do not use an unrestricted wildcard configuration for authenticated credentialed requests.

The exact production frontend origin will be configured through environment variables.

---

# 71. Helmet

Helmet should be enabled at the Express application level.

It provides baseline HTTP security headers.

---

# 72. Rate Limiting

At minimum consider rate limiting:

```text
POST /auth/register
POST /auth/login
POST /public/forms/:publicId/responses
```

Additional limits can be added based on deployment behavior.

---

# 73. Public Submission Abuse Model

V1 intentionally does not implement:

- CAPTCHA.
- Fingerprinting.
- IP identity.
- One-response-per-person.

However, public submission endpoints should still be rate limited.

The system should reject malformed/invalid requests at the backend.

---

# 74. Error Architecture

Use application-level errors with stable codes.

Examples:

```text
AUTH_INVALID_CREDENTIALS
AUTH_UNAUTHORIZED
USER_NOT_FOUND
FORM_NOT_FOUND
FORM_FORBIDDEN
FORM_INVALID_STATE
FORM_VALIDATION_FAILED
FORM_NOT_ACCEPTING_RESPONSES
RESPONSE_INVALID
RESPONSE_NOT_FOUND
VALIDATION_ERROR
INTERNAL_ERROR
```

Exact list may evolve during implementation.

---

# 75. Important Error Distinction

The system should distinguish:

```text
401 Unauthorized
```

from:

```text
403 Forbidden
```

Conceptually:

### 401

User is not authenticated.

### 403

User is authenticated but does not have permission.

For example:

```text
User A
tries to access
User B's responses
```

→ `403`.

---

# 76. Public Form Error Distinction

For public access, avoid leaking internal information.

For example:

```text
Invalid public ID
```

and:

```text
Deleted form
```

may both result in:

```text
404 Form Not Found
```

The public client does not need to know whether a database record once existed.

---

# 77. Draft Save Flow

```text
User edits builder
       ↓
Local React state
       ↓
Unsaved
       ↓
Save Draft
       ↓
POST/PATCH API
       ↓
Authenticate
       ↓
Ownership check
       ↓
Status == DRAFT?
       ↓
Validate definition
       ↓
Persist
       ↓
Saved
```

---

# 78. Publish Flow

```text
Publish
   ↓
Unsaved?
   ├── Yes → Save Draft
   └── No
        ↓
Backend publish validation
        ↓
Ownership check
        ↓
Status == DRAFT
        ↓
Form definition valid
        ↓
Availability valid
        ↓
Generate publicId
        ↓
status = PUBLISHED
        ↓
publishedAt = now
        ↓
Return public URL
```

---

# 79. Public Submission Flow

```text
POST public response
        ↓
Rate limit
        ↓
Find form by publicId
        ↓
Form exists?
        ├── No → 404
        ↓
status == PUBLISHED?
        ├── No → reject
        ↓
Availability valid?
        ├── No → reject
        ↓
Load questions
        ↓
Validate answers
        ↓
Create response
        ↓
Return success
```

---

# 80. Response Viewing Flow

```text
GET responses
       ↓
Authenticate
       ↓
Find form
       ↓
Verify owner
       ↓
Query responses
       ↓
Sort submittedAt DESC
       ↓
Paginate
       ↓
Return safe response data
```

---

# 81. Form Deletion Flow

```text
DELETE form
      ↓
Authenticate
      ↓
Find form
      ↓
Verify owner
      ↓
Status allowed?
      ├── PUBLISHED → reject
      └── DRAFT/CLOSED
             ↓
       Start transaction
             ↓
       Delete responses
             ↓
       Delete form
             ↓
          Commit
```

---

# 82. Account Deletion Flow

```text
DELETE account
      ↓
Authenticate
      ↓
Verify password
      ↓
Start transaction
      ↓
Find user's forms
      ↓
Delete responses
      ↓
Delete forms
      ↓
Delete user
      ↓
Commit
      ↓
Destroy session
      ↓
Redirect home
```

---

# 83. Form Duplication Flow

```text
Duplicate
    ↓
Authenticate
    ↓
Verify ownership
    ↓
Load original form
    ↓
Clone form metadata/questions
    ↓
Generate new field IDs
    ↓
Remove publicId
    ↓
Set status = DRAFT
    ↓
Clear publishedAt
    ↓
Create new form
```

Responses are never copied.

---

# 84. Date and Time Architecture

All persisted timestamps should use a consistent server/database representation, preferably UTC.

Examples:

```text
createdAt
updatedAt
publishedAt
submittedAt
availability.startAt
availability.endAt
```

The frontend should convert timestamps to the user's display timezone.

The exact timezone UX and scheduling rules will be finalized during implementation.

---

# 85. Frontend State Categories

The frontend should distinguish:

### Authentication State

```text
CHECKING
AUTHENTICATED
UNAUTHENTICATED
```

### Async State

```text
IDLE
LOADING
SUCCESS
ERROR
```

### Builder Save State

```text
SAVED
UNSAVED
SAVING
```

### Form Runtime State

```text
AVAILABLE
NOT_STARTED
ENDED
CLOSED
NOT_FOUND
```

These explicit states prevent ambiguous UI behavior.

---

# 86. No Global State Library in V1

FormFlow does not currently require Redux or another large global state solution.

Use:

- React Context for authentication/theme where appropriate.
- Local component state for builder and forms.
- Service functions for API communication.
- Custom hooks for reusable client logic.

If actual complexity later demonstrates a need for a state library, it can be introduced deliberately.

---

# 87. Form Builder State Strategy

The builder should maintain its own working copy:

```text
Server Form
    ↓
Load
    ↓
Local Builder State
    ↓
User edits
    ↓
Unsaved
    ↓
Save
    ↓
Server
```

The server remains authoritative.

There is no autosave or collaborative synchronization in V1.

---

# 88. Published Form Immutability — Full Enforcement

This rule exists at three levels.

### UI

Published form does not expose edit controls.

### API

Update endpoint rejects non-draft forms.

### Service

Form service explicitly enforces:

```text
status === DRAFT
```

before structural updates.

This provides defense in depth.

---

# 89. Public API Data Boundary

Public response:

```text
Safe Public Form DTO
```

should contain approximately:

```text
publicId
title
description
questions
availability state
```

It must not contain:

```text
ownerId
createdAt
updatedAt
publishedAt
private account data
responses
internal identifiers
```

unless a future requirement explicitly needs them.

---

# 90. Private Form API Data Boundary

Authenticated owner APIs can expose more information, such as:

```text
formId
publicId
title
description
status
availability
questions
responseCount
createdAt
updatedAt
publishedAt
```

but should still return only what the client needs.

---

# 91. Response API Data Boundary

A response list may contain:

```text
responseId
submittedAt
```

and summary information as needed.

Individual response:

```text
responseId
submittedAt
answers
```

Question labels should be resolved from the form definition.

---

# 92. Testing Architecture

Testing should be divided into:

```text
tests/
├── unit/
└── integration/
```

## Unit Tests

Focus on:

- Form validation.
- Response validation.
- Availability calculation.
- Lifecycle rules.
- Public ID generation.
- Statistics transformations.
- Utility functions.

## Integration Tests

Focus on:

- Registration.
- Login.
- Logout.
- Protected routes.
- Form creation.
- Draft update.
- Publishing.
- Public submission.
- Response authorization.
- Form deletion.
- Account deletion.

---

# 93. Critical Test Cases

The following are especially important:

### Authentication

```text
Valid registration
Duplicate email
Invalid login
Valid login
Session expiration
Logout
```

### Forms

```text
Create draft
Update draft
Invalid draft
Publish valid form
Publish invalid form
Edit published form → reject
Close form
Reopen form
Duplicate form
Delete form
```

### Public Forms

```text
Valid public ID
Invalid public ID
Draft public access
Closed form
Scheduled before start
Scheduled during window
Scheduled after end
Submission after closure
```

### Responses

```text
Valid response
Missing required field
Unknown field ID
Wrong type
Invalid option
Invalid checkbox values
Unauthorized response access
Delete response
Pagination
CSV export
```

---

# 94. Deployment Architecture

A simple V1 deployment can use:

```text
Browser
   │
   ▼
Frontend Hosting
   │
   │ HTTPS/API
   ▼
Backend Server
   │
   ▼
MongoDB
```

The frontend and backend may be hosted separately.

The exact provider is intentionally not fixed in this architecture document.

---

# 95. Environment Configuration

Backend environment variables should include concepts such as:

```text
NODE_ENV
PORT
MONGO_URI
SESSION_SECRET
FRONTEND_URL
```

Additional deployment-specific configuration may be added later.

Secrets must never be committed to Git.

`.env.example` documents required variables without real secrets.

---

# 96. Local Development

Development environment:

```text
Frontend
localhost:<frontend-port>

Backend
localhost:<backend-port>

MongoDB
local/managed development database
```

The frontend communicates with the backend through the configured API origin.

CORS and cookie configuration must work correctly in local development and production.

---

# 97. Production Architecture Requirements

Production must use:

- HTTPS.
- Secure cookies.
- Production MongoDB deployment supporting transactions.
- Proper CORS origin.
- Environment-managed secrets.
- Production error handling.
- Rate limiting.
- Security headers.

---

# 98. Logging

Backend logging should record useful operational information without logging secrets.

Do not log:

- Passwords.
- Session secrets.
- Authentication cookies.
- Sensitive request payloads.

Useful logs may include:

```text
request method
route
status code
duration
error code
```

The exact logging library is an implementation decision.

---

# 99. Monitoring

V1 does not require a complex observability platform.

At minimum, production should make it possible to identify:

- Server errors.
- Database connection failures.
- Repeated authentication failures.
- Public submission failures.
- Unexpected crashes.

Advanced monitoring can be added later.

---

# 100. Architecture Decisions Summary

| Area | Decision |
|---|---|
| Repository | Single full-stack repository |
| Frontend | React + Vite + JavaScript |
| Backend | Node.js + Express + JavaScript |
| Database | MongoDB + Mongoose |
| API | REST |
| API Version | `/api/v1` |
| Authentication | `cookie-session` |
| Password Hashing | Argon2 |
| Validation | express-validator + domain validation |
| Main Collections | Users, Forms, Responses |
| Questions | Embedded in Form |
| Responses | One document per submission |
| Answers | Dynamic map keyed by field ID |
| Public Identity | Random `publicId` |
| Draft Persistence | Explicit Save Draft |
| Published Forms | Immutable |
| Form Versions | Separate duplicated forms |
| Soft Delete | No |
| Form Order | Array order |
| Transactions | Destructive multi-document operations |
| Public Submission | Anonymous |
| Rate Limiting | Auth + public submission |
| State Management | React state/context |
| Global State Library | Not required in V1 |
| API Data Boundary | DTO/safe response objects |
| Testing | Unit + integration |

---

# 101. Core Architectural Principles

## Principle 1 — Backend Is the Security Boundary

The frontend can improve UX, but never determines whether an operation is authorized.

---

## Principle 2 — Business Rules Live in Services

Controllers should not become giant business-logic files.

---

## Principle 3 — Published Forms Are Immutable

This simplifies historical response interpretation and avoids versioning complexity.

---

## Principle 4 — Dynamic Does Not Mean Unstructured

MongoDB stores flexible answers, but the Form definition determines what is valid.

---

## Principle 5 — Keep V1 Small

Do not introduce:

- Redis.
- Queues.
- Microservices.
- Event buses.
- GraphQL.
- Redux unless required.
- Separate question collections.
- Complex caching.

None are justified by the current V1 requirements.

---

## Principle 6 — Use the Database for Persistence, Not Files

Responses are MongoDB documents, not JSON files.

---

## Principle 7 — Public and Private APIs Are Different Security Boundaries

Public form retrieval/submission exposes only what respondents need.

Authenticated APIs expose owner functionality only after authorization.

---

# 102. End-to-End Architecture

The complete system can be viewed as:

```text
                         FORMFlow
                            │
              ┌─────────────┴─────────────┐
              │                           │
         Public Side                 Authenticated Side
              │                           │
        Landing Page                    Login
              │                           │
        Public Form                    Session
              │                           │
        Submit Response                Dashboard
              │                           │
              │                      Form Builder
              │                           │
              │                      Form Lifecycle
              │                           │
              │                       Responses
              │                           │
              └─────────────┬─────────────┘
                            │
                         REST API
                            │
                       Express Server
                            │
                 ┌──────────┴──────────┐
                 │                     │
            Middleware             Controllers
                                       │
                                       ▼
                                   Services
                                       │
                                       ▼
                                  Repositories
                                       │
                                       ▼
                                    Mongoose
                                       │
                                       ▼
                                    MongoDB
```

---

# 103. Final Database Model

## User

```text
User
├── _id
├── name
├── email
├── passwordHash
├── createdAt
└── updatedAt
```

## Form

```text
Form
├── _id
├── ownerId
├── publicId
├── title
├── description
├── status
├── availability
│   ├── type
│   ├── startAt
│   └── endAt
├── questions[]
│   ├── fieldId
│   ├── type
│   ├── question
│   ├── required
│   └── options[]
├── publishedAt
├── createdAt
└── updatedAt
```

## Response

```text
Response
├── _id
├── formId
├── answers
└── submittedAt
```

---

# 104. Final Project Structure

```text
formflow/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── forms/
│   │   │   ├── builder/
│   │   │   ├── responses/
│   │   │   └── layout/
│   │   ├── constants/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── auth/
│   │   │   └── app/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── databases/
│   │   ├── helpers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── discussion.md
├── prd.md
├── architecture.md
├── README.md
└── .gitignore
```

---

# 105. Implementation Order

Architecture is now sufficiently defined to establish a build order.

Recommended implementation sequence:

```text
1. Repository + project setup
        ↓
2. Backend foundation
        ↓
3. MongoDB connection
        ↓
4. User model
        ↓
5. Session authentication
        ↓
6. Authentication APIs
        ↓
7. Frontend authentication
        ↓
8. Form model
        ↓
9. Form APIs
        ↓
10. Dashboard / My Forms
        ↓
11. Form Builder
        ↓
12. Draft persistence
        ↓
13. Publish lifecycle
        ↓
14. Public form
        ↓
15. Response validation
        ↓
16. Response storage
        ↓
17. Response dashboard
        ↓
18. CSV export
        ↓
19. Statistics
        ↓
20. Account management
        ↓
21. Security hardening
        ↓
22. Testing
        ↓
23. Deployment
```

---

# 106. Architecture-to-Implementation Boundary

This document defines the implementation architecture, but some low-level choices remain implementation details.

Examples:

- Exact npm package versions.
- Exact Mongoose schema syntax.
- Exact React component props.
- Exact CSS organization.
- Exact error class implementation.
- Exact test framework configuration.
- Exact hosting provider.
- Exact logging package.

Those should be selected during implementation without changing the architectural principles above.

---

# 107. Architecture Completion Criteria

The architecture phase is considered complete when the following are understood:

- Project structure.
- Frontend/backend boundary.
- Backend layers.
- Database collections.
- Database relationships.
- Form schema.
- Response schema.
- User schema.
- Field representation.
- Form lifecycle.
- Availability model.
- Authentication architecture.
- Authorization architecture.
- Public/private API boundaries.
- API endpoint structure.
- Response validation strategy.
- Security baseline.
- Transaction boundaries.
- Testing structure.
- Deployment shape.
- Implementation order.

The next phase is implementation planning and then coding.

---

# 108. Final Architectural Statement

FormFlow V1 is intentionally a **modular monolithic full-stack application**:

```text
React
  +
Express
  +
MongoDB
```

It is not a microservices system.

Its complexity comes from the **domain**, not from infrastructure.

The architecture therefore prioritizes:

- Clear separation of responsibilities.
- Strong backend validation.
- Explicit authorization.
- Immutable published form definitions.
- Dynamic but structured response storage.
- Simple database relationships.
- Explicit draft persistence.
- Safe public/private API boundaries.
- Minimal V1 infrastructure.

The result should be sophisticated enough to teach real backend engineering while remaining small enough to understand and maintain as a single developer project.

**Architecture phase V1 baseline: established.**
