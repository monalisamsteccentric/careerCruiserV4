import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: String
  }, 
  receiver: {
    type: String,
  },
  message:{
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  subject:{
    type: String
  }

});

const Message = mongoose.model('Message', messageSchema);

export default Message
