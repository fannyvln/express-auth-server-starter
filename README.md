# Express Auth Server Starter

**Live Demo**: http://auth-starter.laaksonen.io

A boilerplate for an **Express** API server that handles token based user
authentication with [JSON Web Tokens (JWT)](https://jwt.io). Because *React
Redux Auth Starter* is simply an API, a client-side application is also required
enable users to interact with the API in the browser.
[React Redux Auth Starter](https://github.com/laaksonen/react-redux-auth-starter)
is a React & Redux application made just for that purpose, and it is designed
to work in unison with *Express Auth Server Starter*.

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
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Sending email |

## Requirements
* [Node.js 6.0+](http://nodejs.org)
* [MongoDB](https://www.mongodb.com) or something like [mLab](https://mlab.com/)
* [SendGrid](https://sendgrid.com/) account

## Getting Started
### Installing and running the API
```bash
$ git clone https://github.com/laaksonen/express-auth-server-starter.git
$ cd express-auth-server-starter
$ npm install
```
Once *express-auth-server-starter* is installed, you need to create a `.env` file
in the project root folder. The `.env` files is used to store environment
variables that we wish to keep secret. We are then using
[dotenv](https://github.com/motdotla/dotenv) to load these variables inside our
application. Git has been set to ignore `*./env` files so that
it won't be committed to the repository. You need to include the following
variables:
```
DB_CONNECTION=YOUR_MONGODB_CONNECTION_HERE
JWT_SECRET=A_SECRET_STRING_HERE
SENDGRID_USER=YOUR_SENDGRID_USERNAME_HERE
SENGRID_PASSWORD=YOUR_SENDGRID_PASSWORD_HERE
```
Once `.env` is saved you can run `npm start` to start the server.

### Installing and running the client-side application
If you want to interact with the API in the browser, a client-side application
is needed. [React Redux Auth Starter](https://github.com/laaksonen/react-redux-auth-starter) is a client-side
React & Redux application made just for that purpose.
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

## Application Structure
```
.
├── client (git submodule)    # Client-side react & redux application
├── controllers               # API controllers
├── models                    # Mongoose models
├── routes                    # API routes
├── services                  # External services
│   └──passport.js            # Passport configuration
├── utils                     # Utility functions
└── index.js                  # Express server
```

## Deployment
### Hosting the API
When choosing a hosting option you first need to decide if you want to go the
managed or the self-managed route. When using managed hosting such as
[Heroku](https://heroku.com), someone else takes care of managing the server for
you. In heroku's case, all you need to do is git push the application to heroku
and they take care of the rest.
If you instead would like to go the self-managed route and be responsible for
your server, you could look into the service such as
[Digital Ocean](https://www.digitalocean.com/). Once you have a virtual server
running, simply install Node on it and follow the steps at
[Getting Started](#getting-started).

### Hosting the client-side application
You could deploy the client-side application in the same manner as the API server,
but I personally find that there is a better way. Since our client-side application
is entirely static, you can simply upload the compiled files to a service that
specializes in delivering static content. One such service is Amazon's
[AWS S3](https://aws.amazon.com/s3/).
Simply compile your app with `npm run deploy`, sign up on Amazon Web Services,
create an S3 bucket, configure it as a static website, and finally upload
everything from the static folder into the bucket. NOTE: The API server is not a
static website and therefore it will have to be hosted elsewhere.

## Contributing
I am more than happy to accept any external contributions to the project in the
form of feedback, bug reports, or even better - pull requests.

## License
MIT
