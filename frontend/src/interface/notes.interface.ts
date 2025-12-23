export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string; // Encrypted content
  createdAt: string;
  updatedAt: string;
}

export interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  total: number;
}

export interface CreateNoteRequest {
  title: string;
  content: string; // Pre-encrypted
}

export interface NotesResponse {
  success: boolean;
  message: string;
  data: {
    notes: Note[];
    total: number;
  };
}

export interface CreateNoteResponse {
  success: boolean;
  message: string;
  data: Note;
}

export interface DeleteNoteResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
  };
}
