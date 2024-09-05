import express from 'express';
const router = express.Router()
import { adminSignup, adminLogout, adminLogin, adminFetchUsers, userAccess, deleteUser, adminFetchReports, adminResolveReport, adminDeleteReport, adminUsersCountByMonth } from '../controllers/adminController';
import { authentication } from '../../adapters/utils/jwt';



router.post('/signup', adminSignup)
router.post('/signin', adminLogin)
router.post('/logout', adminLogout)

router.get('/user-count-month', adminUsersCountByMonth)

router.get('/allusers', authentication, adminFetchUsers)
router.get('/change-user-access/:userId', authentication, userAccess)
router.delete('/delete-user/:userId', authentication, deleteUser)

router.get('/allreports', authentication, adminFetchReports)
router.get('/resolve-report/:reportId/:postId', authentication, adminResolveReport)
router.get('/delete-report/:reportId', authentication, adminDeleteReport)


module.exports = router;