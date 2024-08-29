# SSO Application

## Description
This is a single sign-on application for authenticating users as they access other peripheral apps (PAs). It simulates an authentication/authorization system that could be used in a clinic. The app allows creating users (Doctors, Patients, Groups) and for other PAs to retrieve and update this information. 

## Setup and configuration
This is an app based on the MongoDB, Express, React and Node.js (MERN) framework. Basically, Javascript is used all across the backend and the frontend. 

### Prerequisites
* Node.js

### Getting started
* Fork the repository
* Install backend packages and dependencies
```
    npm install
```
* Move to the client folder with `cd client` and install the frontend dependencies
```
    npm install
```
 _Note: Depending on when you fork this repo, some packages might be outdated and the above installation may not complete. Try to read through the errors and figure out which packages failed and install them individually i.e. `npm install <package>`_

* Creat your `.env` file at root and specify the following variables

<div align="center"> 

|Key|Value|
|--------|--------|
|REACT_APP_DB|Database URI|
|CRYPT_SECRET|string used for signing jwt tokens|
|PORT|Port for backend server|

</div> 

* Run the application with `npm run dev`. This command starts both the backend and frontend servers. To test the backend alone, you can run `npm start` while at root.

Detailed api documentation can be found here.

## Project status
All requisite endpoints in the server have been implemented. Current work is on improving the UI.
