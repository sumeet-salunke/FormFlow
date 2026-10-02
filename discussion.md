# FormFlow — Discussion

## 01 — Project Overview

FormFlow is a full-stack, Google Forms-style application where authenticated users can create forms, publish them, share forms with others, collect responses, and view/manage those responses from their dashboard.

The project is intended primarily to strengthen full-stack architecture and backend engineering rather than to build another authentication-heavy application.

\---

## 02 — Development Approach

The project will be developed through the following process:

```text
IDEATE
  ↓
SIMULATE
  ↓
DISCUSS
  ↓
ESTABLISH REQUIREMENTS
  ↓
ARCHITECTURE
  ↓
BUILD
  ↓
CODE
  ↓
TEST
  ↓
REFINE
```

The application will first be discussed as if it were already deployed and being used by real users. User flows, UI states, application states, business rules, edge cases, and backend behavior will be explored before implementation.

\---

## 03 — Technology Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* Fetch API initially

### Backend

* Node.js
* Express.js
* JavaScript

### Database

* MongoDB
* Mongoose

### Validation

* `express-validator` for request-level validation where appropriate
* Dynamic form/response validation will be handled as application/domain logic where validation depends on the form definition

### Authentication \& Security

* Argon2 for password hashing
* `jose` for JWT/JOSE-related authentication functionality
* HTTP-only cookies if cookie-based authentication is selected during architecture discussion
* Authentication and authorization middleware
* Helmet
* CORS
* Rate limiting where appropriate

### Development / Testing

* Git
* GitHub
* Thunder Client / Postman
* Testing tools to be selected later based on project requirements

\---

## 04 — Authentication Scope

Authentication is supporting infrastructure, not the primary learning objective of FormFlow.

### Included initially

* User registration
* User login
* User logout
* Authentication middleware
* Authorization / ownership checks

### Explicitly excluded initially

* Email verification
* MFA
* OTP authentication
* OAuth/social login
* Password reset flow
* Advanced token-family/revocation architecture
* Other advanced authentication features unless a later requirement justifies them

### Reason

The user has already implemented an advanced authentication-focused project (SecurePass). Rebuilding those features would add complexity without contributing significantly to the primary purpose of FormFlow: learning full-stack architecture, dynamic forms, response handling, validation, state management, API design, database modeling, security, and testing.

\---

## 05 — Documentation Strategy

### `discussion.md`

This is the living engineering discussion document. It records:

* Decisions
* Reasons for decisions
* Alternatives considered
* Trade-offs
* Open questions
* Decision revisions

It will be maintained from the beginning of the project.

### `prd.md`

The PRD will **not** be finalized at the beginning.

It will be created/populated after the ideation and discussion phase is complete and the product requirements have been established. It will represent the finalized product specification rather than the history of discussions.

\---

## 06 — Current Status

The project is currently in the **Ideation / Discussion** phase.

No implementation has started yet.

The next major discussion area is the complete user/product flow: anonymous visitor → registration/login → dashboard → form creation → form publishing → sharing → respondent submission → response management.

## 07 — Landing / Home Page

### Scenario

A new, unauthenticated user visits:

`https://formflow.com`

The user is considered an anonymous visitor and has not created an account or logged in.

### Landing Page Structure

The home page will contain the following major sections:

#### 1. Navbar

The navbar will contain:

* FormFlow branding/logo
* Login
* Sign Up
* Theme option, if a theme toggle is considered necessary

The navbar should remain simple and focused on the primary actions.

#### 2. Hero Section

The hero section will communicate the primary purpose of FormFlow.

It will contain:

* A clear FormFlow tagline/value proposition
* A primary call-to-action
* Visual representation of forms

The visual area may contain approximately 4–6 form previews/cards that move or transition to demonstrate different types of forms that can be created using FormFlow.

The exact implementation of the moving form visuals will be decided during the UI/design phase.

Primary actions:

* `Get Started` → Sign Up
* `Create Form` → Sign Up

#### 3. Advantages / Benefits Section

A section explaining the major benefits of using FormFlow.

Possible themes:

* Easy form creation
* Shareable forms
* Simple response collection
* Centralized response management
* Useful response insights
* Simple and accessible user experience

The exact benefits and copy will be finalized later.

#### 4. FAQ Section

A Frequently Asked Questions section addressing common questions about FormFlow.

The exact questions and answers will be finalized later based on the final product functionality.

### Anonymous User Permissions

An unauthenticated visitor can:

* Visit the landing page
* View the product information
* View the advantages/features
* Read FAQs
* Navigate to Login
* Navigate to Sign Up
* Start the form-creation flow, which redirects/requires Sign Up

An unauthenticated visitor cannot access the authenticated dashboard or create/manage forms without an account.

### Initial Navigation Flow

```text
Anonymous Visitor
        |
        v
https://formflow.com
        |
        +--------------------+
        |                    |
        v                    v
     Login                Sign Up
        |                    |
        v                    v
     Login UI           Registration UI


Hero Actions:

Get Started ────────────> Sign Up
Create Form ────────────> Sign Up
```

### Current Decision

The landing page is primarily a **product introduction and conversion page**.

It should not expose unnecessary application functionality to anonymous users.

The primary objective is to communicate:

> What FormFlow is, why someone would use it, and how to get started.

### Open Questions

These are intentionally not finalized yet:

* Final FormFlow tagline
* Exact hero copy
* Exact form preview designs
* Whether the moving form visuals are interactive or purely visual
* Theme support and theme options
* Exact benefits/advantages
* Exact FAQ content
* Responsive/mobile behavior
* Navbar behavior while scrolling
* Whether a footer is required
* Whether a logged-in user visiting `/` should see the same landing page or a different experience

These will be resolved during the subsequent product and UI discussions.

## 08 — Registration / Sign Up Flow

### Decision

FormFlow will provide a simple account registration flow using:

* Name
* Email
* Password
* Confirm Password

`Confirm Password` is used only for validation and will **never be stored** in the database.

The registration flow is intentionally kept simple because advanced authentication features were already explored in previous projects and are not the focus of FormFlow V1.

### User Flow

```text
Landing Page
    ↓
Sign Up
    ↓
Registration Form
    ↓
Client-side Validation
    ↓
POST /api/auth/register
    ↓
Server-side Validation
    ↓
Check Duplicate Email
    ↓
Hash Password with Argon2
    ↓
Create User
    ↓
Create Session
    ↓
Set Session Cookie
    ↓
Redirect to Dashboard
```

### Client-side Validation

The frontend should provide immediate validation for:

* Required fields
* Basic email format
* Password requirements
* Password and confirm-password match

Client-side validation exists primarily for user experience.

