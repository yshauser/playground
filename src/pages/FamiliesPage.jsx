// src/pages/FamiliesPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AppHeader from '../components/layout/AppHeader';

const FamiliesPage = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <AppHeader />

      <Box
        sx={{
          mt: 4,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          {t('dashboard.families')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Create family dialog will open here')}
        >
          Add Family
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          No families yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start by creating a family to manage medications for your loved ones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Create family dialog will open here')}
        >
          Create Your First Family
        </Button>
      </Paper>
    </Box>
  );
};

export default FamiliesPage;
