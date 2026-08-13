# API Documentation for SSO

Unless otherwise specified, endpoints are prefixed with `/api`.

## Authentication

### POST /api/registration

#### Definition

Register a new user account and send an account activation email.

#### Authentication

Not required.

#### Request Body

```json
{
    "username": "<String>",
    "email": "<String>",
    "password": "<String>"
}
```

#### Response

* **Success**: HTTP 201 Created
* **Bad Request**: HTTP 400 Bad Request
* **Conflict**: HTTP 409 Conflict
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

```json
{
    "message": "The activation email has been sent to <email>, please click the activation link within 24 hours."
}
```

#### Notes

* `username`, `email`, and `password` are required.
* A unique activation token is generated.
* The activation token expires after 24 hours.
* The account is initially inactive.
* An activation email is sent to the supplied email address.
* The user must activate the account before logging in.

<br />

### GET /api/activation/:activationToken

#### Definition

Activate a newly registered user account using the activation token sent by email.

#### Authentication

Not required.

#### URL Parameters

| Parameter         | Type   | Description                            |
| ----------------- | ------ | -------------------------------------- |
| `activationToken` | String | Token supplied in the activation email |

#### Response

* **Success**: HTTP 200 OK
* **Invalid Token**: HTTP 404 Not Found
* **Expired Token**: HTTP 403 Forbidden
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

```json
{
    "message": "Account activation successful! Redirecting to login..."
}
```

#### Notes

* Activation tokens expire after 24 hours.
* An expired account is deleted and the user must register again.
* After successful activation, the activation token is removed.

<br />

### POST /api/login

#### Definition

Authenticate a user and establish an authenticated session using an HTTP-only JWT cookie.

#### Authentication

Not required.

#### Request Body

```json
{
    "email": "<String>",
    "password": "<String>"
}
```

#### Response

* **Success**: HTTP 200 OK
* **Bad Request**: HTTP 400 Bad Request
* **Not Found**: HTTP 404 Not Found
* **Forbidden**: HTTP 403 Forbidden
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

For a fully registered user:

```json
{
    "message": "Success!",
    "username": "<String>",
    "userType": "<String>"
}
```

For an activated user who has not completed their profile:

```json
{
    "message": "User not registered!",
    "username": "<String>",
    "userType": "<String>"
}
```

#### Notes

* A successful login sets an HTTP-only `jwt` cookie.
* JWTs expire after 24 hours.
* Users must activate their account before logging in.
* Users who have not completed their profile receive a JWT signed with the registration secret.
* Fully registered users receive a JWT signed with the user secret.

<br />

### GET /api/logout

#### Definition

Log out the currently authenticated user.

#### Authentication

Required - Authenticated User.

#### Request

Authentication is provided through the `jwt` cookie.

#### Response

* **Success**: HTTP 200 OK
* **Unauthorized**: HTTP 401 Unauthorized
* **Forbidden**: HTTP 403 Forbidden

#### Success Response

```json
{
    "message": "Success!"
}
```

#### Notes

* The `jwt` authentication cookie is cleared.
* The endpoint does not require a request body.

<br />

### GET /api/authentication

#### Definition

Check whether the current request is associated with an authenticated user.

#### Authentication

Required - Authenticated User.

#### Request

Authentication is provided through the `jwt` cookie.

#### Response

* **Success**: HTTP 200 OK
* **Unauthorized**: HTTP 401 Unauthorized
* **Forbidden**: HTTP 403 Forbidden

#### Success Response

```json
{
    "username": "<String>",
    "userType": "<String>"
}
```

#### Notes

* HTTP 401 is returned when no valid authentication cookie is available.
* HTTP 403 may be returned when an authentication cookie is present but cannot be validated.
* Despite being used to check authentication status, this endpoint is protected by the authentication middleware.

<br />

### POST /api/reauthentication

#### Definition

Verify the authenticated user's password before performing an operation requiring password confirmation.

#### Authentication

Required - Authenticated User.

#### Request Body

```json
{
    "password": "<String>"
}
```

#### Response

* **Success**: HTTP 200 OK
* **Unauthorized**: HTTP 401 Unauthorized
* **Not Found**: HTTP 404 Not Found
* **Server Error**: HTTP 500 Internal Server Error

#### Notes

* The supplied password is compared against the authenticated user's stored password.
* HTTP 401 is returned when the password is incorrect.
* No user information is returned on successful verification.

<br />

## Password Management

### POST /api/pwdreset_link

#### Definition

Request a password-reset link for an existing user.

#### Authentication

Not required.

#### Request Body

```json
{
    "email": "<String>"
}
```

#### Response

* **Success**: HTTP 200 OK
* **Bad Request**: HTTP 400 Bad Request
* **Not Found**: HTTP 404 Not Found
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

```json
{
    "message": "The link has been sent to your email"
}
```

#### Notes

