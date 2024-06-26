import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    publisher: {
        type: String,
        required: true,
        trim: true,
    },
    publishing_year: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        enum: ['FICTION', 'NON-FICTION'],
        required: true,
    },
    authors: {
        type: [String],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    is_published: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    toJSON: {virtuals: true},
    toObject: {virtuals: true},

});

bookSchema.index({title: 'text'});

const Book = mongoose.model('Book', bookSchema);
export default Book;