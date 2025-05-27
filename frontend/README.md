# Doctor Booking System - Frontend

This is the frontend for the Doctor Booking System, built with React, TypeScript, and Vite. It provides a modern, responsive interface for patients and doctors to manage appointments.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- Backend server (see backend README for setup)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd go-doctor-booking/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend root directory with the following variables:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Application entry point
├── .eslintrc.cjs         # ESLint configuration
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Features

- **User Authentication**
  - Login/Registration
  - Protected routes
  - Role-based access control

- **Patient Features**
  - Browse available doctors
  - Book appointments
  - View and manage appointments
  - View medical history

- **Doctor Features**
  - Manage availability
  - View and update appointments
  - Access patient information

## Styling

This project uses Tailwind CSS for styling. The configuration can be found in `tailwind.config.js`.

## Linting and Formatting

- ESLint is used for code linting
- Prettier is used for code formatting
- Run `npm run lint` to check for linting errors
- Run `npm run format` to format the code

## Testing

To run tests:
```bash
npm test
```

## Building for Production

To create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

For deployment, you can use platforms like Vercel, Netlify, or any static hosting service. Make sure to set up the correct environment variables in your deployment environment.

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
