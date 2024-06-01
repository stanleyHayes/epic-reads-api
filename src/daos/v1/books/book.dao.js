import Book from "../../../models/v1/book.model.js";

const createBook = async (book) => {

}

/**
 * Retrieves a book from the database based on the provided query and projection.
 * @param {Object} query - The query object to filter the book.
 * @param {Object} projection - The projection object to specify which fields to include or exclude.
 * @returns {Promise<Object>} A promise that resolves to an object containing the result of the operation.
 *                              - If the book is found, returns an object with success set to true, the book data, and HTTP status code 200.
 *                              - If the book is not found, returns an object with success set to false, data set to null, and HTTP status code 404.
 */
const getBook = async (query, projection) => {
    const book = await Book.findOne(query, projection);
    if (!book) {
        return {
            success: false,
            data: null,
            code: 404
        }
    }
    return {
        success: true,
        data: book,
        code: 200
    }
}

const deleteBook = async (bookId) => {

}

const updateBook = async (bookId) => {

}

export default {getBook}