It must not be treated as the security boundary because requests can bypass the frontend.

### Server-side Validation

The backend will validate registration requests using `express-validator`.

The server will verify:

* Required fields are present
* Email format is valid
* Password satisfies the defined requirements
* Email is not already registered

`confirmPassword` may be validated on the server if included in the request, but it will not be persisted.

### Password Storage

Passwords will be hashed using **Argon2** before being stored.

Plain-text passwords must never be stored in the database.

### Duplicate Email

Email addresses will be treated as unique.

If a user attempts to register with an already-registered email, the API will return an appropriate validation error.

### Successful Registration

A successful registration will automatically authenticate the user.

The backend will:

1. Create the user.
2. Create a session containing minimal user information.
3. Set the session cookie.
4. Return a successful response.

The frontend will then redirect the user to the dashboard.

The user should not have to manually log in immediately after signing up.

### Error Handling

Possible registration errors include:

* Invalid input
* Password mismatch
* Invalid email
* Duplicate email
* Database failure
* Unexpected server error
* Network/request failure

Recoverable form errors should be displayed clearly without unnecessarily clearing the user's previously entered information.

### Out of Scope for V1

The following authentication features are intentionally excluded:

* Email verification
* OTP verification
* MFA
* OAuth/social login
* Password reset
* Account recovery
* Account locking
* Refresh-token systems
* Complex token revocation
* Remember-me functionality

These may be considered in a future version if required.

---

## 09 — Login Flow

### Decision

FormFlow will provide a simple email/password login flow using the same session-based authentication architecture as registration.

Login fields:

* Email
* Password

Authentication will use **`cookie-session`**.

### User Flow

```text
Login Page
    ↓
Enter Email + Password
    ↓
Client-side Validation
    ↓
POST /api/auth/login
    ↓
Server-side Validation
    ↓
Find User
    ↓
Verify Password with Argon2
    ↓
Create Session
    ↓
Set Session Cookie
    ↓
Redirect to Dashboard
```

### Client-side Validation

The frontend should validate:

* Email is provided
* Password is provided
* Basic email format

A loading state should be displayed while the login request is being processed.

Repeated submissions should be prevented while the request is in progress.

### Server-side Validation

The backend will use `express-validator` for request validation.

The server will:

1. Validate the request.
2. Find the user by email.
3. Verify the submitted password against the stored Argon2 hash.
4. Create the authenticated session.
5. Return a successful response.

### Invalid Credentials

For security, invalid login attempts should return a generic message such as:

> Invalid email or password.

The API should not reveal whether:

* The email does not exist.
* The email exists but the password is incorrect.

This reduces unnecessary user-account enumeration.

### Session Behavior

FormFlow V1 will use `cookie-session`.

Only minimal information should be stored in the session, such as:

```text
userId
```

Passwords, complete user objects, or other unnecessary data must not be stored in the session.

The session cookie should be configured appropriately for the environment, including security-related cookie settings.

### Persistent Login State

Refreshing the dashboard should not immediately log the user out as long as the session remains valid.

The frontend should initialize its authentication state by checking the current session through an endpoint such as:

```text
GET /api/auth/me
```

The frontend should have an initial authentication state such as:

```text
UNKNOWN / CHECKING
```

This prevents protected pages from briefly appearing as logged out while the session is being checked.

### Protected Routes

Frontend route protection exists primarily for user experience.

For example:

```text
Unauthenticated → /dashboard → Redirect to /login
Authenticated → /login → Redirect to /dashboard
```

However, frontend route protection is **not a security mechanism**.

Every protected backend API must independently verify that the request is authenticated.

### Session Expiration

If an authenticated API request receives a `401 Unauthorized` response because the session is no longer valid:

```text
API → 401
   ↓
Frontend clears authentication state
   ↓
Redirect to Login
```

The user should receive a clear indication that they need to log in again.

### Logout

Logout will use a backend endpoint:

```text
POST /api/auth/logout
```

The logout flow will:

1. Destroy/clear the server-side session representation used by the application.
2. Clear the session cookie.
3. Clear frontend authentication state.
4. Redirect the user to the landing page.

### Already Authenticated Users

If an authenticated user manually visits:

```text
/login
/signup
```

the application should redirect them to the dashboard rather than displaying the authentication forms again.

### Authentication Scope

Authentication in FormFlow is intentionally simpler than the authentication system implemented in SecurePass.

The goal is to provide reliable account/session handling while keeping the primary learning focus on:

* Dynamic forms
* Form state
* API design
* Data modeling
* Validation
* Authorization
* Response collection
* Dashboard functionality

## 13 — Form Lifecycle and Publishing

### Decision

FormFlow V1 will use three primary form states:

* `DRAFT`
* `PUBLISHED`
* `CLOSED`

A fourth conceptual state, `DELETED`, represents permanent removal rather than an active form state.

The lifecycle is intentionally designed around **form immutability after publication**.

Once a form is published, its structure can no longer be modified, including by its creator.

### Lifecycle

```text
DRAFT
  │
  │ Publish
  ▼
PUBLISHED
  │
  │ Temporarily Close
  ▼
CLOSED
  │
  │ Permanently Delete
  ▼
DELETED
```

A published form may also become temporarily unavailable because of scheduled availability.

### Draft

A draft form can be freely modified by its creator.

The creator can:

* Change title
* Change description
* Add fields
* Delete fields
* Reorder fields
* Duplicate fields
* Modify field configuration
* Configure response availability
* Delete the draft
* Publish the form

Draft forms are not publicly available for response submission.

### Published

Publishing is a structural commitment.

After publication, nobody can modify the form structure, including the creator.

The creator cannot:

* Add fields
* Delete fields
* Reorder fields
* Change field types
* Modify field configuration
* Change questions
* Change title or description

The creator can:

* View the form
* Share the public form
* View responses
* View response-related information
* Temporarily close the form

This immutability protects the consistency and meaning of previously submitted responses.

### Modifying a Published Form

If the creator wants to make changes to a published form, they cannot edit the existing form.

Instead:

```text
Published Form
    ↓
Duplicate Form
    ↓
New Draft
    ↓
Edit
    ↓
Publish
```

The original published form and its responses remain unchanged.

This also avoids ambiguity when questions or field definitions change after responses have already been collected.

### Closed

A closed form is no longer accepting responses.

The creator can:

* View existing responses
* View response information
* Reopen the form
* Permanently delete the form

The creator cannot modify the form structure.

A public visitor attempting to submit a closed form should see a clear message indicating that the form is currently closed and not accepting responses.

### Deletion

Permanent deletion is a destructive action.

