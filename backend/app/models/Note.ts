import { Document, model, Schema, Types } from 'mongoose';

export interface INote extends Document {
    userId: Types.ObjectId;
    title: string;
    content: string; // Stored as encrypted string
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema = new Schema<INote>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            // Content is stored as encrypted string from frontend
            // No length limit as encryption increases size
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Compound index for efficient querying of user's notes
noteSchema.index({ userId: 1, createdAt: -1 });

// Index for text search on title
noteSchema.index({ title: 'text' });

const Note = model<INote>('Note', noteSchema, 'notes');

export { Note };
