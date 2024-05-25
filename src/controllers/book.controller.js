import Book from '../models/book.model.js';

// create a book
// POST /books
const createBook = async (req, res) => {
    try {
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

// list all books
// GET /books
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({})
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
        const book = await Book.findById(id)
            .populate({path: "user", select: "first_name last_name"});
        if (!book) {
            return res.status(404).json({
                message: `Book with id ${id} not found`
            })
        }
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
        const {id} = req.params;
        const book = await Book.findOne({_id: id, user: req.user._id});
        if (!book) {
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