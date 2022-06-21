# Description

This is a nestJS app, I used as a middleware to make it easier to scale and maintain.

Swagger: https://us-central1-embat-puppy-fb.cloudfunctions.net/api/docs/

we have some modules,

- like a redis provider, with a cache system and a cache strategy.
- I include swagger for an easier testing of the api.
- is hosted in cloud functions
- all is structured with modules and services.
- I used firestore for the database, connecting as a module.
- I included joi to avoid .env errors. I used it to validate the inputs.

Maybe the next step could be split some of this modules in to microservices, but i think it's not necessary right now (overengineering).

# How to start

check enviroment variables:
(Is in the email) Create a .env file in the root of the project, and add the following variables:

```
GOOGLE_PROJECT_ID =embat-puppy-fb

GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsdfgsdfgsdfgs\n-----END PRIVATE KEY-----\n"

GOOGLE_CLIENT_EMAIL=test@example.com


REDIS_URL = "redis://default:Pi9ktXIpQMg1b3ggbTdfE620xD2J4Rf0@redis-13346.c253.us-central1-1.gce.cloud.redislabs.com:13346/0"
REDIS_CACHE_TIME_SECONDS = 10

```

## install dependencies

```
npm install

```

## run the app

```
npm run start
```

The cloud functions will start normally in this link: http://localhost:5000/embat-puppy-fb/us-central1/api

you can check the swagger in http://localhost:5000/embat-puppy-fb/us-central1/api/docs/

where you can select for local or remote server, to test.
