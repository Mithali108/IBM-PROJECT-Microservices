const express = require("express");
const axios = require("axios");

const router = express.Router();

const serviceTargets = {
  users: process.env.USER_SERVICE_URL || "http://localhost:5001",
  books: process.env.BOOK_SERVICE_URL || "http://localhost:5002",
  orders: process.env.ORDER_SERVICE_URL || "http://localhost:5003",
  admin: process.env.ADMIN_SERVICE_URL || "http://localhost:5006"
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

router.get("/api/admin/stats", async (req, res) => {
  try {
    const [booksResponse, ordersResponse] = await Promise.all([
      axios.get(`${serviceTargets.books}/api/books`),
      axios.get(`${serviceTargets.orders}/api/orders`)
    ]);

    const books = Array.isArray(booksResponse.data) ? booksResponse.data : [];
    const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const pendingOrders = orders.filter((order) => (order.status || "").toLowerCase() === "pending").length;
    const completedOrders = orders.filter((order) => (order.status || "").toLowerCase() === "completed").length;
    const totalCustomers = new Set(
      orders.map((order) => order.customerName).filter(Boolean)
    ).size;

    return res.json({
      totalBooks: books.length,
      totalOrders: orders.length,
      totalRevenue: totalRevenue.toFixed(2),
      pendingOrders,
      completedOrders,
      totalCustomers,
      avgOrderValue: orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : "0.00"
    });
  } catch (error) {
    return res.status(502).json({
      message: "Failed to aggregate admin stats",
      details: error.message
    });
  }
});

router.use("/api/users", (req, res) => proxyToService(req, res, serviceTargets.users));
router.use("/api/books", (req, res) => proxyToService(req, res, serviceTargets.books));
router.use("/api/orders", (req, res) => proxyToService(req, res, serviceTargets.orders));

module.exports = router;