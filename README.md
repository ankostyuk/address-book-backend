# Address Book Backend

[Test](https://gist.github.com/olegvg/29e9ad1000aa695059b0825c99486cd5) for Fullstack Developer to [O:LABS](http://o-labs.ru/).

Backend for [Address Book App](https://ankostyuk.github.io/address-book-frontend/)

# Project

## Init

Install:

* mongo 2.6.5+

* nodejs 5.10+
* npm

```bash
npm install
```

## Dev

### MongoDB

Config:

[/mongo/mongo.config](/mongo/mongo.config)

Create `dbpath` if not exists.


### JWT

Config:

[/server/jwt.config.js](/server/jwt.config.js)

Change `ttl` for test.

### Run

```bash
npm run start:mongo

npm run start:server
```

[http://localhost:3000](http://localhost:3000)

# API

Base url:

`/api`

## User API

### Register User

```
POST /user/signup

// request body
{
    "name": "string",
    "email": "string",
    "password": "***"
}

// response data
{
    "id": "id",
    "name": "string",
    "email": "string",
    "token": "JWT"
}
```

### Login User

```
POST /user/login

// request body
{
    "email": "string",
    "password": "***"
}

// response data
{
    "id": "id",
    "name": "string",
    "email": "string",
    "token": "JWT"
}
```

### Logout User

```
POST /user/logout
```

### Get auth User info

```
GET /api/user

// response data
{
    "id": "id",
    "name": "string",
    "email": "string"
}
```

# Frontend + Backend

Clone Frontend repo:

https://github.com/ankostyuk/address-book-frontend

...and see README


Configure `nginx`, example:

```
    server {
        listen       8010;
        server_name  localhost;

        location / {
            proxy_pass  http://localhost:8090/;
        }

        location /address-book-frontend/ {
            root   /path/to/address-book-frontend; # without address-book-frontend
            index  index.html;
        }

        location /api/ {
            proxy_pass  http://localhost:3000/api/;
        }
    }
```

Dev frontend:

[http://localhost:8010/](http://localhost:8010/)


Production frontend:

[http://localhost:8010/address-book-frontend/dist/app/](http://localhost:8010/address-book-frontend/dist/app/)
