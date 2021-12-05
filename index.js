require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Initializing Database
require("./db/init")();

// Express Middlewares
app.use(require("cors")());
app.use(express.json());

// Routes
const routes = require("./routes");
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
