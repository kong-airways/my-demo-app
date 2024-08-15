require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({
    message: "Hello World!",
  });
});

const port = process.env.PORT || 3000;
const address = process.env.BIND_ADDRESS || "127.0.0.1";
app.listen(port, address, () => {
  console.log(`Server is running at http://${address}:${port}`);
});
