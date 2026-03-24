const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", routes);

app.listen(5001, () => console.log("User Service running"));