The exact data-deletion behavior, including what happens to associated responses and whether any recovery mechanism exists, will be finalized separately.

### Form Status vs Response Availability

Form lifecycle state and response availability will be treated as separate concepts.

Form status:

```text
DRAFT
PUBLISHED
CLOSED
```

Response availability:

```text
ALWAYS
SCHEDULED
```

This separation prevents the system from unnecessarily changing the fundamental form state merely because a scheduled response window has opened or closed.

### Time-Based Forms

A published form may optionally define a response window.

Example:

```text
Start: 10 October 2026, 09:00
End:   15 October 2026, 18:00
```

The form remains `PUBLISHED`, while the backend determines whether it is currently accepting responses based on the configured availability window.

Conceptually:

```text
Before start
    → Published but not accepting responses

Within window
    → Published and accepting responses

After end
    → Published but not accepting responses
```

The backend must enforce this availability. The frontend should reflect the current state but must not be trusted as the security boundary.

### Manual Close/Reopen vs Scheduled Availability

Manual closing/reopening and scheduled availability are treated as separate concepts.

A future discussion will define how manual reopening interacts with an active or expired schedule.

### Design Principle

The primary principle for the lifecycle is:

> **A published form represents a stable definition of a questionnaire.**

This allows responses to remain structurally meaningful even after large numbers of submissions have been collected.

## 14 — Response Storage and Dynamic Answers

### Decision

FormFlow V1 will use a **flexible MongoDB response document** rather than generating and storing individual JSON files for each submission.

Each form can contain a different set of fields, so the response model must support dynamic structures without requiring a separate database schema for every form.

### Response Structure

Each form submission will be stored as one response document containing:

* Response ID
* Form ID
* Submission timestamp
* Answers

Conceptually:

```text id="m7k49x"
Response
├── _id
├── formId
├── submittedAt
└── answers
      ├── fieldId → value
      ├── fieldId → value
      ├── fieldId → value
      └── ...
```

Example:

```json id="pj1h6f"
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

### Stable Field IDs

Each field will have a unique and stable identifier.

Responses will reference fields using these IDs rather than question text.

Example form definition:

```json id="7r8nqu"
{
  "id": "field_abc123",
  "type": "short_answer",
  "question": "What is your name?"
}
```

Corresponding response:

```json id="g7jz2e"
{
  "field_abc123": "Sumeet"
}
```

This prevents responses from depending on mutable question text.

If the question text changes in a future draft, the original published form and its responses remain structurally consistent.

### Why JSON Files Are Not Used

The initial idea was to generate a separate JSON file for every form submission.

This was rejected as the primary persistence mechanism.

The problem is not that JSON itself is inherently unsafe. The main problems would be:

* Difficult querying
* Difficult aggregation
* Difficult pagination
* File-management overhead
* Concurrency concerns
* More complicated response management
* Poor integration with MongoDB's querying capabilities

MongoDB documents already provide the required flexibility while supporting normal database operations.

### Backend Validation

The backend must **not blindly store the JSON received from the frontend**.

The submitted response must be validated against the corresponding form definition.

Conceptual flow:

```text id="q5g9i2"
Receive submission
      ↓
Load form definition
      ↓
Verify form exists
      ↓
Verify form is accepting responses
      ↓
Validate submitted field IDs
      ↓
Validate answer types
      ↓
Validate allowed options
      ↓
Validate required fields
      ↓
Store validated response
```

The frontend performs validation for user experience, but the backend remains the source of truth for response validation.

### Unknown Fields

If a submission contains a field ID that does not belong to the published form, the backend should reject or otherwise safely handle the invalid submission rather than storing arbitrary fields.

Example:

```json id="a2r4ez"
{
  "field_abc123": "Sumeet",
  "field_fake999": "Unexpected value"
}
```

`field_fake999` is not part of the form definition and must not be trusted.

### Dynamic Response Schema

The response model intentionally does not define a fixed set of answer fields such as:

```text
name
email
age
phone
```

because every FormFlow form can contain a different set and combination of fields.

Instead:

```text id="x50jny"
Form Definition
       ↓
Defines valid fields
       ↓
Response
       ↓
Contains answers for those fields
```

Therefore, the **form definition acts as the effective schema for its responses**.

### Design Principle

> **Flexible data should be modeled dynamically, not by abandoning structured persistence.**

FormFlow will use MongoDB's flexible document model while maintaining strict backend validation based on the published form definition.

## 15 — Public Form Submission Flow

### Decision

Published FormFlow forms can be accessed through a public URL without requiring the respondent to have a FormFlow account.

Example:

```text
https://formflow.com/f/:formId
```

Anonymous users can submit responses without authentication.

V1 will allow multiple valid submissions from the same person/device.

FormFlow will not attempt to identify or prevent duplicate anonymous respondents in V1.

### Public Form Loading

When a visitor opens a public form:

```text
Public Form URL
      ↓
GET /api/forms/:formId/public
      ↓
Find Form
      ↓
Verify public availability
      ↓
Return safe form definition
      ↓
Render Form
```

The public API should expose only the information required to render the form.

It must not expose:

* Creator's private information
* Existing responses
* Dashboard information
* Internal database details
* Sensitive configuration

### Client-Side Validation

The frontend should validate responses before submission for immediate user feedback.

Examples:

* Required fields
* Email format
* Number format
* Valid date input
* Selection requirements

Client-side validation is primarily a user-experience feature and is not considered a security boundary.

### Response Submission

A valid submission follows:

```text
User fills form
      ↓
Client-side validation
      ↓
POST /api/forms/:formId/responses
      ↓
Backend loads published form definition
      ↓
Check response availability
      ↓
Validate field IDs
      ↓
Validate answer types
      ↓
Validate allowed options
      ↓
Validate required fields
      ↓
Store response
      ↓
