import {Router}  from 'express';
import {login, register, changePassword} from "../controllers/auth.controller.js";

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.put('/password/change', changePassword);

export default router;