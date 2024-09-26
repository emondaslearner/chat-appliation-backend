const express = require("express");
const middleware = require("@middleware");

const app = express();

// middleware
middleware(app);

module.exports = app;
