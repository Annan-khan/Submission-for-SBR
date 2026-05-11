# Atelier Studio Template CRUD API

Minimal Express + MongoDB backend for storing and retrieving template section data.

## API Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/sections` | GET | List all sections stored in MongoDB |
| `/api/sections/:key` | GET | Get a single section by its key |
| `/api/sections` | POST | Create a new section document |
| `/api/sections/:key` | PUT | Update an existing section by key |
| `/api/sections/:key` | DELETE | Delete a section by key |
| `/api/sections/:key/items` | POST | Add an item to a section's `data.items` array |
| `/api/sections/:key/items/:itemId` | PUT | Edit a specific item inside `data.items` |
| `/api/sections/:key/items/:itemId` | DELETE | Remove a specific item from `data.items` |
| `/admin` | GET | Load the standalone admin page for managing sections |

## Running locally

1. Install dependencies:

```bash
npm install
```

2. Set MongoDB connection string in `.env` or use the default local URI:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/atelier
PORT=3000
```

3. Start the server:

```bash
npm start
```

4. Open the app in a browser:

```text
http://localhost:3000
```

## Notes

- The page loads hero section data from the database.
- Contact form data is not stored in the database by design.
- A simple section manager has been added to demonstrate add/edit/delete operations.
