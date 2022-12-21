
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
const uploadCategories=multer({storage:catStorage})
const uploadProducts=multer({storage:productStorage})
module.exports={
    uploadCategories,
    uploadProducts
}