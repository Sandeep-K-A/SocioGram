import crypto from 'crypto';

export let userForgotPasswordLogic = async (email, userRepository, sendEmail) => {
    try {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return null;
        }
        const newToken = crypto.randomBytes(32).toString("hex")
        const verifyToken = await userRepository.createToken(user._id, newToken)
        const url = `${process.env.BASE_URL}users/${user._id}/forgot-password/${verifyToken.token}`
        const text = `click this link to make new password: ${url}`
        await sendEmail(user.email, "ForgotPassword Email", text)
        return {
            success: true,
            message: "An password reset link is send to you via email please check.",
        }
    } catch (error) {
        throw new Error(error)
    }
}