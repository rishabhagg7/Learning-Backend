import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config(
    {
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    }
)

const getPublicIdFromUrl = (url)=> {
    // Regular expression to match the public ID in a Cloudinary URL
    const regex = /cloudinary\.com\/(?:.*\/)*(.+?)\.[a-z]{3,4}$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath){
            return null
        }
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // file has been uploaded successfully
        // console.log("file is uploaded on cloudinary ",response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null
    }
}

const deleteOnCloudinary = async(oldURL) => {
    try {
        if(!oldURL){
            return null
        }
        const publicId = getPublicIdFromUrl(oldURL)
        //delete the file on cloudinary
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        return null
    }
}

export {uploadOnCloudinary,deleteOnCloudinary}