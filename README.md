# RaceDay API 
 
## Overview 
A comprehensive REST API for managing race events, categories, enrolments, and results. 
 
## Features 
- JWT Authentication 
- Role-based access (Organiser/Participant) 
- Event CRUD operations 
- Category management 
- Participant enrolments 
- Results tracking 
 
## Tech Stack 
- Node.js 
- Express 
- SQL Server 
- JWT 
- bcrypt 
 
## Installation 
1. Clone repository 
2. Run npm install 
3. Configure .env file 
4. Run RaceDay_Database.sql 
5. npm start 
 
## API Endpoints (21) 
Full API documentation available in RaceDay_API_Endpoint_Plan.md 
 
## Database Schema 
6 entities: Users, Events, Categories, Routes, Enrolments, Results 
 
## Author 
Gift - ST10486532@rcconnect.edu.za 
 
## API Endpoints Summary 
- POST /api/auth/register - Register user 
- POST /api/auth/login - Login user 
- GET /api/users/me - Get profile 
- PUT /api/users/me - Update profile 
- GET /api/events - List events 
- GET /api/events/:id - Get event 
- POST /api/events - Create event 
- PUT /api/events/:id - Update event 
- DELETE /api/events/:id - Delete event 
- GET /api/events/:id/categories - List categories 
- POST /api/events/:id/categories - Add category 
- PUT /api/categories/:id - Update category 
- DELETE /api/categories/:id - Delete category 
- POST /api/categories/:id/enrol - Enrol in category 
- GET /api/users/me/enrolments - View enrolments 
- DELETE /api/enrolments/:id - Cancel enrolment 
- GET /api/events/:id/enrolments - Event roster 
- POST /api/enrolments/:id/result - Capture result 
- PUT /api/results/:id - Edit result 
- GET /api/users/me/results - User results 
- GET /api/events/:id/results - Event leaderboard 
