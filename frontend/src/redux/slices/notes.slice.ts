import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { API_ENDPOINTS } from '../../constants';
import { encryptText, decryptText } from '../../utils/encryption';
import {
  NotesState,
  Note,
  CreateNoteRequest,
  NotesResponse,
  CreateNoteResponse,
  DeleteNoteResponse,
} from '../../interface/notes.interface';

// Initial state
const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
  total: 0,
};

// Async thunks
export const fetchNotes = createAsyncThunk<
  { notes: Note[]; total: number },
  void,
  { rejectValue: string }
>('notes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<NotesResponse>(API_ENDPOINTS.NOTES);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to fetch notes');
  }
});

export const createNote = createAsyncThunk<
  Note,
  { title: string; content: string },
  { rejectValue: string }
>('notes/create', async ({ title, content }, { rejectWithValue }) => {
  try {
    // Encrypt content before sending
    const encryptedContent = encryptText(content);
    
    const noteData: CreateNoteRequest = {
      title,
      content: encryptedContent,
    };
    
    const response = await axios.post<CreateNoteResponse>(API_ENDPOINTS.NOTES, noteData);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to create note');
  }
});

export const deleteNote = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('notes/delete', async (noteId, { rejectWithValue }) => {
  try {
    await axios.delete<DeleteNoteResponse>(API_ENDPOINTS.NOTE_BY_ID(noteId));
    return noteId;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to delete note');
  }
});

// Notes slice
const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearNotesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch notes
    builder.addCase(fetchNotes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotes.fulfilled, (state, action: PayloadAction<{ notes: Note[]; total: number }>) => {
      state.loading = false;
      state.notes = action.payload.notes;
      state.total = action.payload.total;
      state.error = null;
    });
    builder.addCase(fetchNotes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch notes';
    });

    // Create note
    builder.addCase(createNote.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createNote.fulfilled, (state, action: PayloadAction<Note>) => {
      state.loading = false;
      state.notes.unshift(action.payload);
      state.total += 1;
      state.error = null;
    });
    builder.addCase(createNote.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create note';
    });

    // Delete note
    builder.addCase(deleteNote.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteNote.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.notes = state.notes.filter(note => note._id !== action.payload);
      state.total -= 1;
      state.error = null;
    });
    builder.addCase(deleteNote.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete note';
    });
  },
});

export const { clearNotesError } = notesSlice.actions;
export default notesSlice.reducer;

// Helper function to decrypt notes (to be used in components)
export const getDecryptedContent = (encryptedContent: string): string => {
  try {
    return decryptText(encryptedContent);
  } catch (error) {
    return 'Unable to decrypt content';
  }
};
