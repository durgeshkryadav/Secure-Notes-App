import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, clearError } from '../../redux/slices/auth.slice';
import { isValidEmail } from '../../utils/helpers';
import { ROUTES } from '../../constants';
import { Footer } from '../../components';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    setValidationErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // Error is handled by Redux slice
      console.error('Login error:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container component="main" maxWidth="xs" sx={{ flex: 1 }}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Secure Notes
          </Typography>

          <Box sx={{ display: 'flex', mb: 3, width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeft: 'none',
              }}
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Register
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Email
            </Typography>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={loading}
              size="small"
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Password
            </Typography>
            <TextField
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              disabled={loading}
              size="small"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2, py: 1.2, textTransform: 'none', fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                type="button"
                sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.secondary' }}
              >
                Forgot password?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Login;
