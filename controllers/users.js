const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.get("/", async (request, response) => {
  const result = await User.find({});
  response.status(200).json(result);
});

userRouter.post("/", async (req, res) => {
  const { email, name, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "email already existed, please use another email" });
  } else if (!password) {
    return res.status(400).json({ error: "password required" });
  } else if (password.length < 3) {
    return res.status(400).json({ error: "min length of password must be 3" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    name,
    passwordHash,
  });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

userRouter.delete("/", async (req, res) => {
  await User.deleteMany({});
  res.status(204).end();
});

module.exports = userRouter;
