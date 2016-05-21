# Express Auth Server Starter

[Express Auth Server Starter](https://github.com/laaksonen/express-auth-server-starter)
**+**
[React Redux Auth Starter](https://github.com/laaksonen/react-redux-auth-starter)
**===** http://auth-starter.laaksonen.io **(Live Demo)**

A boilerplate for an **Express** API server that handles **token-based user
authentication** with [JSON Web Tokens (JWT)](https://jwt.io). Because *React
Redux Auth Starter* is simply an API, a client-side application is also required
for effective use.
[React Redux Auth Starter](https://github.com/laaksonen/react-redux-auth-starter)
is a React & Redux application built just for that purpose, and it is designed
to work in unison with *Express Auth Server Starter*.

This boilerplate stores data in a mongodb database, provides email dispatching,
unit testing, linting, and more. The goal of this project is to implement
token-based user authentication and to provide a **robust** and **scalable**
structure on which to build on.

## Table of Contents
1. [Requirements](#requirements)
1. [Getting Started](#getting-started)
1. [Technologies Used](#technologies-used)
1. [Features Demonstrated](#features-demonstrated)
1. [Application Structure](#application-structure)
1. [Deployment](#deployment)
1. [Contributing](#contributing)
1. [License](#license)

## Requirements
* [Node.js 6.0+](http://nodejs.org)
* [MongoDB](https://www.mongodb.com) or something like [mLab](https://mlab.com/)
* [SendGrid](https://sendgrid.com/) account

## Getting Started
### Installing and Running the API Server
```bash
$ git clone https://github.com/laaksonen/express-auth-server-starter.git
$ cd express-auth-server-starter
$ npm install
```
Once *express-auth-server-starter* is installed, you will need to create a `.env`
file in the project root folder. The `.env` files is used to store environment
variables that we wish to keep secret. We are then using
[dotenv](https://github.com/motdotla/dotenv) to load these variables inside the
application. Git has been set to ignore `*./env` files so that
it won't be committed to the repository. You need will to include the following
variables:
```
DB_CONNECTION=YOUR_MONGODB_CONNECTION_HERE
JWT_SECRET=A_SECRET_STRING_HERE
SENDGRID_USER=YOUR_SENDGRID_USERNAME_HERE
SENGRID_PASSWORD=YOUR_SENDGRID_PASSWORD_HERE
```
Once `.env` is saved you can run `npm start` to start the server.

### Installing and Running the Client-Side Application
If you want to interact with the API in the browser, a client-side application
is needed. [React Redux Auth Starter](https://github.com/laaksonen/react-redux-auth-starter) is a client-side
React & Redux application built just for that purpose.
To get it installed and running you have two options. The first option is to
initialize and update the git submodule which comes included with the API and
is located at the client directory. To do that, open up a new terminal tab or
window and navigate to the root of the project. Then simply run:
```bash
git submodule ini
git submodule update
cd client
npm install
npm start
```
You can now navigate to http://localhost:3000 in your browser and you should find
the application running.

The second option is to install the client-side application separately from
the API. If you wish to do that, open up a new terminal tab or window and run
the following commands:
```bash
$ git clone https://github.com/laaksonen/react-redux-auth-starter.git
$ cd react-redux-auth-starter
$ npm install
$ npm start
```
You can now navigate to http://localhost:3000 in your browser and you should find
the application running.

## Technologies Used
| **Technology** | **Description** |
| ---------|-----------------|
| [Express](http://expressjs.com) | Production and development server |
| [MongoDB](https://www.mongodb.com) | Database / Persistence layer |
| [Mongoose](http://mongoosejs.com) | Object-document mapping (ODM) |
| [Passport](http://passportjs.org/) | Authentication middleware for Node.js |
| [JSON Web Tokens (JWT)](https://jwt.io) | Authentication tokens |
| [jwt-simple](https://www.npmjs.com/package/jwt-simple) | JWT encoding and decoding |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Sending email |
| [Mocha](https://mochajs.org) | Unit testing |
| [ESLint](http://eslint.org) | Linting |

## Features Demonstrated
### Decoupled Client/API Architecture
This project is designed to allow for separate deployments of the client-side
JavaScript application and the server-side API. This decoupling makes the
application more scalable, and it also makes it easier to later expand to
different platforms, such as native mobile applications.

### Token-Based User Authentication
Instead of using traditional cookie-based authentication, this application
authenticates users using [JSON Web Tokens (JWT's)](https://jwt.io/). This means
that, since a token is a self-contained entity that conveys all of the user
information, there is no longer a need for a session store. This decoupling
makes the application more scalable, and it also makes it easier to later expand
to different platforms, such as native mobile applications.

### Asynchronous Server-Side Form Validation
Aside from basic client-side form validation, asynchronous server-side
validation is performed when the email field is blurred in the sign up form.
When the email field is blurred, a request is sent to the server to check if
the email in question is available, or if it is already in use.

### Account Management
Users are able to update their name, email, and password; restore a forgotten
password; and delete their account. New users are sent a verification email
with a token which they can then use to verify their account.

### Posts by Users
Users are able to create posts which are then stored in a database. When a user
is logged in, all posts (by all users) are displayed on the homepage with the
most recent post first. Users are able to edit and delete their own posts.

## Application Structure
The aim is to mostly group functionality by feature rather than by file type.
This is very useful when building scalable applications. All new features are
grouped together in the modules folder.

## Application Structure
I prefer to keep all the routes in one place to get a good overview of the
application. The different routes are then given controller functions which are
grouped by functionality in the controllers directory.
```
.
├── client (git submodule)    # Client-side react & redux application
├── controllers               # Application logic
├── models                    # Mongoose models
├── routes                    # API routes
├── services                  # External services
│   └──passport.js            # Passport configuration
├── utils                     # Utility functions
└── index.js                  # Express server
```

## Deployment
### Hosting the API Server
When choosing a hosting option you will first need to decide if you want to go
the managed or the self-managed route. When using managed hosting such as
[Heroku](https://heroku.com), someone else takes care of managing the server for
you. In heroku's case, all you need to do is use git to push the application to
heroku and they take care of the rest.
If you instead would like to go the self-managed route and be responsible for
server management you could look into a provider of such a service, such as
[Digital Ocean](https://www.digitalocean.com/). Once you have a virtual server
running, simply install Node on it and follow the steps at
[Getting Started](#getting-started), but instead of running `npm run start` you
run `npm run prod`.

### Hosting the Client-Side Application
You could deploy the client-side application in the same manner as the API server,
but I personally find that there is a better way. Since our client-side application
is entirely static, you can simply upload the compiled files to a service that
specializes in delivering static content. One such service is Amazon's
[AWS S3](https://aws.amazon.com/s3/).
Simply compile your app with `npm run deploy`, sign up on Amazon Web Services,
create an S3 bucket, configure it as a static website, and finally upload
everything from the static folder into the bucket.
**NOTE**: The API server is not a
static website and therefore it will have to be hosted elsewhere.
**NOTE**: If the API server and client-side application are hosted at different
locations, you need to provide the client-side application with the `API_URL`
environment variable that maps to where the API is hosted. It could look something
like this: `API_URL=http://139.59.143.200:8000 npm run deploy`.

## Contributing
I am more than happy to accept any external contributions to the project in the
form of feedback, bug reports, or even better - pull requests.

## License
MIT
