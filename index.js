const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
require("express-async-errors");
app.use(cors());
const messageRouter = require("./controllers/messages");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => console.log("connected to MONGODB"))
  .catch((error) => {
    console.error(`error connecting to ${url}:`, error.message);
  });

app.use("/api/message", messageRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid or missing token" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "token expired",
    });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
