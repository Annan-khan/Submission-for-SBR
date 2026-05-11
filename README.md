# Atelier Studio Template CRUD API

Minimal full-stack CRUD application built with Node.js, Express.js, and MongoDB for managing dynamic template sections and items.

---

## Features

* Dynamic section management
* Store template data in MongoDB
* RESTful CRUD APIs
* Add/Edit/Delete section items
* Lightweight admin dashboard
* Minimalistic backend architecture
* Responsive frontend integration

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Vanilla JavaScript
* HTML/CSS

---

## Project Structure

```bash
project/
│
├── models/
│   └── section.js
│
├── public/
│   ├── admin.html
│   ├── admin.js
│   └── styles.css
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

## API Endpoints

| Endpoint                           | Method | Description                        |
| ---------------------------------- | ------ | ---------------------------------- |
| `/api/sections`                    | GET    | Retrieve all sections from MongoDB |
| `/api/sections/:key`               | GET    | Retrieve a single section by key   |
| `/api/sections`                    | POST   | Create a new section               |
| `/api/sections/:key`               | PUT    | Update an existing section         |
| `/api/sections/:key`               | DELETE | Delete a section                   |
| `/api/sections/:key/items`         | POST   | Add an item to a section           |
| `/api/sections/:key/items/:itemId` | PUT    | Update a specific item             |
| `/api/sections/:key/items/:itemId` | DELETE | Delete a specific item             |
| `/admin`                           | GET    | Open admin management page         |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/atelier
PORT=3000
```

---

## Installation & Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

### 3. Open in browser

Main application:

```bash
http://localhost:3000
```

Admin panel:

```bash
http://localhost:3000/admin
```

---

## Sample API Request

### Create Section

#### Request

```http
POST /api/sections
Content-Type: application/json
```

```json
{
  "key": "hero",
  "name": "Hero Section",
  "data": {
    "title": "Welcome to Atelier Studio"
  }
}
```

#### Response

```json
{
  "success": true,
  "message": "Section created successfully"
}
```

---

## Notes

* Hero section content is dynamically loaded from MongoDB
* Contact form submissions are intentionally excluded from database storage
* The admin panel demonstrates complete CRUD operations
* MongoDB timestamps are automatically managed by Mongoose

---

## Future Improvements

* MVC folder structure
* Authentication & authorization
* Pagination & search
* Centralized error middleware
* React frontend migration
* API validation middleware

---

## Author

Developed as a template CRUD assignment using Express.js and MongoDB.
