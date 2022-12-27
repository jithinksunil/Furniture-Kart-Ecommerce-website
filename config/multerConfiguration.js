
const multer=require('multer')

const catStorage=multer.diskStorage({ //diskStorage is  a prededfined field inside the multer object
    destination:(req,file,callback)=>{
        callback(null,'../Furniture-Kart-Ecommerce-website-master/public/categories/images');//destination field for folder setup
    },
    filename:(req,file,callback)=>{
        const name=Date.now()+'-'+file.originalname;
        callback(null,name); //filename field for file name setup
    }
})

const productStorage=multer.diskStorage({ //diskStorage is  a prededfined field inside the multer object
    destination:(req,file,callback)=>{
        callback(null,'../Furniture-Kart-Ecommerce-website-master/public/products/images');//destination field for folder setup
    },
    filename:(req,file,callback)=>{
        const name=Date.now()+'-'+file.originalname;
        callback(null,name); //filename field for file name setup
    }
})
const uploadCategories=multer(
    {
        storage:catStorage,
        fileFilter:(req,file,callback)=>{//image validation for files other than required format,can avoid this  field if validain is not required
            if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png'||file.mimetype=='image/gif'){
                callback(null,true)
            }
            else{
                callback(null,false)
                // return callback(new Error('only jpg jpeg png and gif file are allowed'))
            }
        }
    }
)

const uploadProducts=multer({storage:productStorage})
module.exports={
    uploadCategories,
    uploadProducts
}