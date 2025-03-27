# Higher Education Institution Information Portal

A comprehensive administrative information portal for higher education institutions, providing powerful management tools and seamless user experience.

## Features

- Responsive design for both mobile and desktop
- User authentication with JWT tokens
- Role-based access control (user/admin)
- Content management system for news, gallery, and slider items
- Optimized for performance and accessibility

## Stack

- **Frontend**: React, React Query, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT, passport.js
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see below)
4. Run the development server with `npm run dev`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
SESSION_SECRET=your_session_secret
```

## Development Workflow

- The frontend code is in the `client` directory
- The backend code is in the `server` directory
- Shared types and schemas are in the `shared` directory

## Deploying to Vercel

This project is configured to be deployed on Vercel. To deploy:

1. Connect your GitHub repository to Vercel
2. Add the required environment variables in the Vercel dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `SESSION_SECRET` - A secret for encrypting sessions
   - `NODE_ENV` - Set to `production`
3. Deploy the project

## PostgreSQL Database Setup

The project uses Drizzle ORM for database management. To create or update the database schema:

1. Update the schema in `shared/schema.ts`
2. Run `npm run db:push` to apply the changes to the database

## Creating Admin Users

To create an admin user:

1. Run `npm run create-admin` or `bash create-admin.sh`
2. Follow the prompts to create an admin account

## Default Users

- Regular user: Username: `testuser`, Email: `test@example.com`, Password: `password`
- Admin user: Username: `admin`, Email: `admin@example.com`, Password: `adminpassword`

## License

MIT