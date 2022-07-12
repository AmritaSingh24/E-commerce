const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  name:{type:String, required:true},
  email: {
    type: String,
    unique: true,
    required:true
  },
  phone: {type:String, required:true},
  password: {type:String, required: true},
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {_id: this._id, isAdmin: this.isAdmin},
        "jwtPrivateKey"
    );
    return token;
}

const User = mongoose.model("User", userSchema);

exports.User = User;