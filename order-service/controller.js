const axios = require("axios");

let orders = [];
let nextOrderId = 1;

exports.placeOrder = async (req, res) => {
  const { customerName, items, total } = req.body;

  if (!customerName || !Array.isArray(items) || total === undefined) {
    return res.status(400).json({ message: "Missing required order fields" });
  }

  const newOrder = {
    id: nextOrderId++,
    customerName,
    items,
    bookCount: items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
    total: Number(total),
    status: "Pending",
    date: new Date().toISOString()
  };

  orders.push(newOrder);

  try {
    await axios.post("http://localhost:5004/notify", {
      message: `Order #${newOrder.id} placed successfully`
    });
  } catch (error) {
    // Notification failure should not block order creation.
  }

  return res.status(201).json(newOrder);
};

exports.getOrders = (req, res) => {
  res.json(orders);
};

exports.updateOrder = (req, res) => {
  const orderId = Number(req.params.id);
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  Object.assign(order, req.body, { id: orderId });
  return res.json(order);
};