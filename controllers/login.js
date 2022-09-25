require("dotenv").config();
const loginRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordCorrect = !user
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid email or password" });
  }
  const userForToken = {
    email: user.email,
    id: user._id,
  };
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });
  console.log(token);
  res.status(200).send({
    token,
    email: user.email,
    name: user.name,
    messages: user.messages,
  });
});

module.exports = loginRouter;
