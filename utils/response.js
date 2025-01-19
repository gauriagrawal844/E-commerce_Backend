const {ERROR_MSG,INTERNAL_STATUS_CODE}=require("../constants/constants");

exports.sendResponse=(res,statusCode,message,data)=>{
    res.status(statusCode).json({
        message,
        data,
    });
};

exports.sendInternalErrorResponse=(res,error)=>{
    return res.status(INTERNAL_STATUS_CODE).json({
        message:ERROR_MSG,
        error:error.message,
    });
};