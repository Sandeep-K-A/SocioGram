export let uploadProfilePic = async (image, userId, streamUpload, userRepository) => {
    try {
        const imageUpload = await streamUpload(image.buffer)
        const result = await userRepository.updateProfilePic(userId, imageUpload.secure_url)
        if (result) {
            return {
                success: true,
                message: "profile picture successfully uploaded",
                profilePic: imageUpload.secure_url
            }
        } else {
            return {
                success: false,
                message: "profile picture upload failed"
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}