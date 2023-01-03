const multer=require('multer')


const catStorage=multer.memoryStorage()
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

const productStorage=multer.memoryStorage()
const uploadProducts=multer(
    {
        storage:productStorage,
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

module.exports={
    uploadCategories,
    uploadProducts
}