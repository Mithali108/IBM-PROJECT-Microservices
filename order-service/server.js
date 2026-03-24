const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/orders", routes);

app.listen(5003, () => console.log("Order Service running"));