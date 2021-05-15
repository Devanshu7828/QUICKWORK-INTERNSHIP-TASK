require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const MongoDbStore = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");

// show routes
app.use(morgan("dev"));
// DB
require("./database/db");

// INITIALISE SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    store: MongoDbStore.create({ mongoUrl: process.env.MONGO_URL }),
    collection: "session",
    saveUninitialized: false,

    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24hours
  })
);

// PASSPORT
const googleInit = require("./controller/googleController");
googleInit(passport);

// INITIALIZE PASSPORT
app.use(passport.initialize());

// INITIALIZE SESSION FOR PASSPORT
app.use(passport.session());

// GLOBAL MIDDLEWARE
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use(ejsLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// ROUTES
app.use("/", require("./routes/router"));

//STARTING THE SERVER
app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
