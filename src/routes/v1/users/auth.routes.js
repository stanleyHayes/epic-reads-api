import {Router} from 'express';
import {changePassword, login, register, verifyEmail, verifyPhoneNumber} from "../../../controllers/v1/users/auth/auth.controller.js";
import authenticate from "../../../middleware/v1/users/authenticate.js";

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.put('/password/change', authenticate, changePassword);
router.put('/verify/email', verifyEmail);
router.put('/verify/phone', verifyPhoneNumber);

export default router;