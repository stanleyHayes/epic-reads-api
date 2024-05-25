import {Router} from 'express';
import {createBook, getBooks, getBook, updateBook, deleteBook} from "../../controllers/users/book.controller.js";
import authenticate from "../../middleware/users/authenticate.js";

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', authenticate, createBook);
router.put('/:id', authenticate, updateBook);
router.delete('/:id', authenticate, deleteBook);

export default router;