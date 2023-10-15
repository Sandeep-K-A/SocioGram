export let userCreatePost = async (userId, userProfileId, postImage, postDescription, userRespository, streamUpload) => {

    try {

        const min = 10;
        const max = 99;

        const randomTwoDigitNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        const postIdStr = userProfileId.toString() + randomTwoDigitNumber.toString();
        const postId = parseInt(postIdStr)

        const imageUpload = await streamUpload(postImage.buffer)

        let userPost = await userRespository.userNewPost(userId, userProfileId, postId, imageUpload.secure_url, postDescription)
        if (!userPost) {
            return null;
        }
        return userPost;
    } catch (error) {

        // throw new Error(error)
        console.log(error)
    }
}