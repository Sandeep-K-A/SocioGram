import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export let streamUpload = (fileBuffer) => {

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result)
            } else {

                reject(error)
            }
        })
        stream.write(fileBuffer)
        stream.end()
    })


}