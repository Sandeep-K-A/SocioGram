import bcrypt from 'bcrypt'

export let userPasswordChangeLogic = async (password, user_id, userRepository) => {

    try {
        let hashedPassword = await bcrypt.hash(password, 10);
        const result = await userRepository.updatePassword(user_id, hashedPassword)
        if (!result) {
            return {
                success: false,
                message: "Cannot find the user."
            }
        }
        return {
            success: true,
            message: "Password change successfully."
        }
    } catch (error) {
        throw new Error(error)
    }
}