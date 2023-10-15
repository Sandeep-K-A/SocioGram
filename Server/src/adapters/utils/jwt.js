import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import adminRepository from '../Repositories/adminRepository';
import userRepository from '../Repositories/userRepository';
config();

export const jwtFunc = {
    generateToken: (userId) => {
        const maxAge = 7 * 24 * 60 * 60 * 1000;
        let token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: maxAge })
        return token;
    }
}
export const authentication = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    try {
        if (authHeader) {
            const token = authHeader

            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {

                    return res.status(401).json({
                        success: false,
                        message: 'Token verification failed',
                    });
                }
                console.log(decoded)
                try {
                    const admin = await adminRepository.findAdminById(decoded.userId);
                    console.log(admin)
                    if (!admin) {
                        return res.status(401).json({
                            success: false,
                            message: 'Admin not found',
                        });
                    }

                    next();
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                    });
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};
export const userAuth = async (req, res, next) => {
    try {
        console.log('userAuth Accessed.....')
        const authHeader = req.headers['authorization']
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {

                    return res.status(401).json({
                        success: false,
                        message: 'Token verification failed',
                    });
                }
                try {
                    const user = await userRepository.findUserById(decoded.userId)
                    if (!user) {
                        return res.status(401).json({
                            success: false,
                            message: 'user not found',
                        });
                    }
                    next()
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                    });
                }
            })

        } else {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}





