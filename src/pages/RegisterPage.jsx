// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Watch password field for confirmation validation
  const password = watch('password', '');

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);

      // Register using Firebase auth and create user profile
      await signup(data.email, data.password, data.firstName, data.lastName);

      // Redirect to dashboard after successful registration
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Registration error:', error);

      // Map Firebase error codes to user-friendly messages
      let errorMessage = t('errors.generic');

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = t('errors.auth.emailInUse');
          break;
        case 'auth/invalid-email':
          errorMessage = t('errors.auth.invalidEmail');
          break;
        case 'auth/weak-password':
          errorMessage = t('errors.auth.weakPassword');
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
            <PersonAddIcon />
          </Box>
          <Typography component="h1" variant="h5">
            {t('auth.register')}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('auth.firstName')}
                fullWidth
                autoFocus
                {...register('firstName', {
                  required: t('validation.required'),
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={t('auth.lastName')}
                fullWidth
                {...register('lastName', {
                  required: t('validation.required'),
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
          </Grid>

          <TextField
            label={t('auth.email')}
            type="email"
            fullWidth
            margin="normal"
            autoComplete="email"
            {...register('email', {
              required: t('validation.required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('validation.email'),
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label={t('auth.password')}
            type="password"
            fullWidth
            margin="normal"
            {...register('password', {
              required: t('validation.required'),
              minLength: {
                value: 6,
                message: t('validation.passwordLength'),
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            label={t('auth.confirmPassword')}
            type="password"
            fullWidth
            margin="normal"
            {...register('passwordConfirm', {
              required: t('validation.required'),
              validate: (value) =>
                value === password || t('validation.passwordMatch'),
            })}
            error={!!errors.passwordConfirm}
            helperText={errors.passwordConfirm?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.signUp')}
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  {t('auth.alreadyHaveAccount')}
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

export default RegisterPage;
