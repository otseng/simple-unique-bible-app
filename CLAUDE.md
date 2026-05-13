# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js React application that serves as a GUI viewer for the Unique Bible App (UBA). It communicates with a Python backend API server to retrieve biblical content including Bibles, commentaries, devotionals, books, and cross-references.

## Development Commands

### Install dependencies
```bash
yarn
```

### Run development server
```bash
yarn run dev
```
This starts the Next.js development server on http://localhost:3000/

### Build for production
```bash
yarn run build
```

### Export static site
```bash
yarn run export
```

### Run production server
```bash
yarn run start
```

### Type checking
```bash
yarn run typecheck
```

## Backend API Setup

The application requires the Unique Bible App (UBA) backend to be running in API server mode:
1. Install UBA from https://github.com/eliranwong/UniqueBible
2. Start UBA in API server mode: `python3 uba.py api-server`
3. Verify API server works: http://localhost:8080/bible

## Code Architecture

### Core Technologies
- Next.js 15.x (React framework)
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for HTTP requests
- SWR for data fetching and caching
- React Context for state management (language, theme)

### Key Components
- `pages/` - Next.js pages routing system
- `components/` - Reusable React components
- `lib/` - Utility functions and API integration
- `lang/` - Internationalization support
- `theme/` - Theme management
- `data/` - Static data files

### API Integration
- All API calls are in `lib/api.ts`
- Uses SWR for data fetching with automatic caching
- Communicates with UBA backend via REST API
- Authentication uses a dynamically generated password based on month

### State Management
- Language context in `lang/langContext.tsx`
- Theme context in `theme/themeContext.tsx`
- Local storage for bookmarks, settings, and preferences

### Routing
- File-based routing through Next.js pages directory
- Dynamic routes for Bible books, chapters, commentaries, etc.
- Main sections: Bibles, Books, Commentaries, Devotionals

## Deployment Process

### Production Build
1. `yarn`
2. `yarn run build`
3. `yarn run export`

### Server Deployment
1. `git pull`
2. `yarn`
3. `yarn run build`
4. Kill existing Next.js processes with `./kill-next.sh`
5. Start server with `yarn run start`