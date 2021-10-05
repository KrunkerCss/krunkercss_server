function init() {
  const mongoose = require("mongoose");
  mongoose.connect(process.env.DB_URI, (err) => {
    if (err) console.log(err.message);
  });

  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });
}

module.exports = init;
