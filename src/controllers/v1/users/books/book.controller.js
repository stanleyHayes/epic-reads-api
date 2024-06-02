import Book from '../../../../models/v1/book.model.js';
import bookDAOS from './../../../../daos/v1/books/book.dao.js';
import logger from "../../../../utils/v1/logger.js";
// create a book
// POST /books
const createBook = async (req, res) => {
    try {
        if (!req.user.permissions.book.create) {
            return res.status(401).json({
                message: 'You are not allowed to publish a book.'
            });
        }
        const {title, rating, publisher, publishing_year, genre, authors} = req.body;
        const book = await Book.create({
            title,
            rating,
            publisher,
            publishing_year,
            genre,
            authors,
            user: req.user._id
        });
        await book.populate({path: "user", select: "first_name last_name"});
        res.status(201).json({
            data: book
        });
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

/**
 * @desc Retrieves books given some filters
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @async
 *
 * */
const getBooks = async (req, res) => {
    try {
        let sort = undefined;
        if (req.query.sort) {
            sort = req.query.sort.split(",").map(s => {
                const [key, order] = s.split(":");
                if (order === '1') {
                    return [key, 'asc']
                } else {
                    return [key, 'desc']
                }
            })
        }
        const filter = {};
        if (req.query.genre) {
            filter['genre'] = req.query.genre.toUpperCase();
        }
        if (req.query.q) {
            filter['$text'] = {$search: req.query.q, $language: "en"};
        }

        const limit = parseInt(req.query.size) || 5;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const {fields} = req.query;
        let projection = undefined;
        if (fields) {
            projection = fields.split(',').join(' ');
        }
        const books = await Book
            .find(filter, projection)
            .limit(limit)
            .skip(skip)
            .sort(sort)
            .populate({path: "user", select: "first_name last_name"});

        res.status(200).json({
            data: books,
            message: 'Books retrieved successfully'
        });
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

// GET /books/:id
// get a single book
const getBook = async (req, res) => {
    try {
        const {id} = req.params;
        const {success, code, data} = await bookDAOS.getBook({id}, {path: "user", select: "first_name last_name"});
        const book = await Book.findById(id)
            .populate({path: "user", select: "first_name last_name"});
        if (!book) {
            return res.status(404).json({
                message: `Book with id ${id} not found`
            })
        }
        // if(!success){
        //     return res.status(code).json({
        //         message: `Book with id ${id} not found`
        //     })
        // }
        res.status(200).json({
            data: book,
            message: 'Book retrieved successfully'
        });
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

// update an existing book
// PUT /books/:id
const updateBook = async (req, res) => {
    try {
        if (!req.user.permissions.book.update) {
            return res.status(401).json({
                message: 'You are not allowed to update a book.'
            });
        }
        const {id} = req.params;

        const book = await Book.findOne({_id: id, user: req.user._id})
            .populate({path: "user", select: "first_name last_name"});
        if (!book) {
            return res.status(404).json({
                message: `Book with id ${id} not found`
            });
        }
        await book.updateOne(req.body);
        const updatedBook = await Book.findById(id)
            .populate({path: "user", select: "first_name last_name"});
        res.status(200).json({
            data: updatedBook,
            message: 'Book updated successfully'
        })
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

// delete a book
// DELETE /books/:id
const deleteBook = async (req, res) => {
    try {
        if (!req.user.permissions.book.remove) {
            logger.error('You are not allowed to remove a book.');
            return res.status(401).json({
                message: 'You are not allowed to remove a book.'
            });
        }
        const {id} = req.params;
        const book = await Book.findOne({_id: id, user: req.user._id});
        if (!book) {
            logger.error(`Book with id ${id} not found`);
            return res.status(404).json({
                message: `Book with id ${id} not found`
            });
        }
        await book.deleteOne();
        res.status(200).json({
            message: 'Book deleted successfully'
        });
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

export {createBook, getBooks, getBook, updateBook, deleteBook};