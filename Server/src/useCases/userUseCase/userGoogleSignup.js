
export let userGoogleSignupLogic = async ({ fullName, firstName, lastName, email, profilePic, googleId }, userRepository, jwtFunc) => {
    try {
        let userExist = await userRepository.findUserByEmail(email);
        console.log(userExist)
        if (userExist) {
            return {
                success: false,
                message: 'user already exist'
            }
        } else {

            const randomNumber = Math.floor(Math.random() * 11);

            const newrandomNumber = Math.floor(Math.random() * 9000) + 1000;

            let userId = randomNumber + newrandomNumber;

            let userName = firstName + '_' + lastName;

            console.log('userId:', userId)
            console.log('googleId:', googleId)
            console.log('fullName:', fullName)
            console.log('userName:', userName)
            console.log('email:', email)
            console.log('profilePic:', profilePic)

            let newUser = await userRepository.createNewUserByGoogleId(userId, googleId, fullName, userName, email, profilePic);

            let token = jwtFunc.generateToken(newUser.userId);

            return {
                success: true,
                message: "new user created",
                user: newUser,
                token
            }
        }
    } catch (err) {
        throw new Error(err);
    }
}