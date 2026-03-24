const express = require("express");
const { placeOrder, getOrders } = require("./controller");

const router = express.Router();

router.post("/", placeOrder);
router.get("/", getOrders);

module.exports = router;