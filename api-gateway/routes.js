const express = require("express");
const axios = require("axios");

const router = express.Router();

const serviceTargets = {
  users: process.env.USER_SERVICE_URL || "http://localhost:5001",
  books: process.env.BOOK_SERVICE_URL || "http://localhost:5002",
  orders: process.env.ORDER_SERVICE_URL || "http://localhost:5003"
};

async function proxyToService(req, res, serviceBaseUrl) {
  try {
    const response = await axios({
      method: req.method,
      url: `${serviceBaseUrl}${req.originalUrl}`,
      data: req.body,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json"
      },
      params: req.query,
      validateStatus: () => true
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    const details = error.response?.data || error.message;
    return res.status(502).json({
      message: "Gateway proxy error",
      service: serviceBaseUrl,
      details
    });
  }
}

router.use("/api/users", (req, res) => proxyToService(req, res, serviceTargets.users));
router.use("/api/books", (req, res) => proxyToService(req, res, serviceTargets.books));
router.use("/api/orders", (req, res) => proxyToService(req, res, serviceTargets.orders));

module.exports = router;