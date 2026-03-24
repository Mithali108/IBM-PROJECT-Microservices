const express = require("express");
const axios = require("axios");

const router = express.Router();

router.use("/api/users", async (req, res) => {
  const response = await axios({
    method: req.method,
    url: "http://user-service:5004" + req.originalUrl,
    data: req.body
  });
  res.json(response.data);
});

router.use("/api/books", async (req, res) => {
  const response = await axios({
    method: req.method,
    url: "http://book-service:5002" + req.originalUrl,
    data: req.body
  });
  res.json(response.data);
});

router.use("/api/orders", async (req, res) => {
  const response = await axios({
    method: req.method,
    url: "http://order-service:5003" + req.originalUrl,
    data: req.body
  });
  res.json(response.data);
});

module.exports = router;