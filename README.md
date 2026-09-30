# NovaSphere 🪐✨
### Next-Gen 3D Student Tech Nexus & Workshop Platform

A beginner-friendly, visually stunning full-stack web application designed for student developers to discover upcoming technical events and register online — powered by **Python FastAPI** and **Vanilla 3D Web Graphics**.

---

## 📌 What the Project Does

**NovaSphere** is an interactive, spatial student tech ecosystem that bridges modern web design with a lightweight, high-performance Python backend.

Key highlights:
- 🪐 **Interactive 3D Spatial Core**: A live 3D Gyroscope/Orb in the hero section built with WebGL and Three.js (with an automated pure-math Canvas 3D fallback for offline environments). Features mouse tracking, drag-to-rotate, wireframe toggle, and a triggerable 3D shockwave pulse!
- 🎫 **3D Flippable Holographic Pass**: Upon registration, an interactive double-sided 3D pass is generated. Students can click or drag to flip the pass in 3D space (`transform: rotateY(180deg)`), revealing their verified details on the front and cryptographic QR security credentials on the back.
- ⚡ **Interactive 3D Depth Event Cards**: Workshop cards tilt dynamically in 3D space with cursor-following specular light glare and multi-layered parallax depth.
- 🌌 **3D Particle Constellation Canvas**: A continuous 3D background that projects particles with true mathematical perspective scaling (`fov / (fov + z)`).
- 🔍 **Real-Time Discovery Suite**: Search workshops by keyword, filter by category (`3D & Web`, `AI & ML`, `Hackathon`, `Cloud`, `Security`), and bookmark favorite events.
- ⏱️ **Live Countdown Timer**: Automatically calculates the time remaining until the next upcoming tech workshop.
- 🔊 **Web Audio Synthesizer**: Optional futuristic haptic sound effects for clicks, refreshes, pulses, and card flips.
- ⚡ **Lightweight Python FastAPI Backend**: Delivers clean RESTful JSON endpoints with CORS enabled, request validation via Pydantic, and in-memory storage (no complex database required).

---

## 📁 Project Structure

```text
student-tech-hub/
├── frontend/
│   ├── index.html       # Semantic HTML5 markup, 3D viewports & modals
│   ├── style.css        # Cyber styling, 3D CSS perspectives & responsive layout
│   └── script.js        # Vanilla JS handling 3D WebGL engine & FastAPI fetch
│
├── backend/
│   ├── main.py          # FastAPI application, CORS middleware & REST endpoints
│   └── requirements.txt # Minimal Python dependencies (fastapi, uvicorn)
│
└── README.md            # Comprehensive project documentation & setup guide
```

---

## 🚀 How to Install the Backend

