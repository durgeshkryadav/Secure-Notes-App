import { INote, Note } from '@models/Note';
import { FilterQuery, UpdateQuery, Types } from 'mongoose';

export default class NotesService {
    /**
     * Create a new note
     */
    static async create(noteData: Partial<INote>): Promise<INote> {
        const note = new Note(noteData);
        return await note.save();
    }

    /**
     * Find note by ID
     */
    static async readById(id: string, selectFields: any = {}): Promise<INote | null> {
        return Note.findById(id, selectFields).select('-__v').exec();
    }

    /**
     * Update note by ID
     */
    static async updateById(noteId: string, noteFields: UpdateQuery<INote>): Promise<INote | null> {
        return await Note.findByIdAndUpdate(noteId, noteFields, { new: true, runValidators: true }).exec();
    }

    /**
     * Delete note by ID
     */
    static async deleteById(id: string): Promise<INote | null> {
        return Note.findByIdAndDelete(id).exec();
    }

    /**
     * Find one note by query
     */
    static async findOne(query: FilterQuery<INote>, selectFields: any = {}): Promise<INote | null> {
        return Note.findOne(query, selectFields).exec();
    }

    /**
     * Find all notes for a user
     */
    static async findByUserId(userId: string | Types.ObjectId, selectFields: any = {}): Promise<INote[]> {
        return Note.find({ userId }, selectFields)
            .select('-__v')
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Search notes by title for a specific user
     */
    static async searchByTitle(userId: string | Types.ObjectId, searchTerm: string): Promise<INote[]> {
        return Note.find({
            userId,
            title: { $regex: searchTerm, $options: 'i' },
        })
            .select('-__v')
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Count notes for a user
     */
    static async countByUserId(userId: string | Types.ObjectId): Promise<number> {
        return Note.countDocuments({ userId }).exec();
    }

    /**
     * Get paginated notes for a user
     */
    static async getPaginatedNotes(
        userId: string | Types.ObjectId,
        page: number = 1,
        limit: number = 10
    ): Promise<{ notes: INote[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        const [notes, total] = await Promise.all([
            Note.find({ userId })
                .select('-__v')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            Note.countDocuments({ userId }).exec(),
        ]);

        return {
            notes,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
}