Return success
```

### Backend Validation

The backend must independently validate every submission.

The frontend must not be trusted because a user can manually construct requests without using the React interface.

The backend must verify:

* Form exists
* Form is published
* Form is currently accepting responses
* Submitted field IDs belong to the form
* Answer types match their field definitions
* Choice values belong to the configured options
* Required fields have valid answers

### Field Type Validation

The response validator will use the published field definition.

Conceptually:

```text
Short Answer      → string
Paragraph         → string
Number            → number
Email             → valid email string
Date              → valid date value
Multiple Choice   → one allowed option
Checkboxes        → array of allowed options
Dropdown          → one allowed option
```

The exact representation and validation implementation will be finalized during architecture.

### Invalid Field IDs

A response containing a field ID that does not belong to the form must not be blindly persisted.

Example:

```json
{
  "field_abc123": "Sumeet",
  "field_fake999": "Unexpected value"
}
```

The backend should reject the invalid submission.

### Invalid Choice Values

Choice-based fields must be validated against the options stored in the published form definition.

For example, if the form defines:

```text
JavaScript
Java
Python
```

a manually submitted value such as:

```text
C++
```

must be rejected.

### Draft Forms

Draft forms must not accept public responses.

If a visitor attempts to access or submit a draft form, the application should show an appropriate unavailable/not-yet-published state.

The backend must enforce this independently of the frontend.

### Closed Forms

A closed form does not accept new submissions.

The public form may remain accessible and display:

```text
This form is currently closed and is not accepting responses.
```

The backend must reject submissions after the form has been closed.

### Scheduled Forms

Scheduled forms follow their configured response window.

Before the start time:

```text
This form isn't accepting responses yet.
```

During the response window:

```text
Responses are accepted.
```

After the end time:

```text
This form is no longer accepting responses.
```

The backend determines whether a response can be accepted based on the current time and configured availability.

### Submission During Closing Boundary

If a respondent opens a form while it is available but submits after the response window has ended, the backend checks the current availability at submission time.

If the form is no longer accepting responses, the submission is rejected.

The respondent should receive a clear message explaining that the response was not submitted.

### Successful Submission

After a successful submission, the respondent should see a confirmation state rather than being automatically redirected to the FormFlow homepage.

Example:

```text
✓ Response submitted successfully

Thank you for your response.
```

The exact confirmation UI will be finalized during the frontend design phase.

### Double Submission

The frontend should disable the Submit button while a submission is being processed.

However, frontend protection alone is not considered sufficient for preventing duplicate requests.

V1 does not attempt to identify duplicate anonymous respondents.

Each independently submitted valid response is treated as a separate response.

### Network Failure

If the submission request fails because of a network or server error, the respondent should receive a clear error message and an opportunity to retry.

Example:

```text
Unable to submit your response.

Please check your connection and try again.
```

Advanced idempotency handling may be considered later if required.

### Anonymous Responses

FormFlow V1 does not require respondents to authenticate.

Therefore, a response does not necessarily contain a `userId`.

Conceptually:

```text
Response
├── formId
├── submittedAt
└── answers
```

Respondent identity features may be introduced in a future version.

### Duplicate Anonymous Submissions

V1 will allow multiple submissions from the same person or device.

The following mechanisms will **not** be implemented for duplicate prevention in V1:

* IP-based blocking
* Device fingerprinting
* Browser fingerprinting
* Forced respondent accounts
* Mandatory cookies for identity

This keeps the public form experience simple and avoids introducing unnecessary privacy and identity concerns.

A future version may introduce an explicit "one response per person" feature using a defined identity mechanism.

## 16 — Responses Dashboard

### Decision

Form owners will have a dedicated Responses section for each form.

Navigation:

```text id="r8wq1d"
My Forms
    ↓
Select Form
    ↓
Responses
```

The Responses section will provide:

* Response count
* Response list
* Individual response details
* Pagination
* Basic statistics
* Individual response deletion
* CSV export

Advanced analytics and filtering are outside the initial V1 scope.

### Response Overview

The Responses page should provide a high-level summary.

Example:

```text id="r1z3e8"
College Event Registration

Responses: 127
Status: Published

[ Form ] [ Responses ]
```

Basic summary information may include:

* Total responses
* Most recent response
* Current response availability

The exact visual design will be finalized during the frontend design phase.

### Response List

Responses should be displayed in a paginated list rather than loading every response into the frontend.

A response may be represented as:

```text id="x7p4cq"
Response #127
Submitted: September 26, 2026 — 09:42 AM
```

Because FormFlow V1 supports anonymous submissions, the UI should not imply that a respondent has been identified when no respondent identity exists.

### Individual Response

Selecting a response opens its complete details.

Example:

```text id="8w5r9k"
Response #127
Submitted: September 26, 2026 — 09:42 AM

What is your name?
Sumeet

What is your email?
sumeet@example.com

What is your year?
3rd Year

Which skills do you have?
JavaScript
Node.js
```

Question text is obtained from the published form definition.

Answers are obtained from the stored response document using stable field IDs.

### Pagination

The backend must support paginated response retrieval.

Conceptually:

```text id="3c4z8n"
GET /api/forms/:formId/responses?page=1&limit=20
```

The backend should enforce a reasonable maximum page size.

The exact pagination strategy may be changed to cursor-based pagination later if required by scale.

### Response Authorization

Only the owner of a form can access its responses.

The backend must verify ownership independently of frontend navigation.

Conceptually:

```text id="q7s1mc"
Authenticated User
       ↓
Requested Form
       ↓
Does user own form?
    /          \
  Yes           No
   ↓             ↓
Allow          Reject
```

Knowing a form ID must never be sufficient to access its responses.

### Individual Response Deletion

Form owners will be able to delete individual responses.

This is useful for:

* Test submissions
* Spam
* Accidental submissions
* Duplicate submissions
* Invalid/non-useful responses

Deletion must require explicit confirmation.

Example:

```text id="x2k7vb"
Delete this response?

This action cannot be undone.

[Cancel] [Delete]
```

### Delete All Responses

Bulk deletion of all responses is **out of scope for V1**.

It is highly destructive and is not required for the initial product.

It may be considered in a future version with stronger confirmation and potentially additional safeguards.

### CSV Export

Form owners will be able to export responses as CSV.

Example:

```text id="f4q2vp"
Name,Email,Year,Skills,Event Date
Sumeet,sumeet@example.com,3rd Year,"JavaScript;Node.js",2026-10-10
Rahul,rahul@example.com,4th Year,"Java",2026-10-11
```

The export should use the published form definition to determine column names and ordering.

Conceptually:

```text id="h9s3xk"
Field 1 → Column 1
Field 2 → Column 2
Field 3 → Column 3
...
```

Checkbox values may be represented as a suitable delimited value within a CSV cell.

The exact CSV formatting will be finalized during implementation.

### Basic Analytics

FormFlow V1 will provide lightweight response analytics.

The purpose is to help the creator understand collected responses without turning FormFlow into a full analytics platform.

Possible V1 analytics include:

* Total response count
* Responses over time
* Choice distribution
* Checkbox selection counts

Example:

```text id="x5z1aa"
Preferred Language

