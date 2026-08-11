import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configure lazily so env vars are loaded by the time this runs
function getCloudinary() {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    return cloudinary
}

const uploadOnCloudinary = async (localPath) => {
    try {
        if (!localPath) return null

        const response = await getCloudinary().uploader.upload(localPath, {
            resource_type: "auto"
        })

        if (fs.existsSync(localPath)) fs.unlinkSync(localPath)
        return response
    } catch (error) {
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath)
        console.error("Cloudinary upload failed:", error.message)
        return null
    }
}

export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) return null
        return await getCloudinary().uploader.destroy(publicId, { resource_type: resourceType })
    } catch (error) {
        console.error("Cloudinary delete failed:", error.message)
        return null
    }
}

export default uploadOnCloudinary
