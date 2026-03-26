[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lens-ltd/lens-music)

# Lens Music Monorepo

Lens Music is a music distribution platform monorepo containing the web client and backend API used to manage releases, tracks, contributors, lyrics, labels, stores, and authentication workflows.

## Application Overview

This repository combines a React/Vite single-page application in `client/` with a NestJS API in `api/`. The codebase supports an authenticated workspace for release preparation, catalog management, invitations and user access, and supporting distribution-related metadata workflows.

The repository also includes supporting infrastructure for media uploads, transactional email, seeded development data, and an in-progress DDEX delivery surface.

## Key Capabilities

- User authentication, invitations, invitation approval/revocation, and password reset flows
- Release creation and editing, including overview metadata, territories, genres, cover art, validation, and submission
- Track management, including metadata editing, audio upload/registration, and track validation
- Contributor, contributor membership, release contributor, and track contributor management
- Lyrics creation, listing, editing, deletion, and lyric synchronization flows
- Label, store, release label, related release, deal, and territory detail management
- Dashboard screens for streams, downloads, revenue, territories, platform mix, and recent releases

## Monorepo Architecture

### Client

The frontend in `client/` is a React 18 application built with Vite and TypeScript. It uses React Router for public and authenticated routes, Redux Toolkit for client state, and RTK Query for API reads and writes. The routed surfaces in the repo include:

- Landing and authentication pages
- Dashboard
- Releases and release wizard flows
- Tracks
- Contributors
- Lyrics
- Labels
- Stores
- Roles and users

### API

The backend in `api/` is a NestJS application with TypeORM and PostgreSQL. It exposes domain modules for:

- Auth and users
- Releases and release navigation flows
- Tracks and track contributors
- Release contributors
- Contributors and contributor memberships
- Lyrics
- Labels
- Stores
- Roles and permissions
- Genres
- Deals
- Release labels
- Release territory details
- Related releases

The API uses JWT-based authentication, request validation, and entity-backed persistence.

### Supporting Services

- Cloudinary-backed upload services are used for release cover art and track audio handling
- Resend-backed email delivery is used for invitation and password reset emails
- Seed scripts are available for development data bootstrap
- A DDEX module exists in the backend, but the ERN generation/delivery flow is still placeholder/incomplete in the current repo

### Notes On Current Implementation

- The dashboard currently uses static/sample data defined in the client codebase rather than documented live reporting integrations
- DDEX structures and related fields exist in the repo, but end-to-end delivery, validation, and batching are not implemented here

## Tech Stack

### Client

- React 18
- Vite
- TypeScript
- Redux Toolkit and RTK Query
- React Router
- Tailwind CSS

### API

- NestJS
- TypeORM
- PostgreSQL
- JWT authentication
- class-validator / class-transformer

### Supporting Tooling

- Cloudinary for media upload flows
- Resend for email delivery
- Nodemon and ts-node for backend development
- npm for package management

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL

### Initial Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/lens-ltd/lens-music
   cd lens-music
   ```

2. Create the backend environment file from the example:

   ```sh
   cp api/.env.example api/.env
   ```

3. Review and update the values in `api/.env` as needed for your local setup, especially:

   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
   - `APP_URL`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`

4. Ensure PostgreSQL is running and that the `lens_music` database exists.

5. Make the development script executable:

   ```sh
   chmod +x dev.sh
   ```

## Running The App Locally

From the repository root, run:

```sh
./dev.sh
```

This script will:

- install API dependencies
- install client dependencies
- start the NestJS API in development mode
- start the Vite client in development mode

Default local endpoints in the repo are:

- Client: `http://localhost:5173`
- API: `http://localhost:8080/api`

The client defaults to the local API URL through its environment configuration.

## Optional Seed Data

If you want to bootstrap development data after configuring the database, run:

```sh
cd api
npm run seed
```

This runs the seed pipeline defined in the backend package and can populate initial reference data used by the application.

## Project Structure

```text
lens-music/
|- api/         # NestJS API, entities, modules, seeds, and backend services
|- client/      # React/Vite frontend, routes, pages, state, and UI
|- dev.sh       # Convenience script to install dependencies and start both apps
|- README.md    # Root project documentation
```

## Additional Docs

Use the subproject READMEs for narrower context:

- [API README](./api/README.md)
- [Client README](./client/README.md)
