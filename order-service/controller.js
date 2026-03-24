const axios = require("axios");

let orders = [];

exports.placeOrder = async (req, res) => {
  orders.push(req.body);

  await axios.post("http://localhost:5004/notify", {
    message: "Order placed successfully"
  });

  res.json({ message: "Order placed" });
};

exports.getOrders = (req, res) => {
  res.json(orders);
};