# Node Status Monitor

This is a simple node status monitor to be used internally at [Chandra Station](https://chandrastation.com)

## Design

### Front End

Built with vite, emotion, react, typescript, and bun.

### Back End

Express for the server, bun sqlite for the database.

### Running

Everything is setup to work on internal servers and self signed TLS certs so running in local dev will require some changes.

### Overview

The sql-lite database is bootstrapped with data from `machines.json` this is a file in `.gitignore` that contains our machines IP address and the ports we want to monitor. The express server then can make GET requests to fetch the status of each machine, POST requests to add more machines or DELETE requests to remove machines. The database is only accessible via the express sever and the express server only responds to requests if the user authenticates with a password on the front end.

The application makes calls to exposed endpoints for internal purposes so nginx handles the TLS and reverse proxying alongside Cloudflare to provide full end to end encryption.
