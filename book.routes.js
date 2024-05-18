import {Router} from 'express';
import {createBook, getBooks, getBook, updateBook, deleteBook} from "./book.controller.js";

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;