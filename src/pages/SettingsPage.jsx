// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import SecurityIcon from '@mui/icons-material/Security';
import AppHeader from '../components/layout/AppHeader';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [language, setLanguage] = useState(i18n.language || 'he');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    currentUser?.profile?.preferences?.notificationPreferences?.push || false
  );
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(
    currentUser?.profile?.preferences?.notificationPreferences?.email || false
  );
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);

    // Save user preference
    if (currentUser) {
      updateUserPreferences();
    }
  };

  // Update user preferences in Firestore
  const updateUserPreferences = async () => {
    try {
      if (!currentUser) return;

      await userService.updatePreferences(currentUser.uid, {
        notificationPreferences: {
          push: notificationsEnabled,
          email: emailNotificationsEnabled,
          sms: false, // Not implemented yet
        },
        language: language,
        theme: darkModeEnabled ? 'dark' : 'light',
        offlineMode: offlineModeEnabled,
      });

      setSuccessMessage('Settings updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      setErrorMessage('Failed to update settings. Please try again.');
    }
  };

  // Handle toggle changes
  const handleNotificationsToggle = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleEmailNotificationsToggle = () => {
    setEmailNotificationsEnabled((prev) => !prev);
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled((prev) => !prev);
  };

  const handleOfflineModeToggle = () => {
    setOfflineModeEnabled((prev) => !prev);
  };

  // Save all settings
  const handleSaveSettings = () => {
    updateUserPreferences();
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
          Settings
        </Typography>
        <Divider />
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Application Settings
        </Typography>

        <List sx={{ width: '100%' }}>
          {/* Language setting */}
          <ListItem>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Language"
              secondary="Select your preferred language"
            />
            <ListItemSecondaryAction>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  displayEmpty
                >
                  <MenuItem value="he">עברית</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* Push notifications setting */}
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive alerts for medication reminders"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationsEnabled}
                onChange={handleNotificationsToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* Email notifications setting */}
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive email alerts for important updates"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={emailNotificationsEnabled}
                onChange={handleEmailNotificationsToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* Dark mode setting */}
          <ListItem>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dark Mode"
              secondary="Toggle dark theme for the application"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={darkModeEnabled}
                onChange={handleDarkModeToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* Offline mode setting */}
          <ListItem>
            <ListItemIcon>
              <DataSaverOffIcon />
            </ListItemIcon>
            <ListItemText
              primary="Offline Mode"
              secondary="Access your data when offline"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={offlineModeEnabled}
                onChange={handleOfflineModeToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* Security setting - placeholder */}
          <ListItem
            button
            onClick={() => alert('Security settings coming soon')}
          >
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Security Settings"
              secondary="Manage security and privacy options"
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>

      {/* Version information */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Application Version: 1.0.0
        </Typography>
        <Typography variant="body2" color="text.secondary">
          © 2025 תרופתי - All Rights Reserved
        </Typography>
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

export default SettingsPage;
