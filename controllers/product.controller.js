const Product = require("../models/product.model");
const { sendResponse, sendInternalErrorResponse } = require("../utils/response");
const { validateRequestBody } = require("../utils/functions");
const { MISSING_FIELD_MESSAGE } = require("../constants/constants");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const upload = multer({ storage: cloudinary });


//create a product

exports.create = async (req, res) => {
    try{
        const {name,description,price,category,subcategory,sizes,bestseller,date}=req.body;
        const missingFields=validateRequestBody(req,["name","description","price","category","subcategory","sizes","bestseller"]);
        if(missingFields.length>0){
            return sendResponse(res, 400, `Missing fields ${missingFields.join(",")}`, null);
        }

        const image1=req.files.image1 && req.files.image1[0];
        const image2=req.files.image2 && req.files.image2[0];
        const image3=req.files.image3 && req.files.image3[0];
        const image4=req.files.image && req.files.image4[0];

        const images=[image1,image2,image3,image4].filter((item)=>item!==undefined);

        let imagesUrl=await Promise.all(
          images.map(async (image)=>{
            let result=await cloudinary.uploader.upload(image.path,{resource_type:"image"});
            return result.secure_url;
          })
        );
        
        const product = new Product({
            name,
            description,
            category,
            price:Number(price),
            subcategory,
            bestseller:bestseller==="true"?true:false,
            sizes:JSON.parse(sizes),
            date,
            image:imagesUrl,
            date:Date.now()
        });
         
        // console.log(product);
        await product.save();

        return sendResponse(res, 201, "Product created successfully", product);
    }catch (err) {
        console.log(err);
        return sendInternalErrorResponse(res, err);
    }
};

//create a list of products

exports.all = async (req, res) => {
  try {
  const products = await Product.find();
  return sendResponse(res, 200, "Users fetched successfully!", products);
}catch (err) {
return sendInternalErrorResponse(res, err);
}
};


//get a single product

exports.get = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return sendResponse(res, 200, "Product fetched successfully", product);
  } catch (err) {
    return sendInternalErrorResponse(res, err);
  }
};

//delete a product
    
exports.delete = async (req, res) => {
     try {
        const product = await Product.findById(req.params.id);
        if (!product) {
          return sendResponse(res, 404, "Product not found",null);
        }
        await product.deleteOne();
        return sendResponse(res, 200, "Product removed successfully", product);
      } catch (err) {
        return sendInternalErrorResponse(res, err);
      }
    };