JavaScript   52
Java         31
Python       24
```

For checkbox fields, the system may count each selected option independently.

### Advanced Analytics

The following are outside V1 scope:

* Complex dashboards
* Advanced filtering
* Custom query builders
* Cross-form analytics
* Advanced statistical analysis
* Custom report generation

These may be considered in future versions.

### Search and Filtering

Advanced response filtering is not part of the initial V1 response module.

The initial implementation will prioritize:

* Pagination
* Response viewing
* CSV export
* Basic statistics

Filtering can be introduced later if actual usage demonstrates the need.

### Response Ownership Model

Responses belong to a form rather than directly belonging to a creator.

Conceptually:

```text id="8m5v6q"
User
 │
 └── Forms
      │
      └── Form
           │
           └── Responses
```

Authorization is therefore determined through form ownership.

### Published Form Immutability

Because published forms cannot be modified, the field definitions referenced by stored responses remain stable.

This allows the Responses Dashboard to resolve:

```text id="z3y7hd"
field_abc123
      ↓
Published Form Definition
      ↓
"What is your name?"
      ↓
Stored Answer
      ↓
"Sumeet"
```

No question text needs to be duplicated inside every response document.

### V1 Response Feature Scope

| Feature                        | V1          |
| ------------------------------ | ----------- |
| Response count                 | Yes         |
| Response list                  | Yes         |
| Individual response            | Yes         |
| Pagination                     | Yes         |
| Owner authorization            | Yes         |
| Individual response deletion   | Yes         |
| Delete all responses           | No          |
| CSV export                     | Yes         |
| Basic statistics               | Yes         |
| Response-over-time information | Yes, simple |
| Choice distribution            | Yes         |
| Checkbox distribution          | Yes         |
| Advanced filtering             | No          |
| Advanced analytics             | No          |
| Google Sheets integration      | V2          |

### Design Principle

> **V1 should make collected responses easy to inspect, manage, and export without attempting to become a full analytics platform.**

## 17 — Form Builder Persistence

### Decision

FormFlow V1 will use **explicit draft saving** rather than autosave.

The creator must explicitly save changes using a **Save Draft** action.

This keeps V1 predictable and avoids unnecessary complexity around debouncing, asynchronous state synchronization, and autosave failure handling.

### Draft Creation

When the creator selects:

```text id="k9z8bc"
Create Form
    ↓
Start from Scratch / Template
```

the backend creates a draft form and returns its `formId`.

Conceptually:

```text id="a3w5yu"
Create Draft
     ↓
Backend creates Form
     ↓
Return formId
     ↓
Open Form Builder
```

The draft therefore has a stable identity from the beginning.

### Local Editing

After the builder opens, changes are initially maintained in frontend state.

Examples:

* Changing title
* Changing description
* Adding fields
* Editing fields
* Reordering fields
* Duplicating fields
* Deleting fields
* Changing field configuration

These changes do not immediately update MongoDB.

### Save Draft

The creator explicitly selects:

```text id="y7k3qv"
[ Save Draft ]
```

The frontend sends the current draft state to the backend.

Conceptually:

```text id="r2f9xb"
Local Builder State
       ↓
Save Draft
       ↓
Backend Validation
       ↓
Update MongoDB
       ↓
✓ Draft Saved
```

The exact API structure will be finalized during architecture.

### Save Status

The builder should clearly indicate whether the current state has been saved.

Examples:

```text id="m8w4zs"
✓ Saved
```

or:

```text id="k3q6fn"
● Unsaved changes
```

The UI must not imply that changes are persisted when the save operation has failed.

### Save Failure

If saving fails because of a network or server error:

```text id="f1n9cz"
⚠ Changes couldn't be saved

[Retry]
```

The current frontend state should remain intact so that the user can retry without losing their work.

### Unsaved Changes

If the creator attempts to leave the builder while unsaved changes exist, the application should warn them.

Example:

```text id="d7x2vm"
You have unsaved changes.

Leave without saving?

[Stay] [Leave]
```

The exact browser/navigation behavior will be finalized during implementation.

### No Autosave in V1

The following are intentionally not implemented in V1:

* Automatic saving on every change
* Debounced autosave
* Background draft synchronization
* Real-time collaborative editing
* Complex conflict resolution

These may be considered in a future version.

---

## 18 — Publishing Requires the Latest Saved State

### Decision

A form can only be published from its **latest successfully saved state**.

The system must not publish an older database version while newer unsaved changes exist in the frontend.

### Publishing Flow

Conceptually:

```text id="v3f8ak"
[ Publish Form ]
       ↓
Check for unsaved changes
       ↓
If unsaved:
       ↓
Prompt creator to save
       ↓
Save Draft
       ↓
Validate form
       ↓
Publish
```

If the creator has no unsaved changes:

```text id="x7n4hs"
[ Publish Form ]
       ↓
Validate form
       ↓
Publish
```

### Publishing Validation

Before publishing, the backend should validate that the form is publishable.

Examples of possible requirements:

* Form has a valid title
* Form definition is structurally valid
* Fields have valid configurations
* Choice fields contain valid options
* Required metadata is present

The exact publication requirements will be finalized during the requirements/architecture phase.

### State Transition

Successful publication changes:

```text id="z2s4wy"
DRAFT → PUBLISHED
```

After this transition, the form becomes immutable according to the Form Lifecycle rules.

### Design Principle

> **Save creates the persisted draft state; Publish freezes that saved state into an immutable published form.**

## 19 — Form Builder Interaction

### Decision

FormFlow V1 will use a **form-like visual builder** rather than a configuration-only editor.

The creator should be able to construct the form while seeing a representation that closely resembles what respondents will eventually see.

The builder will support:

* Adding fields
* Editing fields
* Configuring fields
* Reordering fields
* Duplicating fields
* Deleting fields
* Required-field configuration
* Explicit draft saving
* Preview mode
* Publishing

### Builder Layout

A newly created draft starts with:

```text id="s4k7vc"
Form Title
Form Description

No questions yet

[ + Add Field ]

[ Save Draft ]
```

Title and description belong to the form itself and are not treated as fields.

### Add Field

Selecting:

```text id="l8y2km"
+ Add Field
```

opens the V1 field selector:

```text id="z1q5wu"
Basic
────────────
Short Answer
Paragraph
Number
Email
Date

Choice
────────────
Multiple Choice
Checkboxes
Dropdown
```

Selecting a type creates a new field in the builder.

### Default Field State

New fields receive sensible defaults.

Example:

```text id="9q2d4f"
Question:
Untitled question

Required:
Off
```

Choice fields begin with a small default set of options.

The exact default option count can be finalized during implementation.

### Field Editing

The creator can edit the question directly within the builder.

Changes update the local frontend state.

They are not persisted to MongoDB until the creator selects:

```text id="q0n9ml"
Save Draft
```

### Required Fields

Every V1 field supports:

```text id="w7f4tq"
Required: ON / OFF
```

The default value is `OFF`.

The backend will enforce the required-field rule when responses are submitted.

### Choice Field Configuration

The following fields support configurable options:

* Multiple Choice
* Checkboxes
* Dropdown

The creator can:

* Add options
* Edit options
* Remove options

Example:

```text id="x8j4yb"
What is your preferred language?

