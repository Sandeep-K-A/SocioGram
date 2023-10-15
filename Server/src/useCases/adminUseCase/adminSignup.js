import bcrypt from 'bcrypt'

export let adminSignupLogic = async ({ userName, email, password }, adminRepository, jwtFunc) => {
    try {
        let adminExist = await adminRepository.findAdminByEmail(email)
        if (adminExist) {
            return {
                success: false,
                message: "admin already exist"
            }
        } else {
            let hashedPassword = await bcrypt.hash(password, 10)

            const randomNumber = Math.floor(Math.random() * 11);

            const newrandomNumber = Math.floor(Math.random() * 9000) + 1000;

            let adminId = randomNumber + newrandomNumber;

            let newAdmin = await adminRepository.createNewAdmin(adminId, userName, email, hashedPassword)

            let token = jwtFunc.generateToken(newAdmin.adminId)

            return {
                success: true,
                message: "new admin created",
                admin: newAdmin,
                token
            }

        }
    } catch (error) {
        throw new Error(error)
    }
}