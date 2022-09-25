const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name required"],
      minlength: [3, "min length of name must be 3"],
    },
    email: {
      type: String,
      required: [true, "email required"],
      minlength: [3, "min length of email must be 3"],
    },
    passwordHash: String,
    messages: [],
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj.__v;
    delete returnedObj._id;
    delete returnedObj.passwordHash;
  },
});

module.exports = mongoose.model("AnonymousUser", userSchema);
