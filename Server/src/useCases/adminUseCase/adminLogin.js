import bcrypt from 'bcrypt';


export let adminLoginLogic = async ({ email, password }, adminRepository, jwtFunc) => {
    try {

        let admin = await adminRepository.findAdminByEmail(email)

        if (!admin) {
            return {
                success: "false",
                message: "invalid admin account"
            }
        }

        let passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return {
                success: false,
                message: "Invalid email or password"
            }
        }

        let token = jwtFunc.generateToken(admin.adminId)

        return {
            success: true,
            message: "admin login successful",
            admin,
            token
        }
    } catch (err) {
        throw new Error(err)
    }
}
