const express = require("express");
const { addBook, getBooks } = require("./controller");

const router = express.Router();

router.post("/", addBook);
router.get("/", getBooks);

module.exports = router;