# SSO Application

## Description

A full-stack Single Sign-On (SSO) application designed to authenticate users across peripheral applications (PAs). The project simulates an authentication and authorization service for a clinical environment, supporting **Doctors, Patients, and Groups**.

The SSO provides user registration, account activation, authentication, password management, profile management, and application integration. Registered PAs can authenticate with the SSO and retrieve user information as required.

## Technology Stack

Built using the **MERN stack**:

* **MongoDB** — User and application data storage
* **Express.js** — Backend REST API
* **React** — Frontend
* **Node.js** — Backend runtime
* **JWT** — Authentication and application authorization
* **HTTP-only cookies** — Browser-based user authentication

## Setup and Configuration

### Prerequisites

* Node.js
* MongoDB instance

### Getting Started

1. Fork and clone the repository.

2. Install backend dependencies from the project root:

```bash
npm install
```

3. Install frontend dependencies:

```bash
cd client
npm install
```

> Depending on when the repository is cloned, some dependencies may be outdated or incompatible with the current Node.js version. Review any installation errors and install or update the affected packages as necessary.

4. Create a `.env` file in the project root and configure the required environment variables:

| Key            | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| `REACT_APP_DB` | MongoDB connection URI                                                 |
| `CRYPT_SECRET` | Secret used to sign JWTs for users who have not completed registration |
| `USER_SECRET`  | Secret used to sign JWTs for fully registered users                    |
| `PORT`         | Port used by the backend server                                        |

5. Start the application:

```bash
npm run dev
```

This starts both the backend and frontend development servers.

To run only the backend:

```bash
npm start
```

## API Documentation

Detailed endpoint documentation, including authentication requirements, request fields, responses, and security considerations, is available in the [SSO API documentation](https://github.com/ben12mwaniki/SSO/blob/main/sso-api-doc.md).

## Project Status

The core SSO endpoints have been implemented, including:

* User registration and email activation
* Login and logout
* JWT-based authentication
* Password reset and password changes
* User profile creation and modification
* User authentication and reauthentication
* Peripheral application registration
* Application-level authentication
* User information retrieval for registered applications

Current work is focused on improving the frontend UI.

The API is functional but would benefit from additional security hardening before production use. The API documentation identifies the main areas for improvement, including endpoint authorization, exposed testing endpoints, token handling, and production cookie/security configuration.
