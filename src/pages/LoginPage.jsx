// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Divider,
  Paper
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get the page the user was trying to access (for redirection after login)
  const from = location.state?.from || '/dashboard';
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      
      // Login using Firebase auth
      await login(data.email, data.password);
      
      // Redirect to original destination (or dashboard)
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      
      // Map Firebase error codes to user-friendly messages
      let errorMessage = t('errors.generic');
      
      switch(error.code) {
        case 'auth/user-not-found':
          errorMessage = t('errors.auth.userNotFound');
          break;
        case 'auth/wrong-password':
          errorMessage = t('errors.auth.wrongPassword');
          break;
        case 'auth/invalid-email':
          errorMessage = t('errors.auth.invalidEmail');
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 'sm',
          width: '100%',
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5">
            {t('auth.login')}
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label={t('auth.email')}
            type="email"
            fullWidth
            margin="normal"
            autoComplete="email"
            autoFocus
            {...register('email', { 
              required: t('validation.required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('validation.email')
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          
          <TextField
            label={t('auth.password')}
            type="password"
            fullWidth
            margin="normal"
            autoComplete="current-password"
            {...register('password', { 
              required: t('validation.required'),
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.signIn')}
          </Button>
          
          <Grid container>
            <Grid item xs>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  {t('auth.forgotPassword')}
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  {t('auth.dontHaveAccount')}
                </Typography>
              </Link>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                {t('app.name')}
              </Typography>
            </Divider>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;