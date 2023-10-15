import bcrypt from 'bcrypt';
import crypto from 'crypto';

export let userSignupLogic = async ({ fullName, userName, email, password }, userRepository, jwtFunc, sendEmail) => {
    try {
        let userExist = await userRepository.findUserByEmail(email);
        console.log(userExist)
        if (userExist) {
            return {
                success: false,
                message: 'user already exist'
            }
        } else {
            let hashedPassword = await bcrypt.hash(password, 10);

            console.log(hashedPassword)
            const randomNumber = Math.floor(Math.random() * 11);

            const newrandomNumber = Math.floor(Math.random() * 9000) + 1000;

            let userId = randomNumber + newrandomNumber;

            let newUser = await userRepository.createNewUser(userId, fullName, userName, email, hashedPassword);

            const newToken = crypto.randomBytes(32).toString("hex")

            const verifyToken = await userRepository.createToken(newUser._id, newToken)

            // let token = jwtFunc.generateToken(newUser.userId);

            const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${verifyToken.token}`

            await sendEmail(newUser.email, "Verify Email", url)

            return {
                success: true,
                message: "An Email send to your account please Verify",
                user: newUser,

            }
        }
    } catch (err) {
        throw new Error(err);
    }
}

