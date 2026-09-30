"""
Student Tech Hub - FastAPI Backend
A beginner-friendly REST API for managing tech events and student registrations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# 1. Initialize FastAPI application
app = FastAPI(
    title="Student Tech Hub API",
    description="Backend API for Student Tech Hub application",
    version="1.0.0"
)

# 2. Enable CORS (Cross-Origin Resource Sharing)
# This allows the frontend running on a different port (e.g., Live Server on 5500,
# or opened directly in a browser) to send requests to this backend on port 8000.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],          # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],          # Allows all headers
)

# 3. Pydantic Models for Request Validation
class StudentRegistration(BaseModel):
    name: str
    email: str
    event_id: Optional[int] = None

# In-memory storage for registrations (simple and requires no database)
registrations = []

# Sample technical events data
SAMPLE_EVENTS = [
    {
        "id": 1,
        "title": "Introduction to Web Development",
        "category": "Web Dev",
        "icon": "🌐",
        "badge": "Beginner Friendly",
        "seats_left": 18,
        "date": "2026-10-05",
        "time": "4:00 PM - 6:00 PM",
        "location": "Computer Lab 2 & Online",
        "description": "Learn the foundations of HTML5, modern CSS, and JavaScript by building your first interactive website.",
        "speaker": "Sarah Jenkins (Lead Frontend Dev)"
    },
    {
        "id": 2,
        "title": "AI & Machine Learning Crash Course",
        "category": "Artificial Intelligence",
        "icon": "🤖",
        "badge": "Popular",
        "seats_left": 8,
        "date": "2026-10-12",
        "time": "3:00 PM - 5:30 PM",
        "location": "Auditorium Hall A",
        "description": "Explore practical machine learning concepts, neural networks, and prompt engineering with hands-on Python demos.",
        "speaker": "Dr. Alex Rivera (AI Researcher)"
    },
    {
        "id": 3,
        "title": "Open Source Hackathon 2026",
        "category": "Hackathon",
        "icon": "⚡",
        "badge": "Flagship 24h",
        "seats_left": 35,
        "date": "2026-10-18",
        "time": "9:00 AM - 6:00 PM",
        "location": "Student Innovation Center",
        "description": "Collaborate in teams to solve real-world problems and make your first open-source contributions with mentors.",
        "speaker": "Student Tech Committee"
    },
    {
        "id": 4,
        "title": "Cloud Computing & DevOps 101",
        "category": "Cloud & DevOps",
        "icon": "☁️",
        "badge": "Hands-on Lab",
        "seats_left": 14,
        "date": "2026-10-24",
        "time": "5:00 PM - 7:00 PM",
        "location": "Virtual / Google Meet",
        "description": "Understand cloud architecture, containerization with Docker, and CI/CD pipelines simplified for beginners.",
        "speaker": "Marcus Chen (DevOps Engineer)"
    },
    {
        "id": 5,
        "title": "Cybersecurity & Ethical Hacking Basics",
        "category": "Security",
        "icon": "🛡️",
        "badge": "High Demand",
        "seats_left": 5,
        "date": "2026-10-30",
        "time": "4:30 PM - 6:30 PM",
        "location": "Tech Lab 4",
        "description": "Discover essential web security vulnerabilities, OWASP Top 10, and best practices to secure your code.",
        "speaker": "Elena Rostova (Security Specialist)"
    }
]

# 4. API Endpoints

@app.get("/")
def read_root():
    """Welcome root endpoint."""
    return {
        "message": "Welcome to Student Tech Hub API!",
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/api/events")
def get_events():
    """
    GET /api/events
    Returns a list of upcoming technical events.
    """
    return {
        "status": "success",
        "total_events": len(SAMPLE_EVENTS),
        "events": SAMPLE_EVENTS
    }

@app.post("/api/register")
def register_student(registration: StudentRegistration):
    """
    POST /api/register
    Accepts a student's name and email, validates them, and registers the student.
    """
    # Clean and validate input strings
    cleaned_name = registration.name.strip()
    cleaned_email = registration.email.strip()

    if not cleaned_name:
        raise HTTPException(status_code=400, detail="Student name cannot be empty.")
    if not cleaned_email or "@" not in cleaned_email or "." not in cleaned_email:
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")

    # Save to our in-memory list
    new_entry = {
        "id": len(registrations) + 1,
        "name": cleaned_name,
        "email": cleaned_email,
        "event_id": registration.event_id
    }
    registrations.append(new_entry)

    return {
        "status": "success",
        "message": f"Congratulations {cleaned_name}! You have been successfully registered.",
        "data": new_entry
    }

# Convenient entry point to run with: python main.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
