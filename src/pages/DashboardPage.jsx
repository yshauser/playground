// src/pages/DashboardPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from '@mui/material';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import MedicationIcon from '@mui/icons-material/Medication';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AppHeader from '../components/layout/AppHeader';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  // Dashboard cards
  const dashboardCards = [
    {
      title: t('dashboard.families'),
      icon: <FamilyRestroomIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      description: 'Manage your families and their members',
      path: '/families',
    },
    {
      title: t('dashboard.medications'),
      icon: <MedicationIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      description: 'Manage medications and prescriptions',
      path: '/medications',
    },
    {
      title: t('dashboard.members'),
      icon: <PersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      description: 'Manage family members and their health information',
      path: '/members',
    },
    {
      title: t('dashboard.reminders'),
      icon: (
        <NotificationsActiveIcon sx={{ fontSize: 60, color: 'primary.main' }} />
      ),
      description: 'Set up medication reminders and notifications',
      path: '/reminders',
    },
  ];

  return (
    <Box>
      <AppHeader />

      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('dashboard.welcome', {
            name: currentUser?.displayName?.split(' ')[0] || '',
          })}
        </Typography>
        <Divider />
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {dashboardCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition:
                  'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ mb: 2 }}>{card.icon}</Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to={card.path}
                  fullWidth
                  variant="contained"
                >
                  Go to {card.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent activities placeholder */}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Recent Activities
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Your recent medication activities will appear here.
        </Typography>
      </Paper>

      {/* Upcoming reminders placeholder */}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Upcoming Reminders
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Your upcoming medication reminders will appear here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
