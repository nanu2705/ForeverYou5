import mongoose from "mongoose";

 //Register data
   const RegisterSchema = new mongoose.Schema({
    name: {
      type: String,
      require: true,
      },
    email: {
    type: String,
    require: true,
    },
    mobile: {
      type: String,
      require: true,
      },
    password: {
    type: String,
    require: true,
    },
    cart: [
      {
  
        categoryid: {
          type: Number,
          required:true,
        },
        productid:
        {
          type: Number,
          required:true,
         
        },
        productimg:
        {
          type: String,
          
          
         
        },
        productname:
        {
          type: String,
         
         
        },
        productprice:
        {
          type:String,
       
         
        },
        size:
        {
          type: String,
          
        },
        quantity:
        {
          type: Number,
          default: 1
        }
  
  
      },
    ],

    wish: [
      {
  
        categoryid: {
          type: Number,
          required:true,
        },
        productid:
        {
          type: Number,
          required:true,
         
        },
        productimg:
        {
          type: String,
          
          
         
        },
        productname:
        {
          type: String,
         
         
        },
        productprice:
        {
          type:String,
       
         
        },
     
  
  
      },
    ],

    shippingInfo: {
      name: String,
      mobile: String,
      email: String,
      address: String,
      state: String,
      pincode: String,
      landmark: String,
      city: String,
     
    },
order: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // or 'Register' if that's your model name
      required: true
    },
    paymentMode: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    orderDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      default: 'Pending'
    },
    products: [
      {
        productid: String,
        productname: String,
        productprice: Number,
        productimg: String,
        quantity: Number,
        size: String
      }
    ]
  }
]

    });
    const Register = mongoose.model("registerinfo",RegisterSchema)
   //Register data Over 

 export default Register;  