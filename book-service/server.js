const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/books", routes);

app.listen(5002, () => console.log("Book Service running"));