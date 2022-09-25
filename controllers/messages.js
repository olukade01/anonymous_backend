require("dotenv").config();
const messageRouter = require("express").Router();
const Message = require("../models/message");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getToken = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

messageRouter.get("/", async (request, response) => {
  const token = getToken(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "invalid or missing token" });
  }
  const user = await User.findById(decodedToken.id);
  const result = user.messages.map((message) => message.message);
  response.status(200).json(result);
});

messageRouter.post("/:name", async (req, res) => {
  const { message } = req.body;

  const name = req.params.name;
  const user = await User.findOne({ name });

  const newMessage = new Message({ message });
  const savedMessage = await newMessage.save();
  user.messages = user.messages.concat(savedMessage);
  await user.save();
  console.log(user);
  res.json(savedMessage);
});

module.exports = messageRouter;
