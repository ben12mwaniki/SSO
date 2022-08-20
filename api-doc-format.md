# API Documentation

## HTTP-request-type path-to-endpoint

**Note: include any url or query parameters here**

### Definition:

Explain what this endpoint does.

### Authentication:

Explain whether or not the user needs to be authenticated to access this endpoint + what usertypes are accepted, etc...

### Request Fields:

Show an example of the required fields of the request body (if needed - i.e. POST request).

```
{
    <field-name>: <field-value>,
    ...
}
```

### Response:

- **Success**: HTTP 201 Created
- **Failure**: HTTP 400 Bad Request
- ...

### Response Fields:

```
{
    <field-name>: <field-value>,
        ...
    ]
}
```

### Notes

- note anything else that needs to be known about this endpoint
  ...

<br />

## GET /api/users

### Definition:

Get a list of users registered in this application.

### Authentication:

Required - Admin

### Request Fields:

None

### Response:

- **Success**: HTTP 200 OK

### Response Fields:

```
{
    "users": [
        {
            "_id": <User ID>,
            "username": <String>,
            "email": <String>,
            "createdAt": <Date>,
            "updatedAt": <Date>
        }
        ...
    ]
}
```

### Notes

- Returned users are sorted by their `createdAt` field, from newest to oldest

<br />

<br />

## GET /api/authentication

### Definition:

Check whether there is a user logged in

### Authentication:

Not required

### Request Fields:

cookies.jwt

### Response:

- **Success**: HTTP 200 OK
- **Unauthorized**: HTTP 401 Unauthorized
- **Forbidden** : HTTP 403 Forbidden

### Response Fields:

```
None
```

### Notes

- Unauthorized error (401) returned when no user is logged in
- Forbidden eror (403) returned when cookie present was not signed by the server

<br />

<br />

## GET /api/users

### Definition:

Get a list of users registered in this application.

### Authentication:

Required - Admin

### Request Fields:

None

### Response:

- **Success**: HTTP 200 OK

### Response Fields:

```
{
    "users": [
        {
            "_id": <User ID>,
            "username": <String>,
            "email": <String>,
            "createdAt": <Date>,
            "updatedAt": <Date>
        }
        ...
    ]
}
```

### Notes

- Returned users are sorted by their `createdAt` field, from newest to oldest

<br />
