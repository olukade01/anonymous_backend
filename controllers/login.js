require("dotenv").config();
const loginRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });
  const passwordCorrect = !user
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid Username or Password" });
  }
  const userForToken = {
    name: user.name,
    id: user._id,
  };
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });
  console.log(token);
  res.status(200).send({
    token,
    name: user.name,
    email: user.email,
    messages: user.messages,
  });
});

module.exports = loginRouter;
