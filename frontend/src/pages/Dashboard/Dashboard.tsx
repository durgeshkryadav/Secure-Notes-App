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
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LogoutOutlined,
  DeleteOutline,
  AddOutlined,
  NoteOutlined,
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
  const { user } = useAppSelector((state) => state.auth);
  const { notes, loading, error } = useAppSelector((state) => state.notes);

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
  });
  const [validationError, setValidationError] = useState('');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

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
    } catch (err) {
      console.error('Failed to create note:', err);
    }
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
    return notes.find((note: Note) => note._id === selectedNote);
  };

  const selectedNoteData = getSelectedNoteData();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <NoteOutlined sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Secure Notes
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearNotesError())}>
            {error}
          </Alert>
        )}

        {/* Add Note Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Create New Note
          </Typography>
          
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
          />

          <TextField
            fullWidth
            label="Content"
            name="content"
            value={newNote.content}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
            disabled={loading}
          />

          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={handleAddNote}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Note'}
          </Button>
        </Paper>

        {/* Notes List */}
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            My Notes ({notes.length})
          </Typography>

          {loading && notes.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : notes.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No notes yet. Create your first secure note above!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {notes.map((note: Note) => {
                let decryptedContent = '';
                try {
                  decryptedContent = getDecryptedContent(note.content);
                } catch (err) {
                  decryptedContent = 'Unable to decrypt';
                }

                return (
                  <Grid item xs={12} sm={6} md={4} key={note._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 6,
                        },
                      }}
                      onClick={() => handleViewNote(note._id)}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom noWrap>
                          {note.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {truncateText(decryptedContent, 100)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(note.createdAt)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note._id);
                          }}
                          disabled={loading}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Container>

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
