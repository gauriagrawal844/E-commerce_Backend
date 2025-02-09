const User=require("../models/user.model");
const {MISSING_FIELD_MESSAGE}=require("../constants/constants");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {sendResponse,sendInternalErrorResponse}=require("../utils/response");
const {validateRequestBody}=require("../utils/functions");
const{ SALT_ROUND}=process.env;

exports.all = async (req, res) => {
    try {
    const users = await User.find();
    return sendResponse(res, 200, "Users fetched successfully!", users);
}catch (err) {
  return sendInternalErrorResponse(res, err);
}
};

exports.get = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return sendResponse(res, 200, "User fetched successfully", user);
      } catch (err) {
        return sendInternalErrorResponse(res, err);
      }
    };

exports.update = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if (!user) {
          return sendResponse(res, 404, "User not found",null);
        }
        user.fullname=req.body.fullname;
        user.email=req.body.email;
        user.phoneNo=req.body.phoneNo;
        await user.save;
        return sendResponse(res, 200, "User updated successfully", user);
      } catch (err) {
        return sendInternalErrorResponse(res, err);
      } 
    };
    
exports.delete = async (req, res) => {
     try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return sendResponse(res, 404, "User not found",null);
        }
        await user.remove();
        return sendResponse(res, 200, "User deleted successfully", user);
      } catch (err) {
        return sendInternalErrorResponse(res, err);
      }
    };
     
exports.signup = async (req, res) => {
    try {
        const {fullname,password,email,phoneNo}=req.body;
        const missingFields=validateRequestBody(req,["fullName","password","email","phoneNo"]);
        // console.log(missingFields);
       if(missingFields.length>0){
          return sendResponse(res, 400, `Missing fields ${missingFields.join(",")}`, null);
        }
        const user = await User.findOne({email});
        if (user?.email===email) {
          return sendResponse(res, 400, "Email already exists", null);
        }
        if (user?.phoneNo===phoneNo) {
          return sendResponse(res, 400, "Phone number already exists", null);
        }
        const hashPassword=await bcrypt.hash(password,+process.env.SALT_ROUND);
        await User.create({...req.body,password:hashPassword});
        return sendResponse(res, 201, "sign up successful", null);
            
      } catch (err) {
        return sendInternalErrorResponse(res, err);
      }
    };

    exports.login = async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return sendResponse(res, 400, "Please provide all the fields", null);
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
          return sendResponse(res, 400, "User not found", null);
        }
        //password check
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          return sendResponse(res, 400, "Invalid credentials", null);
        }
        //token generation
        const token = jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: process.env.JWT_EXPIRY,
          }
        );
    
        return sendResponse(res, 200, "Login successful", {
          token,
          user: {
            ...user._doc,
            password: null,
          },
        });
      } catch (err) {
        return sendInternalErrorResponse(res, err);
      }
    };
