import mongoose from "mongoose";

 //  for newsletter table & schema start
   const NewsSchema = new mongoose.Schema({
 
    email:{
      type: String,
      requre: true,
    },
   
  
  });

  const News = mongoose.model("newlater", NewsSchema);

    //  for newsletter table & schema end

    export default News;