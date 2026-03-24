const express = require("express");
const { placeOrder, getOrders, updateOrder } = require("./controller");

const router = express.Router();

router.post("/", placeOrder);
router.get("/", getOrders);
router.put("/:id", updateOrder);

module.exports = router;