const express = require("express");
const { sendNotification } = require("./service");

const app = express();
app.use(express.json());

app.post("/notify", (req, res) => {
  sendNotification(req.body.message);
  res.json({ message: "Notification sent" });
});

app.listen(5004, () => console.log("Notification Service running"));