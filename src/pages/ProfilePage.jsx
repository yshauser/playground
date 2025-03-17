// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Tab,
  Tabs,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import AppHeader from '../components/layout/AppHeader';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

// Custom styled components
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  margin: 'auto',
  border: `3px solid ${theme.palette.primary.main}`,
}));

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form for personal information
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: currentUser?.profile?.firstName || '',
      lastName: currentUser?.profile?.lastName || '',
      email: currentUser?.email || '',
      mobile: currentUser?.profile?.mobile || '',
    },
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle profile update
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // Update user profile in Firestore
      await userService.updateProfile(currentUser.uid, {
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobile,
      });

      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(
        error.message || 'An error occurred while updating your profile'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser?.profile?.firstName || !currentUser?.profile?.lastName)
      return '?';
    return `${currentUser.profile.firstName[0]}${currentUser.profile.lastName[0]}`.toUpperCase();
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Box>
      <AppHeader />

      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        <Divider />
      </Box>

      <Paper elevation={3} sx={{ p: 0, mb: 4, borderRadius: 2 }}>
        {/* Profile header with avatar */}
        <Box
          sx={{ bgcolor: 'primary.light', p: 3, borderRadius: '8px 8px 0 0' }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                {currentUser?.profile?.profileImageUrl ? (
                  <ProfileAvatar
                    src={currentUser.profile.profileImageUrl}
                    alt={currentUser.displayName}
                  />
                ) : (
                  <ProfileAvatar sx={{ bgcolor: 'secondary.main' }}>
                    {getUserInitials()}
                  </ProfileAvatar>
                )}
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.default' },
                  }}
                  size="small"
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={10}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                {currentUser?.displayName || 'User Profile'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
                {currentUser?.email}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Profile tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab label="Personal Information" />
            <Tab label="Security" />
            <Tab label="Preferences" />
          </Tabs>
        </Box>

        {/* Personal Information tab */}
        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  variant="outlined"
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  disabled
                  {...register('email')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile Phone"
                  fullWidth
                  variant="outlined"
                  {...register('mobile')}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Security tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            For security reasons, you'll need to enter your current password to
            make any changes.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button variant="contained" color="primary">
                Update Password
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Preferences tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>

          <Typography variant="body2" sx={{ mb: 3 }}>
            Coming soon: Control how and when you receive notifications.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Language Preferences
          </Typography>

          <Typography variant="body2" sx={{ mb: 3 }}>
            Coming soon: Change application language and regional settings.
          </Typography>
        </TabPanel>
      </Paper>

      {/* Success and error messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
