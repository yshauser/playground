# תרופתי (MediTrack) - Medication Management App

A comprehensive medication management application built with React, Firebase, and Material UI. The app helps families track and manage medications for all family members with easy-to-use interfaces and smart reminders.

## Features

- User authentication and profile management
- Family and family member management
- Medication management with dosage tracking
- Prescription management
- Medication logs and reminders
- Multi-language support (Hebrew/English)
- RTL layout optimization
- Offline capabilities with PWA support
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v20.9.0 or higher)
- npm (v10.1.0 or higher)
- Firebase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yshauser/medication-manager.git
cd medication-manager
```

2. Install dependencies

```bash
npm install
```

3. Create a Firebase project

   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Set up Firestore database
   - Set up Authentication with email/password provider
   - Get your Firebase configuration

4. Update Firebase configuration
   - Copy the example environment file to create your own local .env file:
   ```bash
   cp .env.example .env
   ```
   - Open the `.env` file and replace the placeholder values with your Firebase configuration

5. Start the development server

```bash
npm run dev
```

## Project Structure

```
medication-manager/
├── public/               # Static files
├── src/
│   ├── components/       # Reusable components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Common UI components
│   │   └── layout/       # Layout components
│   ├── contexts/         # React context providers
│   ├── services/         # Firebase services
│   ├── pages/            # Application pages
│   ├── i18n/             # Internationalization
│   │   └── locales/      # Translation files
│   ├── utils/            # Utility functions
│   ├── App.jsx           # App component
│   ├── firebase.js       # Firebase configuration
│   ├── main.jsx          # Application entry point
│   └── theme.js          # Material UI theme
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Development Roadmap

- [x] Phase 1: Authentication & User Management
- [ ] Phase 2: Family & Member Management
- [ ] Phase 3: Medication Management
- [ ] Phase 4: Medication Logs & Monitoring
- [ ] Phase 5: Notifications & Offline Support
- [ ] Phase 6: Internationalization & Polishing
- [ ] Phase 7: Testing & Deployment

## Deployment

To deploy to GitHub Pages:

```bash
npm run deploy
```

## Built With

- [React](https://reactjs.org/) - Frontend library
- [Vite](https://vitejs.dev/) - Build tool
- [Firebase](https://firebase.google.com/) - Backend and authentication
- [Material UI](https://mui.com/) - UI components
- [React Router](https://reactrouter.com/) - Routing
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [i18next](https://www.i18next.com/) - Internationalization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as part of the medication management system implementation plan.
