# OrderIQ — Frontend

React + Vite frontend for the OrderIQ food ordering platform.

## Stack

- **React 19** + **Vite**
- **Tailwind CSS** — styling
- **Framer Motion** — animations
- **React Router v7** — routing
- **Firebase** — authentication
- **Axios** — API calls
- **Socket.io Client** — real-time order updates
- **Lucide React** — icons
- **React Hot Toast** — notifications

## Setup

```bash
npm install
```

Create `.env` in this directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (port 5173) |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