* The reset token is sent to the user's email.
* Reset tokens expire after one hour.
* The reset token is invalidated after the password is successfully changed.

<br />

### PATCH /api/reset_pwd

#### Definition

Reset a user's password using a valid password-reset token.

#### Authentication

Not required.

#### Request Body

```json
{
    "resetToken": "<String>",
    "newPwd": "<String>"
}
```

#### Response

* **Success**: HTTP 200 OK
* **Bad Request**: HTTP 400 Bad Request
* **Not Found**: HTTP 404 Not Found
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

```json
{
    "message": "Your password has been reset"
}
```

#### Notes

* Both `resetToken` and `newPwd` are required.
* The reset token must not be expired.
* Reset tokens expire after one hour.
* The reset token is removed after a successful password reset.

<br />

### PATCH /api/change_pwd

#### Definition

Change the password of the currently authenticated user.

#### Authentication

Required - Authenticated User.

#### Request Body

```json
{
    "oldPwd": "<String>",
    "newPwd": "<String>"
}
```

#### Response

* **Success**: HTTP 200 OK
* **Bad Request**: HTTP 400 Bad Request
* **Not Found**: HTTP 404 Not Found
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

```json
{
    "message": "Password updated successfully"
}
```

#### Notes

* The existing password must be supplied.
* The existing password is verified before the new password is saved.
* The endpoint uses the authenticated user's ID from the JWT.

<br />

## User Profiles

### PATCH /api/create_profile

#### Definition

Create the profile associated with an authenticated user.

#### Authentication

Required - Authenticated User.

#### Request Body

Common fields:

```json
{
    "firstName": "<String>",
    "lastName": "<String>",
    "address_unit": "<String>",
    "address_street": "<String>",
    "address_postal": "<String>",
    "address_country": "<String>",
    "phone": "<String>",
    "userType": "<Patient|Doctor|Group>"
}
```

Patient-specific fields:

```json
{
    "healthInsurance_number": "<String>",
    "healthInsurance_expiryMonth": "<String>",
    "healthInsurance_expiryYear": "<String>",
    "alternatePhone": "<String>"
}
```

Doctor-specific fields:

```json
{
    "licenseNumber": "<String>",
    "faxNumber": "<String>"
}
```

Group-specific fields:

```json
{
    "organizationName": "<String>",
    "faxNumber": "<String>"
}
```

#### Response

* **Success**: HTTP 200 OK
* **Not Found**: HTTP 404 Not Found
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

```json
{
    "message": "Profile created successfully",
    "username": "<String>",
    "userType": "<String>"
}
```

#### Notes

* The profile is associated with the authenticated user.
* `userType` determines which additional profile fields are populated.
* The user's `registered` status is set to `true`.
* A new authenticated JWT is issued after profile creation.
* The profile update triggers the SSO webhook update mechanism.

<br />

### PATCH /api/modify_profile

#### Definition

Modify the profile of the currently authenticated user.

#### Authentication

Required - Authenticated User.

#### Request Body

The request accepts the same profile fields as `/api/create_profile`.

Only fields containing a non-empty value are modified.

#### Response

* **Success**: HTTP 200 OK
* **Not Found**: HTTP 404 Not Found
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

```json
{
    "message": "Profile updated successfully"
}
```

#### Notes

* The user's existing `userType` determines which type-specific fields may be modified.
* Empty string values are ignored.
* The profile update triggers the SSO webhook update mechanism.

<br />

### GET /api/user

#### Definition

Retrieve the complete profile of the currently authenticated user.

#### Authentication

Required - Authenticated User.

#### Response

* **Success**: HTTP 200 OK
* **Not Found**: HTTP 404 Not Found
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

Returns the user's MongoDB document excluding the password field.

```json
{
    "_id": "<User ID>",
    "username": "<String>",
    "email": "<String>",
    "firstName": "<String>",
    "lastName": "<String>",
    "userType": "<String>",
    "...": "..."
}
```

#### Notes

* The password is explicitly excluded from the response.
* The returned fields depend on the user's profile and user type.

<br />

## Application Integration

### POST /api/app_registration

#### Definition

Register an application with the SSO service.

#### Authentication

Required - Authenticated User.

#### Request Body

```json
{
    "appName": "<String>",
    "appType": "<type-1|type-2>",
    "webhookURL": "<String>"
}
```

#### Response

* **Success**: HTTP 200 OK
* **Bad Request**: HTTP 400 Bad Request
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response - Type 1 Application

```json
{
    "message": "App created successfully!",
    "appSecret": "<String>"
}
```

#### Success Response - Type 2 Application

```json
{
    "message": "App created successfully!",
    "token": "<JWT>"
}
```

#### Notes

* `webhookURL` is required for applications with `appType = "type-1"`.
* A cryptographically random application secret is generated during registration.
* Type-1 applications receive the application secret.
* Type-2 applications receive a JWT signed using the application's secret.
* Application secrets should be treated as credentials and stored securely.

