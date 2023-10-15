export let userGoogleSigninLogic = async (googleId, userRepository, jwtFunc) => {
    try {
        const user = await userRepository.findUnBlockedUserByGoogleId(googleId)
        if (!user) {
            return {
                success: false,
                message: "invalid user account"
            }
        }
        const token = jwtFunc.generateToken(user.userId)
        return {
            success: true,
            message: "User login successful",
            user,
            token
        };
    } catch (error) {
        throw new Error(error)
    }
}