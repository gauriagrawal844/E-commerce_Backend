const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phoneNo :{type:Number,required:true,unique:true},
    password: { type: String, required: true, select: false },
    cartData:{type:Object,default:{}},
    role: { type: String, default: 'user' },
    },{minimize:false},{
        timestamps:true,
    }
);
const User=mongoose.model("User",userSchema);
module.exports=User;
