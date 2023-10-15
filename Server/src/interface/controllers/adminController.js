import { jwtFunc } from "../../adapters/utils/jwt";
import adminRepository from "../../adapters/Repositories/adminRepository";
import { adminLoginLogic } from "../../useCases/adminUseCase/adminLogin";
import { adminSignupLogic } from "../../useCases/adminUseCase/adminSignup";


export let adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let result = await adminLoginLogic({ email, password }, adminRepository, jwtFunc)

        if (result.success) {
            let token = result.token;
            const maxAge = 7 * 24 * 60 * 60 * 1000
            res.cookie('admin', token, { maxAge: maxAge, httpOnly: true })
            res.send({
                success: true,
                message: 'admin login successfull',
                token
            })
        }
        else {
            res.send(result)
        }

    } catch (err) {
        throw new Error(err)
    }
}
export let adminSignup = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        let result = await adminSignupLogic({ userName, email, password }, adminRepository, jwtFunc)
        if (result.success) {
            let token = result.token;
            const maxAge = 7 * 24 * 60 * 60 * 1000
            res.cookie('admin', token, { maxAge: maxAge, httpOnly: true })
            res.send({
                success: true,
                message: 'admin signup successfull',
                token
            })
        } else {
            res.send(result)
        }
    } catch (error) {
        throw new Error(error)
    }
}
export let adminLogout = (req, res) => {
    try {
        res.clearCookie('admin')
        res.send({
            success: true,
            message: "admin logged out successfully"
        })
    } catch (error) {

    }
}
export let adminFetchUsers = async (req, res) => {
    try {
        let users = await adminRepository.getAllUsers()
        if (!users) {
            res.send(
                {
                    success: false,
                    message: "users list empty"
                }
            )
        }
        res.send({
            success: true,
            users,
            message: "all users list successfully fetched"
        })

    } catch (error) {
        throw new Error(error)
    }
}
export const userAccess = async (req, res) => {
    let userId = req.params.userId;
    console.log(userId)
    try {
        let result = await adminRepository.changeUserAccess(userId)
        if (result.success) {
            res.send({
                success: true,
                message: "changed the user Access."
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteUser = async (req, res) => {
    let userId = req.params.userId;
    try {
        let result = await adminRepository.deleteSingleUser(userId)
        if (result.success) {
            res.send({
                success: true,
                message: "user Deleted successfully"
            })
        } else {
            res.send({
                success: true,
                message: "user deletion failed"
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
export const adminFetchReports = async (req, res) => {
    try {
        const reports = await adminRepository.FetchAllReports()
        if (!reports) {
            res.send({
                success: false,
                message: "No reports.."
            })
        } else {
            res.send({
                success: true,
                message: "all reports successfully fetched",
                reports
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
export let adminResolveReport = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        const postId = req.params.postId;
        const result = await adminRepository.resolveReport(reportId, postId)
        if (!result) {
            res.send({
                success: false,
                message: "resolving the report failed"
            })
        } else {
            res.send({
                success: true,
                message: "report resolved successfully",
                resolvedReport: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
export let adminDeleteReport = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        const result = await adminRepository.deleteReport(reportId)
        if (!result) {
            res.send({
                success: false,
                message: 'Deletion of report failed'
            })
        } else {
            res.send({
                success: true,
                message: 'Report deleted successfully',
                deletedReport: result
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}