<br />

### GET /api/UserInfo

#### Definition

Retrieve information about a specific user.

This endpoint is intended for use by type-2 applications.

#### Authentication

Required - Registered Application.

#### Query Parameters

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `userId`  | String | MongoDB ID of the user to retrieve |

#### Example

```text
GET /api/UserInfo?userId=<User ID>
```

#### Response

* **Success**: HTTP 200 OK
* **Not Found**: HTTP 404 Not Found
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

Returns the requested user's document excluding the password.

```json
{
    "_id": "<User ID>",
    "username": "<String>",
    "email": "<String>",
    "firstName": "<String>",
    "lastName": "<String>",
    "userType": "<String>",
    "...": "..."
}
```

#### Notes

* Authentication is handled by the application authorization middleware.
* The password field is excluded from the response.

<br />

### GET /api/apps

#### Definition

Retrieve the list of applications registered with the SSO service.

#### Authentication

Not required.

#### Response

* **Success**: HTTP 200 OK
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

```json
[
    {
        "_id": "<App ID>",
        "appName": "<String>",
        "webhookURL": "<String>",
        "appType": "<String>"
    }
]
```

#### Notes

* Only `appName`, `webhookURL`, and `appType` are returned.
* Application secrets are not included.
* If no applications are registered, the endpoint returns:

```json
{
    "message": "There are no registered apps"
}
```

* This endpoint currently does not require authentication.

<br />

## Utility Endpoints

### GET /api/

#### Definition

Verify that the SSO API is reachable.

#### Authentication

Not required.

#### Response

* **Success**: HTTP 200 OK

#### Success Response

```text
Welcome to Trakadis lab
```

<br />

## Testing / Development Endpoints

### GET /api/users

#### Definition

Retrieve a list of users.

#### Authentication

Not required.

#### Response

* **Success**: HTTP 200 OK
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

```json
[
    {
        "_id": "<User ID>",
        "username": "<String>",
        "email": "<String>",
        "address": {
            "...": "..."
        }
    }
]
```

#### Notes

* This endpoint is currently exposed without authentication.
* It returns the user's `username`, `email`, and `address`.
* The endpoint is marked in the source code as being intended for testing.
* It should not be considered a production-safe public endpoint because it exposes user information without authentication.

<br />

### DELETE /api/users/:id

#### Definition

Delete a user by ID.

#### Authentication

Required - Authenticated User.

#### URL Parameters

| Parameter | Type   | Description                      |
| --------- | ------ | -------------------------------- |
| `id`      | String | MongoDB ID of the user to delete |

#### Response

* **Success**: HTTP 200 OK
* **Unauthorized**: HTTP 401 Unauthorized
* **Forbidden**: HTTP 403 Forbidden
* **Server Error**: HTTP 500 Internal Server Error

#### Success Response

Returns the deleted user's document.

#### Notes

* This endpoint is explicitly marked as being for testing.
* The authenticated user is not restricted to deleting their own account.
* As currently implemented, any authenticated user may submit another user's ID.
* This endpoint should be removed or protected with appropriate authorization before production use.

<br />

## Authentication Model

The SSO API uses JSON Web Tokens (JWT) stored in an HTTP-only browser cookie.

### Authentication Cookie

```text
jwt=<JWT>
```

The cookie is created after successful login and is used by protected endpoints through `middleware.authorization`.

### Application Authentication

Applications use `middleware.authorizeApp` for endpoints intended to be accessed by registered applications.

Type-2 applications receive a JWT during application registration and use the application credentials to authenticate subsequent requests.

### HTTP Status Codes

| Status | Meaning                                                                |
| ------ | ---------------------------------------------------------------------- |
| `200`  | Request completed successfully                                         |
| `201`  | Resource successfully created                                          |
| `400`  | Invalid request or missing required input                              |
| `401`  | Authentication failed or credentials are invalid                       |
| `403`  | Request is forbidden or an activation/authentication token has expired |
| `404`  | Requested user/resource was not found                                  |
| `409`  | Resource conflicts with an existing resource                           |
| `500`  | Unexpected server-side error                                           |

## Security Considerations

The current implementation should be reviewed before using this API in a production environment.

* Passwords should never be returned by API endpoints.
* Application secrets should never be logged or exposed after creation.
* `/api/users` currently exposes user information without authentication.
* `/api/apps` exposes registered application metadata without authentication.
* `DELETE /api/users/:id` allows an authenticated user to delete an arbitrary user ID.
* Password-reset and activation tokens should be generated, stored, and transmitted securely.
* Production activation and password-reset links should use HTTPS rather than `http://localhost:3000`.
* JWT secrets should be stored in environment variables and rotated appropriately.
* JWT cookies should ideally use `Secure`, `SameSite`, and an appropriate expiration configuration in production.
* Error responses should avoid exposing internal database or implementation details.
