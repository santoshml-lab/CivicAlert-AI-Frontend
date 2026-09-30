# 🚨 CivicAlert AI

### AI-Powered Community Issue Reporting & Intelligence Platform

CivicAlert AI is a full-stack AI-powered civic issue reporting platform that helps users report local community problems using photos and automatically generates useful intelligence such as issue classification, severity, priority, duplicate detection, and professional civic complaints.

The project combines React, FastAPI, Supabase, Groq AI, and cloud deployment to create an end-to-end civic issue management workflow.

---

## 🌐 Live Demo

**Frontend:**  
https://civic-alert-ai-frontend.vercel.app/

**Backend API:**  
https://civicalert-ai.onrender.com/

---

## 🎯 Problem Statement

Community problems such as road damage, garbage accumulation, water issues, electricity problems, streetlight failures, and drainage issues often require manual reporting and classification.

CivicAlert AI simplifies this process by allowing users to upload an image of a civic problem and automatically analyzing it using AI.

The platform helps transform a simple community report into structured and actionable information.

---

## 🚀 Key Features

### 📸 AI-Powered Image Analysis

Users can upload a photo of a civic issue.

The AI analyzes the image and identifies:

- Issue description
- Category
- Severity
- Explanation

Supported categories:

- Road
- Garbage
- Water
- Electricity
- Streetlight
- Drainage
- Other

Supported severity levels:

- Low
- Medium
- High

---

### 🧠 AI Priority Intelligence

CivicAlert AI calculates a priority score from 0 to 100 using:

- Issue severity
- Issue category
- Reported location

The system also provides an explanation for the generated priority.

Example:

```text
Priority Score: 95/100
Priority: HIGH

Duplicate Issue Detection
The platform checks existing community reports to identify potentially similar issues.
Duplicate detection considers:
Category
Location similarity
Issue title similarity
This helps identify repeated reports of the same or similar civic problem.


📝 AI Complaint Generation
After AI analysis, users can generate a professional civic complaint.
The generated complaint contains:
Complaint subject
Professional complaint paragraph
Issue details
Location
Reason for attention
Requested action
The AI is instructed not to invent facts.
📊 Community Dashboard
The dashboard provides an overview of reported civic issues.
It displays:
Total Issues
High Severity Issues
Pending Issues
Number of Locations
Issue Category Distribution
Latest Community Issue
The dashboard also includes a View All Issues button for quick navigation to the complete issue management page.
📋 Issue Management
Users can view reported community issues and update their status.
Supported statuses:
Pending
In Progress
Resolved
Status changes are stored in the Supabase database and remain persistent after refresh.
🔍 Search & Filtering
The Issues page supports searching by:
Issue title
Location
Category
Issues can also be filtered by:
Severity
All
High
Medium
Low
Status
All
Pending
In Progress
Resolved
☁️ Supabase Storage
Uploaded civic issue photos are stored in Supabase Storage.
The generated image URL is associated with the corresponding issue record.
🏗️ System Architecture
                    ┌──────────────────────┐
                    │        User          │
                    │  Upload Civic Photo  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   FastAPI Backend    │
                    │       Render         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │   Groq AI   │  │  Supabase   │  │   Storage   │
       │ AI Analysis │  │  PostgreSQL │  │    Photos   │
       └─────────────┘  └─────────────┘  └─────────────┘
              │
              ▼
       ┌──────────────────────────────┐
       │       AI Intelligence        │
       │                              │
       │ • Category Classification    │
       │ • Severity Detection         │
       │ • Priority Scoring           │
       │ • Duplicate Detection        │
       │ • Complaint Generation       │
       └──────────────────────────────┘
🛠️ Technology Stack
Frontend
React
Vite
JavaScript
Lucide React
CSS
Vercel
Backend
Python
FastAPI
Uvicorn
Python Multipart
Render
AI
Groq API
Vision-capable AI model for civic image analysis
openai/gpt-oss-20b for complaint generation
Database & Storage
Supabase PostgreSQL
Supabase Storage
Development & Deployment
Git
GitHub
REST API
Vercel
Render
📂 Project Structure
Frontend
CivicAlert-AI-Frontend/
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── public/
├── index.html
├── package.json
└── vite.config.js
Backend
CivicAlert-AI-Backend/
│
├── main.py
├── database.py
├── requirements.txt
├── Procfile
└── README.md
🔌 API Endpoints
Method
Endpoint
Purpose
GET
/
API information
GET
/health
Health check
POST
/issues
Create issue
GET
/issues
Retrieve issues
POST
/upload-photo
Upload civic issue image
POST
/analyze-image
AI image analysis
PATCH
/issues/{issue_id}/status
Update issue status
POST
/generate-complaint
Generate civic complaint
GET
/priority-score
Calculate priority score
GET
/check-duplicate
Detect similar issues
🗄️ Database Schema
The main issues table contains:
id
title
description
category
severity
location
status
created_at
image_url
ai_explanation
🔐 Environment Variables
The backend requires the following environment variables:
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key
API keys and secret credentials should never be committed to GitHub.
▶️ Local Development
Backend Setup
Clone the repository:
git clone https://github.com/santoshml-lab/CivicAlert-AI-Backend.git
cd CivicAlert-AI-Backend
Install dependencies:
pip install -r requirements.txt
Create a .env file:
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key
Run the backend:
uvicorn main:app --reload
The backend will run at:
http://127.0.0.1:8000
💻 Frontend Setup
Clone the frontend repository:
git clone https://github.com/santoshml-lab/CivicAlert-AI-Frontend.git
cd CivicAlert-AI-Frontend
Install dependencies:
npm install
Start the development server:
npm run dev
Build for production:
npm run build
🔄 Complete User Workflow
1. User opens CivicAlert AI
             ↓
2. Selects civic issue photo
             ↓
3. Enters issue location
             ↓
4. Uploads photo
             ↓
5. Photo is stored in Supabase Storage
             ↓
6. AI analyzes the image
             ↓
7. Category + Severity are generated
             ↓
8. Priority score is calculated
             ↓
9. Existing issues are checked
             ↓
10. Issue is stored in Supabase
             ↓
11. User can generate a professional complaint
             ↓
12. Issue appears on the Issues page
             ↓
13. Status → Pending
             ↓
14. Status → In Progress
             ↓
15. Status → Resolved
🧪 Testing
The application has been tested for:
✅ Image upload
✅ Supabase Storage upload
✅ AI image analysis
✅ Category classification
✅ Severity classification
✅ Priority scoring
✅ Duplicate detection
✅ AI complaint generation
✅ Issue creation
✅ Issue retrieval
✅ Status update
✅ Status persistence after refresh
✅ Search functionality
✅ Severity filtering
✅ Status filtering
✅ Loading state
✅ Error handling
✅ Success state
✅ Duplicate warning state
✅ Responsive/mobile UI
✅ Production build
🎯 Project Highlights
CivicAlert AI demonstrates the integration of multiple AI and full-stack technologies into a practical civic technology application.
The project combines:
AI Image Analysis
        +
Generative AI
        +
Priority Intelligence
        +
Duplicate Detection
        +
REST APIs
        +
PostgreSQL
        +
Cloud Storage
        +
React Frontend
        +
Cloud Deployment
🔮 Future Improvements
Possible future enhancements include:
🗺️ Interactive civic issue map
📍 GPS-based location detection
🔐 User authentication
👤 Citizen profiles
🏛️ Municipality/Admin dashboard
📧 Complaint email integration
📱 Progressive Web App
🧠 Embedding-based semantic duplicate detection
📈 Advanced civic analytics
🔔 Issue status notifications
🌐 Multi-language complaint generation
📊 AI-powered community trend analysis
👨‍💻 Author
Santosh Yadav
AI & Full-Stack Developer
Areas of interest:
Artificial Intelligence
Machine Learning
Generative AI
Agentic AI
Full-Stack Development
AI-powered Education
Civic Technology
⭐ Project
If you find CivicAlert AI useful or interesting, consider giving the repository a ⭐ on GitHub.
CivicAlert AI
Turning community reports into actionable intelligence.