○ JavaScript
○ Java
○ Python

+ Add option
```

Choice fields must satisfy appropriate validation requirements before publication.

### Field Reordering

The creator can reorder fields using drag-and-drop.

Example:

```text id="v4q8zn"
1. Name
2. Email
3. Age
```

After moving Age:

```text id="e3t7ps"
1. Name
2. Age
3. Email
```

The new order is initially maintained in frontend state and persisted when the creator saves the draft.

The backend will maintain an explicit field ordering mechanism.

### Field Duplication

Each field supports duplication.

When a field is duplicated:

* Its configuration is copied
* Its options are copied where applicable
* A new unique field ID is generated
* The duplicated field receives its own identity

A duplicated field must never reuse the original field ID because response data references fields through stable IDs.

### Field Deletion

The creator can delete fields while the form is still a draft.

Deletion should require explicit confirmation where appropriate.

Example:

```text id="q3m8vx"
Delete this field?

[Cancel] [Delete]
```

After deletion, the change remains local until the creator saves the draft.

Published forms cannot have fields deleted because published forms are immutable.

### Field-Specific Configuration

The builder should expose only configuration relevant to the selected field type.

Examples:

```text id="r1n5wx"
Short Answer
→ Question
→ Required

Number
→ Question
→ Required

Multiple Choice
→ Question
→ Options
→ Required

Checkboxes
→ Question
→ Options
→ Required

Dropdown
→ Question
→ Options
→ Required
```

Additional configuration such as minimum/maximum values, character limits, placeholders, and similar advanced settings is outside the initial V1 field configuration unless later required.

### Builder Presentation

The builder should resemble the final respondent experience.

Example:

```text id="a2m6fk"
┌───────────────────────────────────────────┐
│ College Event Registration                │
│ Register for our annual event.            │
│                                           │
│ What is your name?                        │
│ [____________________________]            │
│                                           │
│ Which year are you in?                    │
│ [ Select ▼ ]                              │
│                                           │
│ Which skills do you have?                 │
│ ☐ JavaScript                              │
│ ☐ Java                                    │
│ ☐ Python                                  │
└───────────────────────────────────────────┘
```

Editing controls remain available to the creator around each field.

### Preview Mode

The builder will provide a separate Preview mode.

Conceptually:

```text id="g9s2yd"
[ Edit ] [ Preview ] [ Save Draft ] [ Publish ]
```

Preview mode represents the form as an anonymous respondent would experience it.

Creator-only editing controls are hidden in Preview mode.

Preview mode does not create a response and does not publish the form.

### Builder Flow

```text id="m7w4xq"
Create Draft
     ↓
Open Builder
     ↓
+ Add Field
     ↓
Select Field Type
     ↓
Configure Field
     ↓
Add / Edit / Duplicate / Delete / Reorder
     ↓
Save Draft
     ↓
Preview
     ↓
Publish
```

### Design Principle

> **The builder should feel like constructing the final form, not configuring an abstract database object.**

This keeps the creator's mental model close to the respondent experience while still exposing the controls required to construct a dynamic form.

## 20 — Form Templates

### Decision

FormFlow V1 will provide a small set of predefined system templates to help creators start forms quickly.

Templates are a **creation convenience**, not a separate form architecture.

A selected template generates a normal draft form that can then be edited, saved, previewed, and published like any other form.

### V1 Templates

The initial template set will contain:

1. Event Registration
2. Customer Feedback
3. Job Application
4. Contact Form
5. Survey
6. Registration Form

The exact questions, fields, options, and copy for each template will be finalized during implementation/design.

### Template Selection Flow

```text id="8f1z6q"
Create Form
      ↓
Use a Template
      ↓
Template Gallery
      ↓
Select Template
      ↓
Create Draft
      ↓
Populate Template Configuration
      ↓
Open Form Builder
```

Selecting a template does not publish the form.

### Template Preview

Each template should provide a preview or representative view before selection.

The preview allows the creator to understand the template's initial structure before creating their draft.

### Template Customization

Once a template is selected, the resulting form is completely editable while it remains a draft.

The creator can:

* Change title
* Change description
* Edit questions
* Add fields
* Delete fields
* Reorder fields
* Duplicate fields
* Modify options
* Change required status
* Add additional fields

After customization, the form behaves exactly like a form created from scratch.

### Template Independence

A template-generated form is independent from the original system template.

Future changes to a system template must not modify forms that were previously created from it.

Conceptually:

```text id="m6w2r8"
System Template
      ↓
Initial Form Configuration
      ↓
User's Draft
      ↓
Independent Form
```

### Template Architecture

Templates are system-level resources.

They do not require a separate runtime form type.

The application effectively performs:

```text id="c8n4vy"
Template
   ↓
Generate Initial Form Definition
   ↓
Normal Draft Form
```

After creation, the application can treat the form exactly like any other draft.

### Template Ownership

System templates are not owned by individual users.

User-created forms belong to their respective creators.

A user cannot modify the underlying system template through the form builder.

### User-Created Templates

User-created/custom templates are **out of scope for V1**.

Features such as:

* My Templates
* Save Form as Template
* Edit Template
* Delete Template
* Share Template

may be considered in a future version.

### Quiz Templates

Quiz functionality is explicitly excluded from V1.

Although a quiz could initially appear to be just another template, supporting real quiz behavior would require additional product capabilities such as:

* Correct answers
* Points
* Score calculation
* Results
* Potential answer explanations

These are considered separate functionality rather than simple template configuration.

### Creation Architecture

Both creation paths converge into the same draft system:

```text id="v0z4xy"
                    ┌── Start from Scratch
Create Form ────────┤
                    └── Use Template
                           │
                           ▼
                       Draft Form
                           │
                           ▼
                      Form Builder
                           │
                           ▼
                       Save Draft
                           │
                           ▼
                        Publish
```

### Design Principle

> **Templates provide a starting point, not a different kind of form.**

## 21 — Form Sharing and Public URLs

### Decision

Published forms will have a stable public URL that can be shared with anyone.

The public URL will use a dedicated random `publicId` rather than exposing the MongoDB document `_id`.

Example:

```text
https://formflow.com/f/8Kx92LmQ
```

### Public ID

Each published form will have:

* Internal MongoDB `_id`
* Public `publicId`

The two identifiers serve different purposes.

```text id="r3v8kx"
Internal:
_id = MongoDB identifier

