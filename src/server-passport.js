import { Database } from "bun:sqlite";
import express from "express";
import session from "express-session";
import cors from "cors";

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
  })
);

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).send("Internal Server Error");
});

const PASSWORD = process.env.PASSWORD;

const ensureAuthenticated = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  }
  res.status(401).send("Not authenticated");
};

app.get("/api/login", (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          /* Styles for the body (entire page) */
          body {
            font-family: Arial, sans-serif;
            background-color: #242424;
            color: white;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          /* Styles for the form */
          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          /* Styles for the input fields */
          input[type="password"] {
            padding: 0.5rem;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
          }

          /* Styles for the submit button */
          input[type="submit"] {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 5px;
            background-color: rgba(0, 0, 0, 0.15);
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          /* Hover effect for the submit button */
          input[type="submit"]:hover {
            background-color: #646cff;
          }
        </style>
      </head>
      <body>
        <form action="/api/login" method="post">
          <input type="password" name="password" placeholder="Enter Password"/>
          <input type="submit" value="Login"/>
        </form>
      </body>
    </html>
  `);
});

app.get("/api/fetch-status", ensureAuthenticated, async (req, res) => {
  const ip = req.query.ip;
  if (!ip) {
    return res.status(400).send("IP address is required");
  }

  try {
    const response = await fetch(`http://${ip}/status`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch status:", error);
    res.status(500).send("Failed to fetch status");
  }
});

app.post("/api/login", (req, res) => {
  if (req.body.password === PASSWORD) {
    req.session.authenticated = true;

    res.redirect("https://status.chandrastation.com");
  } else {
    res.send("Wrong password. Try again.");
  }
});

app.get("/", ensureAuthenticated, (req, res) => {
  res.send("You are authenticated! Welcome.");
});

app.all("/api/login", (req, res, next) => {
  console.log("Request received for /api/login", req.method);
  if (req.method === "POST") {
    next();
  } else {
    res.send("Received non-POST request");
  }
});

// Database setup
Database.setCustomSQLite(
  "/opt/homebrew/Cellar/sqlite/3.43.1/lib/libsqlite3.dylib"
);
const db = new Database("machines.sqlite", { create: true });

const userTableExists = db
  .query("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
  .get();
if (!userTableExists) {
  db.query("CREATE TABLE users (email TEXT UNIQUE);").run();
}

const tableExists = db
  .query(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='machines';"
  )
  .get();
if (!tableExists) {
  db.query("CREATE TABLE machines (name TEXT, ip TEXT);").run();
  const machinesFile = Bun.file("src/machines.json");
  const machinesData = JSON.parse(await machinesFile.text());
  const insertStmt = db.query("INSERT INTO machines (name, ip) VALUES (?, ?);");
  machinesData.forEach((machine) => {
    insertStmt.run(machine.name, machine.ip);
  });
}

app.get("/api/machines", ensureAuthenticated, (req, res) => {
  const machines = db.query("SELECT * FROM machines;").all();
  res.json(machines);
});

app.post("/api/add-machine", ensureAuthenticated, async (req, res) => {
  const body = req.body;
  db.query("INSERT INTO machines (name, ip) VALUES (?, ?);").run(
    body.name,
    body.ip
  );
  res.json({ success: true });
});

app.delete("/api/remove-machine", ensureAuthenticated, async (req, res) => {
  const body = req.body;
  if (body.name && body.ip) {
    db.query("DELETE FROM machines WHERE name = ? AND ip = ?;").run(
      body.name,
      body.ip
    );
    res.json({ success: true });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid request data",
    });
  }
});

app.use((req, res) => {
  res.status(404).send("404!");
});

const port = process.env.PORT || 1026;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

console.log("Database created");
console.log("Server started on http://localhost:1026");