### Prerequisites
Make sure **Python 3.8 or higher** is installed on your computer. You can check your version in your terminal:
```bash
python --version
```
*(If Python is not installed, download it from [python.org](https://www.python.org/downloads/) and ensure "Add Python to PATH" is checked during installation).*

---

### Step 1: Open the Backend Directory
Open your terminal or PowerShell and navigate to the `backend` folder:
```bash
cd backend
```

### Step 2: (Optional but Recommended) Create a Virtual Environment
A virtual environment keeps your project dependencies clean and isolated.

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
Install `fastapi` and `uvicorn` using `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

## ⚡ How to Run the Backend

Start the FastAPI development server with automatic reloading:

```bash
uvicorn main:app --reload --port 8000
```
*Or run directly via Python:*
```bash
python main.py
```

The backend server will start at:
- **API Base URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **Alternative Redoc Documentation**: `http://127.0.0.1:8000/redoc`

You can verify the backend is running by opening `http://127.0.0.1:8000` in your web browser. You should see:
```json
{
  "message": "Welcome to NovaSphere Tech Nexus API!",
  "status": "online",
  "version": "1.0.0",
  "documentation": "/docs"
}
```

---

## 🌐 How to Run the Frontend Locally

Because the frontend is built entirely with plain HTML, CSS, and JavaScript, **no build step, bundler, or Node.js installation is required**.

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey) if you don't already have it.
3. Right-click on `frontend/index.html` and choose **"Open with Live Server"**.
4. Your browser will automatically open at `http://127.0.0.1:5500/frontend/index.html`.

### Option 2: Python Built-in HTTP Server
In your terminal, navigate to the `frontend` folder and start a local web server:
```bash
cd frontend
python -m http.server 3000
```
Then open `http://localhost:3000` in your browser.

### Option 3: Double-Click Directly
You can simply double-click `frontend/index.html` to open it in Google Chrome, Edge, Firefox, or Safari! The frontend includes automated dual-host fallback logic (`localhost:8000` and `127.0.0.1:8000`) so it seamlessly connects to FastAPI even from local file paths.

---

## 🔄 How the Frontend Communicates with the Backend

The frontend communicates with the backend over **HTTP** using the browser's native **`fetch()` API**.

```
┌─────────────────────────────────┐                 ┌───────────────────────────────┐
│       Frontend (Browser)        │                 │       Backend (FastAPI)       │
│   HTML5 + CSS3 3D + Vanilla JS  │                 │           Python 3            │
│   http://127.0.0.1:5500         │                 │     http://127.0.0.1:8000     │
└──────────────┬──────────────────┘                 └───────────────┬───────────────┘
               │                                                    │
               │  1. GET /api/events (Fetch workshop list)          │
               │───────────────────────────────────────────────────>│
               │                                                    │
               │  2. JSON Response: [ { id: 1, title: ... } ]       │
               │<───────────────────────────────────────────────────│
               │                                                    │
               │  3. POST /api/register { name, email, event_id }   │
               │───────────────────────────────────────────────────>│
               │                                                    │
               │  4. JSON Response: { status: "success", data: ... }│
               │<───────────────────────────────────────────────────│
               │                                                    │
               │  5. 3D Pass Rendered: Attendee ID + 3D Flip Card   │
               └────────────────────────────────────────────────────┘
```

### 1. Fetching Events (`GET /api/events`)
When the page loads or when the user clicks **"Load Live Events"** / **"Refresh Events"**, JavaScript triggers:
```javascript
const response = await fetch("http://127.0.0.1:8000/api/events");
const data = await response.json();
console.log(data.events); // Array of workshop objects
```
The frontend then dynamically generates the interactive 3D event cards and populates the workshop selection dropdown.

### 2. Registering a Student (`POST /api/register`)
When a student fills out the registration form and clicks **"Generate 3D Pass"**, JavaScript validates the inputs and sends an HTTP POST request with a JSON payload:
```javascript
const response = await fetch("http://127.0.0.1:8000/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Maya Lin",
    email: "maya.lin@university.edu",
    event_id: 1
  })
});
const result = await response.json();
```
Upon receiving confirmation from FastAPI, the frontend triggers celebration confetti, plays an audio chime, and smoothly displays the **3D Holographic Pass**.

### 3. Cross-Origin Resource Sharing (CORS)
When your frontend runs on port `5500` (or `3000`) and your backend runs on port `8000`, the web browser's security rules prevent them from communicating unless **CORS** is enabled.

In `backend/main.py`, CORS is enabled using FastAPI's built-in `CORSMiddleware`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Allows frontend on any port to send requests
    allow_credentials=True,
    allow_methods=["*"],       # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],       # Allows all headers (e.g., Content-Type)
)
```

---

## 🎨 How the 3D Animations Work

NovaSphere incorporates multi-layered 3D graphics that remain beginner-friendly and lightweight:

1. **3D Spatial Core (Hero Section)**:
   - Utilizes Three.js via CDN for GPU-accelerated WebGL rendering.
   - Computes real-time angular orientation based on mouse movement coordinates `(clientX, clientY)`.
   - Includes mouse drag rotation with angular momentum and an automated pure-math 2D Canvas fallback that projects 3D sphere points via perspective transformation `scale = fov / (fov + z)`.
2. **3D Flippable Holographic Pass**:
   - Leverages native CSS 3D transforms:
     ```css
     .card-3d-scene { perspective: 1200px; }
     .card-3d-object { transform-style: preserve-3d; transition: transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1); }
     .card-3d-object.flipped { transform: rotateY(180deg); }
     .card-3d-face { backface-visibility: hidden; }
     ```
   - Real-time mouse tilt shifts both X and Y angles on hover, creating tactile physical depth.
3. **Event Card 3D Tilt**:
   - Calculates the mouse cursor's offset from the card center:
     $$\text{rx} = \left(\frac{y - \text{cy}}{\text{cy}}\right) \times -12^\circ, \quad \text{ry} = \left(\frac{x - \text{cx}}{\text{cx}}\right) \times 12^\circ$$
   - Combines with CSS `transform: perspective(1000px) rotateX(...) rotateY(...)` and inner elements floating at `translateZ(20px)` and `translateZ(35px)`.

---

## 🧪 Testing Backend Endpoints Manually

You can test the backend directly using `curl` in PowerShell or bash:

### Test GET `/api/events`
```bash
curl http://127.0.0.1:8000/api/events
```

### Test POST `/api/register`
```bash
curl -X POST http://127.0.0.1:8000/api/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Alex Rivera","email":"alex@example.com","event_id":1}'
```

---

## 💡 Beginner FAQ & Tips

- **Do I need a database?** No, registrations are stored in memory in Python (`registrations = []`). This makes the code exceptionally clean and simple to understand for beginners.
- **Can I add new events?** Yes! Open `backend/main.py` and add new dictionaries to the `SAMPLE_EVENTS` list.
- **Can I run this offline?** Yes! The 3D engine includes an automated native 2D/3D Canvas projection fallback, so all animations and features function even without an internet connection.

---

&copy; 2026 **NovaSphere** &bull; Crafted for student engineers and creative technologists.
