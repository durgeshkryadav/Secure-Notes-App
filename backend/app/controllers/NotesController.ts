import { RESPONSE_CODE, RESPONSE_FAILURE, RESPONSE_SUCCESS } from '@common/Constants';
import { IAuthRequest } from '@common/interfaces/IAuthRequest';
import { locale } from '@config/locales';
import { sendResponse } from '@utils/common';
import { logger } from '@utils/logger';
import { isObjectId } from '@utils/util';
import type { Response } from 'express';
import NotesService from '@services/NotesService';
import { Types } from 'mongoose';

class NotesController {
    /**
     * Get all notes for authenticated user
     * GET /api/notes
     * Supports optional search query parameter
     */
    static async getAllNotes(req: IAuthRequest, res: Response) {
        try {
            const userId = req.user?._id;

            if (!userId) {
                return sendResponse(
                    res,
                    undefined,
                    locale('USER_NOT_FOUND'),
                    RESPONSE_FAILURE,
                    RESPONSE_CODE.UNAUTHORISED
                );
            }

            const { search, page, limit } = req.query;

            let notes;

            // Handle search functionality
            if (search && typeof search === 'string') {
                notes = await NotesService.searchByTitle(userId, search);
            } 
            // Handle pagination
            else if (page && limit) {
                const pageNum = parseInt(page as string) || 1;
                const limitNum = parseInt(limit as string) || 10;
                const result = await NotesService.getPaginatedNotes(userId, pageNum, limitNum);
                
                return sendResponse(
                    res,
                    result,
                    locale('NOTES_FETCHED'),
                    RESPONSE_SUCCESS,
                    RESPONSE_CODE.SUCCESS
                );
            }
            // Default: get all notes
            else {
                notes = await NotesService.findByUserId(userId);
            }

            logger.info(`Fetched ${notes.length} notes for user: ${req.user?.email}`);

            return sendResponse(
                res,
                { notes, total: notes.length },
                locale('NOTES_FETCHED'),
                RESPONSE_SUCCESS,
                RESPONSE_CODE.SUCCESS
            );
        } catch (error: any) {
            logger.error(`Error fetching notes: ${error.message}`);
            return sendResponse(
                res,
                undefined,
                locale('SERVER_ERROR'),
                RESPONSE_FAILURE,
                RESPONSE_CODE.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Create a new note
     * POST /api/notes
     */
    static async createNote(req: IAuthRequest, res: Response) {
        try {
            const userId = req.user?._id;

            if (!userId) {
                return sendResponse(
                    res,
                    undefined,
                    locale('USER_NOT_FOUND'),
                    RESPONSE_FAILURE,
                    RESPONSE_CODE.UNAUTHORISED
                );
            }

            const { title, content } = req.body;

            // Create note with encrypted content (content is already encrypted from frontend)
            const note = await NotesService.create({
                userId: new Types.ObjectId(userId),
                title,
                content, // Stored as-is (encrypted from frontend)
            });

            logger.info(`Note created by user: ${req.user?.email}`);

            return sendResponse(
                res,
                {
                    _id: note._id,
                    title: note.title,
                    content: note.content,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt,
                },
                locale('NOTE_CREATED'),
                RESPONSE_SUCCESS,
                RESPONSE_CODE.CREATED
            );
        } catch (error: any) {
            logger.error(`Error creating note: ${error.message}`);
            return sendResponse(
                res,
                undefined,
                locale('NOTE_CREATE_FAILED'),
                RESPONSE_FAILURE,
                RESPONSE_CODE.BAD_REQUEST
            );
        }
    }

    /**
     * Delete a note by ID
     * DELETE /api/notes/:id
     */
    static async deleteNote(req: IAuthRequest, res: Response) {
        try {
            const userId = req.user?._id;
            const noteId = req.params.id;

            if (!userId) {
                return sendResponse(
                    res,
                    undefined,
                    locale('USER_NOT_FOUND'),
                    RESPONSE_FAILURE,
                    RESPONSE_CODE.UNAUTHORISED
                );
            }

            // Validate note ID format
            if (!isObjectId(noteId)) {
                return sendResponse(
                    res,
                    undefined,
                    locale('NOTE_NOT_FOUND'),
                    RESPONSE_FAILURE,
                    RESPONSE_CODE.BAD_REQUEST
                );
            }

            // Find note and verify ownership
            const note = await NotesService.readById(noteId);

            if (!note) {
                return sendResponse(
                    res,
                    undefined,
                    locale('NOTE_NOT_FOUND'),
                    RESPONSE_FAILURE,
                    RESPONSE_CODE.NOT_FOUND
                );
            }

            // Check if note belongs to the authenticated user
            if (note.userId.toString() !== userId.toString()) {
                return sendResponse(
                    res,
                    undefined,
                    locale('UNAUTHORIZED_NOTE_ACCESS'),
                    RESPONSE_FAILURE,
                    RESPONSE_CODE.FORBIDDEN
                );
            }

            // Delete the note
            await NotesService.deleteById(noteId);

            logger.info(`Note deleted by user: ${req.user?.email}`);

            return sendResponse(
                res,
                { _id: noteId },
                locale('NOTE_DELETED'),
                RESPONSE_SUCCESS,
                RESPONSE_CODE.SUCCESS
            );
        } catch (error: any) {
            logger.error(`Error deleting note: ${error.message}`);
            return sendResponse(
                res,
                undefined,
                locale('NOTE_DELETE_FAILED'),
                RESPONSE_FAILURE,
                RESPONSE_CODE.INTERNAL_SERVER_ERROR
            );
        }
    }
}

export default NotesController;
