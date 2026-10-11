STUDENT CRUD APP - HOW TO RUN

1. Install dependencies (once):
     cd backend  && npm install
     cd ../frontend && npm install

2. Start backend (Terminal 1):
     cd backend
     npm start
   Expect: "Server running on http://localhost:5000"
           "Connected to MongoDB (database: 2024025876)"

3. Start frontend (Terminal 2):
     cd frontend
     npm run dev

4. Open in browser:  http://localhost:5173

Note: if backend shows ECONNREFUSED ::1:27017, change "localhost" to
"127.0.0.1" in backend/server.js.
