import { IUser, User } from '@models/User';
import { FilterQuery, UpdateQuery } from 'mongoose';

export default class UserService {
    /**
     * Create a new user
     */
    static async create(userData: Partial<IUser>): Promise<IUser> {
        const user = new User(userData);
        return await user.save();
    }

    /**
     * Find user by ID
     */
    static async readById(id: string, selectFields: any = {}): Promise<IUser | null> {
        return User.findById(id, selectFields).select('-__v').exec();
    }

    /**
     * Update user by ID
     */
    static async updateById(userId: string, userFields: UpdateQuery<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, userFields, { new: true, runValidators: true }).exec();
    }

    /**
     * Delete user by ID
     */
    static async deleteById(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id).exec();
    }

    /**
     * Find one user by query
     */
    static async findOne(query: FilterQuery<IUser>, selectFields: any = {}): Promise<IUser | null> {
        return User.findOne(query, selectFields).exec();
    }

    /**
     * Find user by email (with password for login)
     */
    static async findByEmailWithPassword(email: string): Promise<IUser | null> {
        return User.findOne({ email }).select('+password').exec();
    }

    /**
     * Check if email exists
     */
    static async emailExists(email: string): Promise<boolean> {
        const user = await User.findOne({ email }).exec();
        return !!user;
    }
}
