# 🏕️ DevCamper Backend API

**Backend API for the DevCamper Bootcamp Directory**  
Developed by **Ahmed Haitham**

This project is a complete Node.js API for managing bootcamps, courses, users, and reviews. It includes advanced features such as authentication, authorization, security middleware, geolocation, file uploads, and API documentation.

## 🚀 Features

## Bootcamps

- List all bootcamps (with pagination, filtering, field selection, and limiting)
- Search bootcamps by radius (using geocoder and coordinates)
- Get single bootcamp
- Create bootcamp
  - Authenticated users only
  - Only users with roles `"publisher"` or `"admin"`
  - One bootcamp per publisher (admins can create multiple)
- Upload a photo for bootcamp (owner only)
- Update bootcamp (owner only)
- Delete bootcamp (owner only)
- Calculate average course cost and bootcamp rating

## Courses

- List all courses or courses under a bootcamp
- Get single course
- Create course
  - Authenticated users only
  - `"publisher"` or `"admin"` role
  - Only owner/admin can create courses
- Update and delete course (owner only)

## Reviews

- List all reviews or reviews for a bootcamp
- Get single review
- Create review (only `"user"` or `"admin"`)
- Update and delete review (owner only)

## Users & Authentication

- Register as `"user"` or `"publisher"`
- Login / Logout with JWT and cookies
- Get logged-in user (via token)
- Password reset via email (expires after 10 min)
- Update user info & password (authenticated users)
- Full user CRUD (admin only)
- Only database updates can promote a user to admin

## 🔒 Security Features

- Passwords and reset tokens encrypted with bcrypt & crypto
- Prevent:
  - Cross-Site Scripting (XSS)
  - NoSQL Injection
  - HTTP Parameter Pollution
- Rate limit (150 requests per 10 minutes)
- Security headers via Helmet
- CORS enabled for public access

## 📘 Documentation

- Documentation built using **Postman**
- Exported using **Postman Docgen**
- Hosted via `/` route in production
- Access live documentation:  
  👉 [https://devcamper.ahmedrehandev.net](https://devcamper.ahmedrehandev.net)

## ⚡ Installation & Run

```
# Clone repository
git clone https://github.com/Ahmed-HA-RE/devcamp-backend.git

# Install dependencies
npm install

# Start development server
npm run dev

```
