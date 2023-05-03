const express = require("express");
const sse = require("../sse");

const router = express.Router();

router.get("/stream", (req, res) => {
    console.log("Something happened")
  sse.init(req, res);
});

module.exports = router;
