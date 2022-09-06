const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const routes = require("./routes/api");

const app = express();

const port = process.env.PORT;
//Connect to the database
mongoose
  .connect(process.env.REACT_APP_DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

// Since mongoose's Promise is deprecated, override it with Node's Promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