Public:
publicId = random public identifier
```

The public identifier should be sufficiently random to make practical enumeration difficult.

The public ID is not an authorization mechanism. Published forms are intentionally public.

### Public URL

The public form URL will follow:

```text
/f/:publicId
```

Example:

```text
https://formflow.com/f/8Kx92LmQ
```

Custom slugs are not required for V1.

### Why Not Use MongoDB `_id`

MongoDB's internal identifier should remain an implementation-level identifier.

Using a separate public identifier:

* Keeps internal and external identifiers conceptually separate
* Avoids exposing database-specific identifiers in public URLs
* Gives the public URL its own stable identity
* Allows the internal database representation to change independently in the future

### Why Not Use Form Titles as URLs

V1 will not use title-based slugs such as:

```text
/f/college-event-registration
```

Titles are editable during the draft stage and may not be unique across users.

Managing slug uniqueness, title changes, and slug conflicts would add unnecessary complexity.

A random public identifier provides a stable URL without requiring slug management.

### Sharing

After successful publication, the creator should receive the public link.

Example:

```text
Form Published Successfully

Your form is now live.

https://formflow.com/f/8Kx92LmQ

[ Copy Link ]
[ Open Form ]
```

The public link should also remain available from the form management interface.

Example:

```text
My Forms

College Event Registration
Published

[ Open ] [ Responses ] [ Copy Link ]
```

### Form Lifecycle and Public URLs

The public URL remains stable throughout the form's lifetime.

#### Draft

A draft does not have publicly usable submission access.

```text
Draft
→ No public response access
```

#### Published

The public URL is active.

```text
Published
→ Public form available
→ Responses may be accepted
```

#### Closed

The same public URL remains valid.

```text
Closed
→ Same URL
→ Form can be viewed
→ Responses are disabled
```

The creator does not need to create a new link when temporarily closing a form.

#### Deleted

If a form is permanently deleted, its public URL no longer resolves to an available form.

The user should see a generic unavailable/not-found state.

### Scheduled Forms

Scheduled forms use the same stable public URL.

The URL does not change when the response window opens or closes.

Conceptually:

```text
Before Start
    ↓
Same URL
    ↓
Not accepting responses

During Window
    ↓
Same URL
    ↓
Accepting responses

After End
    ↓
Same URL
    ↓
Not accepting responses
```

### Public ID Stability

The public ID remains unchanged for the lifetime of the form.

V1 will not provide a "Regenerate Share Link" feature.

This avoids complications involving:

* Previously shared links
* QR codes
* External references
* Cached links
* Previously distributed URLs

### V1 Sharing Features

| Feature                  | V1  |
| ------------------------ | --- |
| Public form URL          | Yes |
| Random public ID         | Yes |
| Stable URL               | Yes |
| Copy Link                | Yes |
| Open Form                | Yes |
| Custom URL slug          | No  |
| Regenerate URL           | No  |
| QR Code                  | No  |
| Custom domains           | No  |
| Advanced social previews | No  |

### Future Possibilities

The following may be considered for future versions:

* QR code generation
* Custom slugs
* Regenerating public links
* Social sharing previews
* Custom domains

### Design Principle

> **The public URL should be simple, stable, shareable, and independent of the form's internal database identity.**

## 22 — Profile and Account Settings

### Decision

FormFlow V1 will provide a minimal profile and account settings area.

The creator can:

* View name
* View email
* Change name
* Change password
* Delete account
* Logout

### Email

Email will be read-only in V1.

Email changes are excluded because FormFlow does not implement email verification in V1.

Email-change functionality may be introduced together with email verification in a future version.

### Change Password

Authenticated users can change their password.

The flow will require:

* Current password
* New password
* Confirm new password

The backend will verify the current password and hash the new password using Argon2.

After a successful password change, the current session should be invalidated and the user should log in again.

### Account Deletion

Account deletion is permanent and destructive.

The creator must explicitly confirm the operation.

A password confirmation should be required before permanent deletion.

Conceptually:

```text
Delete Account
      ↓
Warning
      ↓
Confirm
      ↓
Password Confirmation
      ↓
Delete Account Data
      ↓
Destroy Session
      ↓
Landing Page
```

### Data Deletion

Deleting an account will permanently delete:

* User account
* User's forms
* Responses belonging to those forms

The exact database deletion mechanism will be finalized during architecture.

### Public Forms After Account Deletion

All forms owned by the deleted account become unavailable.

Their public URLs no longer resolve to an available form.

### Logout

Logout remains a simple authenticated operation:

```text
POST /api/auth/logout
```

The session is destroyed/cleared and the user is returned to the landing page.

---

## 23 — Form Management

### Decision

The My Forms section will provide state-appropriate actions for each form.

### Draft Actions

A draft may support:

* Edit
* Delete
* Publish

### Published Actions

A published form may support:

* Open
* View Responses
* Copy Link
* Close

Published forms cannot be edited.

### Closed Actions

A closed form may support:

* Open
* View Responses
* Reopen
* Permanently Delete

### Deletion Rule

An actively published form cannot be permanently deleted directly.

The creator must first close it.

Conceptually:

```text
PUBLISHED
    ↓
CLOSE
    ↓
CLOSED
    ↓
DELETE
```

This provides an additional safeguard against accidentally deleting an active public form.

### Draft Deletion

Deleting a draft requires explicit confirmation.

---

## 24 — Error, Loading, and Empty States

### Decision

Loading, empty, success, and error states are considered part of the product experience rather than implementation afterthoughts.

### Dashboard Loading

Example:

```text
Loading your forms...
```

### Empty Dashboard

Example:

```text
You haven't created any forms yet.

Create your first form to get started.

[ Create Form ]
```

### Empty Responses

Example:

```text
No responses yet.

Share your form to start collecting responses.
```

### Builder Loading

Example:

```text
Loading form...
```

### Save Failure

Example:

```text
Couldn't save your changes.

[ Retry ]
```

### Public Form Not Found

Example:

```text
Form Not Found

This form may have been deleted or the link may be incorrect.
```

### Closed Form

Example:

```text
This form is currently closed
and is not accepting responses.
```

### Scheduled Form

Before start:

```text
This form isn't accepting responses yet.
```

After end:

```text
This form is no longer accepting responses.
```

### Generic Server Error

Production responses should not expose stack traces, database errors, or internal implementation details.

Example:

```text
Something went wrong.

