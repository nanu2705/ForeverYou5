import mongoose from "mongoose";

//Contact data
const ContactSchema = new mongoose.Schema({
    name: {
      type: String,
      require: true,
      },
      email: {
      type: String,
      require: true,
      },
      mobile: {
      type: Number,
      require: true,
      },
      message: {
      type: String,
      require: true,
      },
      });

      const User = mongoose.model("contactinfo", ContactSchema);
//Contact data Over


export default User;