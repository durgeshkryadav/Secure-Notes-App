import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import {
  LogoutOutlined,
  DeleteOutline,
  AddOutlined,
  NoteOutlined,
  SearchOutlined,
  AccountCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/auth.slice';
import {
  fetchNotes,
  createNote,
  deleteNote,
  clearNotesError,
  getDecryptedContent,
} from '../../redux/slices/notes.slice';
import { formatDate, truncateText } from '../../utils/helpers';
import { ROUTES } from '../../constants';
import { Note } from '../../interface/notes.interface';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notes, loading, error } = useAppSelector((state) => state.notes);

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
  });
  const [validationError, setValidationError] = useState('');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notes on mount
  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  // Clear errors
  useEffect(() => {
    return () => {
      dispatch(clearNotesError());
    };
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNote((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const validateNewNote = (): boolean => {
    if (!newNote.title.trim()) {
      setValidationError('Title is required');
      return false;
    }
    if (!newNote.content.trim()) {
      setValidationError('Content is required');
      return false;
    }
    if (newNote.title.length > 200) {
      setValidationError('Title must be less than 200 characters');
      return false;
    }
    return true;
  };

  const handleAddNote = async () => {
    if (!validateNewNote()) {
      return;
    }

    try {
      await dispatch(createNote(newNote)).unwrap();
      setNewNote({ title: '', content: '' });
      setValidationError('');
      setAddNoteDialogOpen(false);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const handleOpenAddDialog = () => {
    setAddNoteDialogOpen(true);
    setValidationError('');
    setNewNote({ title: '', content: '' });
  };

  const handleCloseAddDialog = () => {
    setAddNoteDialogOpen(false);
    setValidationError('');
    setNewNote({ title: '', content: '' });
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await dispatch(deleteNote(noteId)).unwrap();
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  const handleViewNote = (noteId: string) => {
    setSelectedNote(noteId);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedNote(null);
  };

  const getSelectedNoteData = () => {
    if (!selectedNote) return null;
    return notes.find((note) => note._id === selectedNote);
  };

  const selectedNoteData = getSelectedNoteData();

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery) return true;
    const decryptedContent = getDecryptedContent(note.content);
    return (
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decryptedContent.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <NoteOutlined sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Secure Notes
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutOutlined />}
            endIcon={<AccountCircle sx={{ fontSize: 32 }} />}
            onClick={handleLogout}
            sx={{ textTransform: 'none' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearNotesError())}>
            {error}
          </Alert>
        )}

        {/* Action Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={handleOpenAddDialog}
            sx={{ textTransform: 'none' }}
          >
            Add Note
          </Button>
          <TextField
            placeholder="Search"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        {/* Notes List */}
        <Box>
          {loading && notes.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredNotes.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Click "Add Note" to create your first secure note!'}
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredNotes.map((note: Note) => {
                let decryptedContent = '';
                try {
                  decryptedContent = getDecryptedContent(note.content);
                } catch (err) {
                  decryptedContent = 'Unable to decrypt';
                }

                return (
                  <Paper
                    key={note._id}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 3,
                      },
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                    onClick={() => handleViewNote(note._id)}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {note.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {truncateText(decryptedContent, 80)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note._id);
                      }}
                      disabled={loading}
                      sx={{ ml: 2 }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Box>
      </Container>

      {/* Add Note Dialog */}
      <Dialog
        open={addNoteDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Note</DialogTitle>
        <DialogContent>
          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={newNote.title}
            onChange={handleInputChange}
            margin="normal"
            disabled={loading}
            autoFocus
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={newNote.content}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={6}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddNote}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddOutlined />}
          >
            {loading ? 'Adding...' : 'Add Note'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedNoteData && (
          <>
            <DialogTitle>{selectedNoteData.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                {getDecryptedContent(selectedNoteData.content)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Created: {formatDate(selectedNoteData.createdAt)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Updated: {formatDate(selectedNoteData.updatedAt)}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                color="error"
                startIcon={<DeleteOutline />}
                onClick={() => {
                  handleDeleteNote(selectedNoteData._id);
                  handleCloseDialog();
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Dashboard;
