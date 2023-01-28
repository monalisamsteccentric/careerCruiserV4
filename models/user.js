import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  pdf:{
    type: Buffer
  },
  details: {
    type: Object
  },
  contact: {
    type: Object
  }
  
});

const User = mongoose.model('User', userSchema);

export default User
