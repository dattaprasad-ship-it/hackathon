# HR Management System - Frontend

React + TypeScript + Vite frontend application for HR Management System.

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
# or
npm install
```

### Development

```bash
# Start development server
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
pnpm build
# or
npm run build
```

### Testing

```bash
# Run tests
pnpm test
# or
npm run test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Project Structure

```
frontend/
├── src/
│   ├── features/          # Feature modules
│   │   └── authentication/
│   ├── components/         # Shared components
│   ├── routes/            # Route configuration
│   ├── store/             # State management
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main app component
├── public/                # Static assets
└── index.html             # HTML entry point
```

