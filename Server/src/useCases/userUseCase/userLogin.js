import bcrypt from 'bcrypt';
import crypto from 'crypto';

export let userLoginLogic = async ({ email, password }, userRepository, jwtFunc, sendEmail) => {
    try {
        // Find the user by email
        const user = await userRepository.findUnBlockedUserByEmail(email);

        if (!user) {
            return {
                success: false,
                message: "Invalid user account"
            };
        }
        if (!user.verified) {

            const newToken = crypto.randomBytes(32).toString("hex")

            const verifyToken = await userRepository.createToken(user._id, newToken)

            const url = `${process.env.BASE_URL}users/${user._id}/verify/${verifyToken.token}`

            await sendEmail(user.email, "Verify Email", url)

            return {
                success: false,
                message: "An Email send to your account please Verify and Try again"
            }
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return {
                success: false,
                message: "Invalid email or password"
            };
        }

        // Generate a JWT token
        const token = jwtFunc.generateToken(user.userId);

        return {
            success: true,
            message: "User login successful",
            user,
            token
        };
    } catch (err) {
        console.error("Error during login:", err);
        throw new Error("An error occurred during login");
    }
};

