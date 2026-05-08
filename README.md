# Project Documentation

## User Profile Feature

### Profile Page
- Accessible at `/profile` for logged-in users.
- Displays current profile information with read-only fields `username` and `email`.
- Editable fields include `firstName`, `lastName`, `phone`, `bio`, `dateOfBirth`, `city`, `country`, and `avatarUrl`.

### Avatar Upload
- Users can upload avatars in JPEG, PNG, or WebP format.
- Maximum file size is 2 MB, and dimensions should not exceed 1024x1024 px.
- Avatars are stored in `backend/data/avatars/` with filenames formatted as `<userId>-<timestamp>.<ext>`.

### Endpoints
- `GET /api/profile`: Fetches the logged-in user's profile.
- `PUT /api/profile`: Updates the logged-in user's profile.
- `POST /api/profile/avatar`: Uploads an avatar for the logged-in user.

### Setup Steps
1. Ensure the `backend/data/avatars/` directory exists or is created on startup.
2. Configure Spring Boot's `spring.servlet.multipart.max-file-size=2MB` in `application.properties`.

### Security
- Users can only view and edit their own profiles.
- Avatar uploads and profile updates are validated on both frontend and backend.

### Testing
- Ensure all new features are covered by unit tests.
- Run the test suite to verify functionality.