Please try again later.
```

---

## 25 — Authentication and Authorization Boundary

### Decision

Frontend restrictions are treated as user-experience behavior, not as a security boundary.

The backend must independently enforce authentication and authorization.

Protected operations include:

* Editing drafts
* Saving drafts
* Publishing forms
* Closing forms
* Reopening forms
* Deleting forms
* Viewing responses
* Deleting responses
* Exporting responses
* Updating profile information
* Changing passwords
* Deleting accounts

A user must not be able to access or modify another user's resources simply by changing an ID in an API request.

### Design Principle

> Authentication determines who the user is; authorization determines what that user is allowed to do.

---

## 26 — Security Baseline

### Decision

FormFlow V1 will use a practical security baseline without rebuilding the advanced authentication system from SecurePass.

V1 security measures include:

* Argon2 password hashing
* `cookie-session`
* HTTP-only session cookies
* Appropriate `secure` configuration in production
* Appropriate `sameSite` configuration
* Helmet
* CORS configuration
* Request validation
* Backend authorization
* Generic authentication errors
* Server-side form validation
* Server-side response validation
* Environment variables for secrets and configuration

Rate limiting may be applied to appropriate endpoints, especially authentication and potentially public response submission.

### Out of Scope

V1 will not implement:

* MFA
* OAuth
* OTP
* Refresh tokens
* Advanced token revocation
* Account locking
* Password recovery
* Email verification

---

## 27 — Public Form Abuse Protection

### Decision

Public forms are intentionally anonymous, but the application should be designed so abuse protection can be introduced.

V1 will not require CAPTCHA or other intrusive anti-bot mechanisms for normal submissions.

Rate limiting may be applied to public response endpoints where appropriate.

Advanced abuse prevention may be considered in a future version.

---

## 28 — Theme and UI

### Decision

FormFlow V1 will support a simple application theme system:

* Light
* Dark
* System preference

Complex visual customization is outside the initial scope.

Public forms will use FormFlow's consistent visual system in V1.

Per-form custom themes, custom CSS, custom branding, and custom domains are future features.

---

## 29 — Notifications

### Decision

Email notifications are out of scope for V1.

The creator will access responses through the dashboard.

Future versions may introduce:

* New-response notifications
* Notification preferences
* Email templates
* Other notification channels

---

## 30 — Response Confirmation

### Decision

After successful submission, anonymous respondents will see a simple confirmation state.

Example:

```text
✓ Response submitted successfully

Thank you for your response.
```

V1 will not provide:

* Email receipts
* Respondent accounts
* Edit-response links
* Response tracking

These may be considered in future versions.

---

## 31 — Form Customization

### Decision

FormFlow V1 will focus on functionality rather than becoming a full form-design platform.

The following are outside V1:

* Custom fonts
* Custom CSS
* Per-form themes
* Background images
* Custom branding
* Custom domains
* Logo builder

The core V1 objective is:

> Allow a user to create, publish, share, collect, inspect, and manage dynamic form responses reliably.

---

## 32 — V1 Scope Freeze

### Core V1 Features

#### Authentication

* Registration
* Login
* Cookie-based session authentication
* Logout
* Change password
* Account deletion

#### Dashboard

* Dashboard
* My Forms
* Form management
* Profile

#### Form Creation

* Start from scratch
* Six system templates
* Dynamic form builder
* Eight field types
* Add/edit/delete/reorder/duplicate fields
* Required fields
* Explicit Save Draft
* Preview mode

#### Form Lifecycle

* Draft
* Published
* Closed
* Permanent deletion
* Immutable published forms
* Duplicate published form into a new draft
* Scheduled response availability

#### Sharing

* Stable public URL
* Random public ID
* Copy Link
* Open Form

#### Responses

* Anonymous submissions
* Backend validation
* Dynamic MongoDB response documents
* Response list
* Individual response viewing
* Pagination
* Individual response deletion
* CSV export
* Basic statistics

### Explicitly V2 / Later

* Google Sheets integration
* Image upload
* File upload
* QR codes
* OAuth
* Email verification
* Password recovery
* MFA
* Notifications
* User-created templates
* Quiz functionality
* Advanced analytics
* Advanced filtering
* Custom form themes
* Custom domains
* One-response-per-person
* Collaborative editing
* Advanced autosave
* Advanced anti-bot mechanisms

---

## 33 — Complete Product Flow

The complete FormFlow V1 experience is:

```text
                    FormFlow
                       │
          ┌────────────┴────────────┐
          │                         │
      Anonymous                  Account
          │                         │
     Public Form              Dashboard
          │                         │
       Submit                 My Forms
          │                         │
       Response        ┌────────────┼────────────┐
          │            │            │            │
          │         Create       Manage       Profile
          │            │            │
          │       ┌────┴────┐      │
          │       │         │      │
          │    Scratch   Template  │
          │       │         │      │
          │       └────┬────┘      │
          │            │           │
          │          Draft         │
          │            │           │
          │       Build/Edit       │
          │            │           │
          │        Save Draft      │
          │            │           │
          │         Preview       │
          │            │           │
          │         Publish       │
          │            │           │
          └──────→ Public URL ←────┘
                       │
                 Collect Responses
                       │
                 Response Dashboard
                       │
             ┌─────────┼─────────┐
             │         │         │
           View      Analyze    Export
             │         │         │
             └─────────┴─────────┘
```

### Form Lifecycle

```text
CREATE
  ↓
DRAFT
  ↓
BUILD
  ↓
SAVE
  ↓
PREVIEW
  ↓
PUBLISH
  ↓
SHARE
  ↓
COLLECT
  ↓
MANAGE RESPONSES
  ↓
CLOSE
  ↓
DELETE
```

---

## 34 — Product Design Principles

The following principles emerged throughout the discussion and will guide the next phases.

### Simplicity Before Feature Count

V1 should solve the core form-creation and response-collection workflow without trying to reproduce every Google Forms feature.

### Backend as the Source of Truth

Frontend validation and restrictions improve UX, but the backend is responsible for security, authorization, form validation, and response validation.

### Published Forms Are Immutable

Once published, a form represents a stable definition.

Changes require creating a new draft through duplication.

### Dynamic Data Should Remain Structured

Form responses are dynamic, but they should still be stored in structured MongoDB documents rather than arbitrary JSON files.

### Templates Are Convenience

Templates generate normal drafts and do not introduce a separate form architecture.

### Anonymous by Default

Respondents do not need FormFlow accounts to submit public forms.

### Explicit V1 Boundaries

Features that introduce significant complexity—file storage, OAuth, Google Sheets, advanced analytics, collaboration, and sophisticated anti-abuse systems—are intentionally deferred.

### Learning Objective

FormFlow is designed not only to produce a working application but to provide practical experience with:

* Full-stack architecture
* Dynamic data modeling
* REST API design
* Authentication
* Authorization
* Validation
* State management
* MongoDB
* React
* Backend security
* External integrations in future versions
