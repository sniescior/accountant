# Accountant - personal finances management app

## What is Accountant?

Accountant provides you with many options for keeping track on your finances.

## Requirements
 - Node
 - MongoDB

## Setup

First of all you'll need a mongoDB server running in the background.

```
git clone git@github.com:sniescior/accountant.git
```
```
npm install
```

Then you need to set up a .env file as following:

```
SESSION_SECRET=""
DB_CONNECTION_STRING=""
DB_STARTER_DATA_OBJECT_ID=""
PORT=""
```

DB_STARTER_DATA_OBJECT_ID - id of a document in the database defined with [databaseSchema](models/starterData.js).  
Keep in mind that initially this object should be stored in separate collection.

PORT field is optional (default is 3000).

Open http://localhost:3000 and get started.