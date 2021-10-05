require("dotenv").config();
const app = require("express")();
const PORT = process.env.PORT || 5000;

// Initializing Database
require("./db/init")();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
