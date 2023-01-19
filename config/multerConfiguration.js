const multer=require('multer')
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage }= require("multer-storage-cloudinary");

const catCloudstorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "categories",//cloud folder
    },
});

const uploadCategories = multer({
    storage: catCloudstorage,
    fileFilter:(req,file,callback)=>{//image validation for files other than required format,can avoid this  field if validain is not required
        if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png'||file.mimetype=='image/gif'){
            callback(null,true)
        }
        else{
            callback(null,false)
            // return callback(new Error('only jpg jpeg png and gif file are allowed'))
        }
    }
})

const productCloudstorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "products",//cloud folder
    },
});

const uploadProducts = multer({
    storage: productCloudstorage,
    fileFilter:(req,file,callback)=>{//image validation for files other than required format,can avoid this  field if validain is not required
        if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png'||file.mimetype=='image/gif'){
            callback(null,true)
        }
        else{
            callback(null,false)
            
            // return callback(new Error('only jpg jpeg png and gif file are allowed'))
        }
    }
})

module.exports={
    uploadCategories,
    uploadProducts
}