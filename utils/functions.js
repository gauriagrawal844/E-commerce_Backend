exports.validateRequestBody=(req,requiredFields)=>{
    const missingFields=[];
    requiredFields.forEach((key)=>{
        if(!req.body[key]){
            missingFields.push(key);
        }
    });
    return missingFields;
}