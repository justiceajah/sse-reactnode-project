require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const config = require("./config");
const mongodbConnection = require("./db");

// Routes
const postRoutes = require("./routes/post.routes");
const sseRoute = require("./routes/sse.route");

const { port, origin } = config;

const app = express();

// configuration setup
// app.options("/", (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     res.sendStatus(204);
//   });
app.use(cors({ origin, credentials: true }));
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// start the db
mongodbConnection();


// Main routes usage
app.use(sseRoute);
app.use("/api", postRoutes)

// start server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
