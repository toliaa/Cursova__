# Higher Education Institution Information Portal

A comprehensive administrative information portal for higher education institutions, providing powerful management tools and seamless user experience.

## Features

- Responsive design for both mobile and desktop views
- User authentication with JWT tokens
- Role-based access control (regular users and administrators)
- News management
- Image gallery
- Contact information with map integration
- Admin dashboard for content management

## Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Query for data fetching
- **Authentication**: JWT tokens with bcrypt password hashing

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file with your PostgreSQL database configuration

4. Run database migrations:
   ```
   npm run db:push
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Creating an Admin User

For security reasons, admin user creation is only available through a command-line script:

```bash
./create-admin.sh
```

or

```bash
npx tsx scripts/create-admin.ts
```

This will prompt you to enter:
- Username
- Email
- Password (minimum 6 characters)
- First name (optional)
- Last name (optional)

## User Roles

- **Regular User**: Can view content and access the user dashboard
- **Admin**: Has additional permissions to manage content (add/delete news, gallery items, manage users)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile (protected)

### Users
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

### News
- `GET /api/news` - Get all news items
- `GET /api/news/featured` - Get featured news
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create news item (protected)
- `DELETE /api/news/:id` - Delete news item (admin only)

### Gallery
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/:id` - Get gallery item by ID
- `POST /api/gallery` - Create gallery item (protected)

### Slider
- `GET /api/slider` - Get all slider items
- `GET /api/slider/:id` - Get slider item by ID
- `POST /api/slider` - Create slider item (protected)