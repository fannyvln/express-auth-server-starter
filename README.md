# Express Auth Server Starter

**Live Demo**: http://auth-starter.laaksonen.io

A boilerplate for an **Express** API that handles token based user authentication
with [JSON Web Tokens (JWT)](https://jwt.io). Because *React Redux Auth Starter*
is simply an API, we also need a client-side application to enable users to
interact with the API.
[React Redux Auth Starter](https://github.com/laaksonen/react-redux-auth-starter)
is a JavaScript application just for that, and it is designed to work in unison
with *Express Auth Server Starter*.

## Table of Contents
1. [Features](#features)
1. [Requirements](#requirements)
1. [Getting Started](#getting-started)
1. [Application Structure](#application-structure)
1. [Deployment](#deployment)
1. [Contributing](#contributing)
1. [License](#license)

## Features
| **Feature** | **Description** |
| ---------|-----------------|
| [Express](http://expressjs.com) | Development and production server |
| [MongoDB](https://www.mongodb.com) | Database |
| [Mongoose](http://mongoosejs.com) | Object-document mapping (ODM) |
| [Passport](http://passportjs.org/) | Authentication middleware for Node.js |
| [JSON Web Tokens (JWT)](https://jwt.io) | Authentication tokens |
| [jwt-simple](https://www.npmjs.com/package/jwt-simple) | JWT encoding and decoding |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Email |

## Requirements
* [Node.js 6.0+](http://nodejs.org)
* [MongoDB](https://www.mongodb.com) or something like [mLab](https://mlab.com/)
* [SendGrid](https://sendgrid.com/) account

## Getting Started
### Installing and starting the API
```bash
$ git clone https://github.com/laaksonen/express-auth-server-starter.git
$ cd express-auth-server-starter
$ npm install
```
Once express-auth-server-starter is installed, you need to create a `.env` file
in the root folder of the project. `.env` is used to store environment variables
that we wish to keep secret. We are then using
[dotenv](https://github.com/motdotla/dotenv) to load these variables inside our
application. Git has been set to ignore `*./env` files so that
it won't be committed to the repository. The followed variables are required:
```
DB_CONNECTION=YOUR_MONGODB_CONNECTION_HERE
JWT_SECRET=A_SECRET_STRING_HERE
SENDGRID_USER=YOUR_SENDGRID_USERNAME_HERE
SENGRID_PASSWORD=YOUR_SENDGRID_PASSWORD_HERE
```
Once you have `.env` saved you can run `npm start` to start the server.

### Installing and starting the client-side application
If you want to interact with the API in the browser, a client-side application
is needed. [React Redux Auth Starter](https://github.com/laaksonen/react-redux-auth-starter) is a JavaScript
application just for that. In a new terminal tab or window, do the following:
```bash
$ git clone https://github.com/laaksonen/react-redux-auth-starter.git
$ cd react-redux-auth-starter
$ npm install
$ npm start
```
Now you can navigate to http://localhost:3000 in your browser and use the application.
