import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'




const uploadOnCloudinary = async (localPath)=>{
  console.log(process.env.CLOUD_NAME, process.env.CLOUDINARY_API_KEY);
    try {
      if(!localPath) return null
      cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
        const response = await cloudinary.uploader
      .upload(localPath,{
        resource_type:"auto"
      })
        fs.unlinkSync(localPath)

      
      console.log("File uploaded successfully:", response.url);
    
      return response
    } catch (error) {
        fs.unlinkSync(localPath)
        console.log(process.env.CLOUDINARY_API_SECRET);
        
        console.log("file upload fail",error);
        console.log(process.env.CLOUDINARY_API_KEY)
        return null
    }
}
export default uploadOnCloudinary