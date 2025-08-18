import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    category: {
        type: String,
        enum: ['feedback', 'feature', 'bug', 'improvement', 'question'],
        default: 'feedback',
    },
}, {
    timestamps: true,
});

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);

export default Board;