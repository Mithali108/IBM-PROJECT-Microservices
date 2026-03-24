const express = require("express");
const cors = require("cors");   // ✅ add this
const routes = require("./routes");

const app = express();

app.use(cors());                // ✅ add this
app.use(express.json());

app.use("/", routes);

app.listen(5000, () => console.log("API Gateway running"));