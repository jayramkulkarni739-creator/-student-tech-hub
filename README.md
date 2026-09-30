# Student Tech Hub 🎓💻

A beginner-friendly full-stack web application designed for students to discover upcoming campus technical events and register for them online.

---

## 📌 Project Overview

**Student Tech Hub** demonstrates the core concepts of full-stack web development with a futuristic, modern design:

- **Frontend**: Plain HTML5, modern CSS3, and Vanilla JavaScript (No React, Next.js, TypeScript, or build tools required).
  - 🎨 **Sleek Cyber Dark & Clean Light Themes** with one-click switcher and ambient background glow.
  - 🔍 **Real-Time Search & Category Filters** (`Web Dev`, `AI & ML`, `Hackathon`, `Cloud`, `Security`).
  - ⚡ **Interactive Event Cards** with track icons, difficulty badges, remaining seat indicators, and calendar (.ics) download.
  - 🎫 **Digital "Student Tech Pass"** dynamically generated upon registration with unique pass ID and QR badge.
  - 📡 **Live Backend Health Indicator** with real-time status pulse.
- **Backend**: Python with **FastAPI** providing high-performance RESTful API endpoints.
- **Data Handling**: In-memory data store for simplicity (no database setup, migrations, or ORMs needed).
- **Cross-Origin Communication**: CORS enabled to allow the browser frontend to interact seamlessly with the Python backend server.

---

## 📁 Project Structure

```text
student-tech-hub/
│
├── frontend/
│   ├── index.html       # Webpage structure & user interface
│   ├── style.css        # Clean, modern, responsive CSS styling
│   └── script.js        # Vanilla JS handling API requests & DOM updates
│
├── backend/
│   ├── main.py          # FastAPI application, CORS, & API endpoints
│   └── requirements.txt # Python package dependencies
│
└── README.md            # Project documentation and setup guide
```

---

## 🚀 How to Install and Run the Backend

### Prerequisites
Make sure **Python 3.8+** is installed on your computer. You can check your version in a terminal:
```bash
python --version
```
*(If Python is not installed, download it from [python.org](https://www.python.org/downloads/) and make sure to check "Add Python to PATH" during installation).*

---

### Step 1: Open the Backend Directory
Open your terminal or PowerShell and navigate to the `backend` folder:
```bash
cd backend
```

### Step 2: (Optional but Recommended) Create a Virtual Environment
A virtual environment keeps your project dependencies isolated.

- **On Windows (PowerShell or Command Prompt):**
  ```powershell
  python -m venv venv
  .\venv\Scripts\activate
  ```

- **On macOS / Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### Step 3: Install Backend Dependencies
Install `fastapi` and `uvicorn`:
```bash
pip install -r requirements.txt
```

### Step 4: Start the FastAPI Server
Run the backend using any of the following commands:
```bash
python -m uvicorn main:app --reload
```
*Or directly via Python:*
```bash
python main.py
```
*(If `uvicorn` is in your system PATH, you can also simply run: `uvicorn main:app --reload`)*

The server will start at:
- **API Base URL**: `http://127.0.0.1:8000`
- **Interactive API Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`

---

## 🌐 How to Run the Frontend Locally

Since the frontend is built using pure HTML, CSS, and JavaScript, you can run it using any of the following simple methods:

### Option A: Double-Click (Easiest)
1. Open your file explorer and go to the `frontend` directory.
2. Double-click **`index.html`** to open it directly in your favorite web browser (Chrome, Edge, Firefox, etc.).

### Option B: VS Code "Live Server" (Recommended for Development)
1. Open the project folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey) from the VS Code Extensions marketplace.
3. Right-click `frontend/index.html` and select **"Open with Live Server"**.
4. Your browser will open the page automatically at `http://127.0.0.1:5500`.

### Option C: Python Simple HTTP Server
If you prefer running a local server from the terminal:
```bash
cd frontend
python -m http.server 5500
```
Then visit `http://127.0.0.1:5500` in your browser.

---

## 🔄 How the Frontend Communicates with the Backend

The frontend and backend communicate asynchronously over HTTP using the native browser **`fetch()`** API:

```text
[ Browser Frontend ]                          [ FastAPI Backend ]
  (HTML/CSS/JS)                                 (Python / Port 8000)
       |                                                |
       |  1. GET /api/events                            |
       |----------------------------------------------->|  (Fetches event list)
       |<-----------------------------------------------|
       |  2. Returns JSON array of events               |
       |                                                |
       |  3. POST /api/register { name, email }         |
       |----------------------------------------------->|  (Validates student)
       |<-----------------------------------------------|
       |  4. Returns JSON confirmation message          |
```

### 1. Fetching Events (`GET /api/events`)
When the user clicks the **"Load Events"** button:
1. `script.js` initiates an asynchronous request:
   ```javascript
   const response = await fetch("http://127.0.0.1:8000/api/events");
   const data = await response.json();
   ```
2. The backend responds with a JSON object containing technical event details (title, date, time, location, speaker, description).
3. `script.js` dynamically creates HTML cards and inserts them into the `#events-container` element.

### 2. Registering a Student (`POST /api/register`)
When a student fills out their name and email and clicks **"Register Now"**:
1. The form's `submit` event triggers `handleRegistration()` in `script.js`.
2. A `POST` request is sent to `http://127.0.0.1:8000/api/register` with JSON payload:
   ```javascript
   fetch("http://127.0.0.1:8000/api/register", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ name: "Alex Smith", email: "alex@example.com" })
   });
   ```
3. FastAPI validates the request using Pydantic (`StudentRegistration` model).
4. If valid, the backend appends the student to an in-memory list and returns a success response.
5. The frontend displays a green success confirmation message and resets the form.

### 3. Understanding CORS (Cross-Origin Resource Sharing)
- By default, web browsers block web pages from sending requests to a different domain or port due to security reasons.
- In development, the frontend may run on port `5500` (or `file://`), while FastAPI runs on port `8000`.
- In `backend/main.py`, we enable **`CORSMiddleware`**:
  ```python
  from fastapi.middleware.cors import CORSMiddleware

  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
- This sends headers that instruct the browser to allow requests coming from any origin.

---

## 🛠️ Backend API Endpoints Reference

| Method | Endpoint | Description | Request Body | Response Format |
|---|---|---|---|---|
| `GET` | `/` | Root endpoint / API health check | None | JSON |
| `GET` | `/api/events` | List all upcoming technical events | None | JSON (`{ status, events: [...] }`) |
| `POST` | `/api/register` | Register a student for events | `{ "name": "...", "email": "..." }` | JSON (`{ status, message, data }`) |

You can test these endpoints interactively via the built-in Swagger UI by visiting [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) after starting the backend.

---

## 💡 Troubleshooting

- **"Unable to connect to backend" in the browser:**
  Ensure the FastAPI server is running in your terminal (`uvicorn main:app --reload`) and listening on port 8000.
- **Port 8000 is already in use:**
  Run the server on a different port: `uvicorn main:app --reload --port 8001`, and update `API_BASE_URL` in `frontend/script.js` to match.
- **Email validation fails on register:**
  Make sure to input a valid email address containing an `@` symbol and domain (e.g., `student@university.edu`).
