const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: String,
  },
  { timestamps: true }
);

messageSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj.__v;
    delete returnedObj._id;
  },
});

module.exports = mongoose.model("AnonymousMessage", messageSchema);
