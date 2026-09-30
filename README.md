CivicAlert AI 🚨
AI-Powered Community Issue Reporting & Intelligence Platform
CivicAlert AI is a full-stack AI-powered platform that helps communities report local civic problems through photos and receive automated issue analysis, severity classification, priority intelligence, duplicate detection, and professional complaint generation.
The platform combines React, FastAPI, Supabase, Groq AI, and cloud deployment to create an end-to-end civic issue management workflow.
🌐 Live Demo
Frontend:
https://civic-alert-ai-frontend.vercel.app/⁠�
Backend API:
https://civicalert-ai.onrender.com/⁠�
🎯 Problem Statement
Community issues such as:
🛣️ Road damage
🗑️ Garbage accumulation
💧 Water-related problems
⚡ Electricity issues
💡 Streetlight problems
🚰 Drainage issues
are often difficult to report, classify, prioritize, and track efficiently.
CivicAlert AI provides an intelligent workflow where a user can upload a photo of a civic problem and the system can automatically analyze it and generate useful information for further action.
🚀 Key Features
📸 AI-Powered Image Analysis
Users can upload an image of a civic issue.
The AI analyzes the image and identifies:
Issue description
Category
Severity
Explanation
Supported categories:
road
garbage
water
electricity
streetlight
drainage
other
Severity levels:
low
medium
high
🧠 AI Priority Intelligence
CivicAlert AI calculates a priority score from 0–100 based on:
Issue severity
Issue category
Reported location
Example:
Priority Score: 95/100
Priority: HIGH
The system also provides an explanation for the generated priority.
🔎 Duplicate Issue Detection
Before treating an issue as completely new, the system checks existing reports.
Duplicate detection considers:
Category
Location similarity
Title word similarity
Example:
Similar reports: 9

Existing Issue #13
Streetlight not working
Location: Railway Colony
Status: pending
This helps identify potentially repeated community reports.
📝 AI Complaint Generation
After image analysis, users can generate a professional civic complaint.
The AI generates:
Complaint subject
Professional complaint paragraph
Example structure:
Subject:
Pothole with Standing Water on Main Road

Complaint:
A professional complaint describing the issue,
location, impact and requested action.
The system is instructed not to invent facts.
📊 Community Dashboard
The dashboard provides an overview of reported issues.
It displays:
Total Issues
High Severity Issues
Pending Issues
Number of Locations
Category distribution
Latest community issue
The View All Issues button provides direct navigation to the complete issue management page.
📋 Issue Management
Users can view reported issues and manage their status.
Supported statuses:
Pending
In Progress
Resolved
Status changes are persisted in Supabase.
🔍 Search & Filtering
The Issues page supports:
Search by:
Issue title
Location
Category
Filter by severity:
All
High
Medium
Low
Filter by status:
All
Pending
In Progress
Resolved
☁️ Cloud Storage
Uploaded civic issue photos are stored using Supabase Storage.
The application stores the generated image URL together with the issue record.
🏗️ System Architecture
                 ┌──────────────────────┐
                 │      User            │
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
                 │    FastAPI Backend   │
                 │       Render         │
                 └──────────┬───────────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
      ┌────────────┐ ┌────────────┐ ┌────────────┐
      │  Groq AI   │ │  Supabase  │ │   Storage  │
      │ AI Analysis│ │  Database  │ │   Photos   │
      └────────────┘ └────────────┘ └────────────┘
             │
             ▼
      ┌─────────────────────────────┐
      │ AI Insights                 │
      │ • Category                  │
      │ • Severity                  │
      │ • Priority                  │
      │ • Duplicate Detection       │
      │ • Complaint Generation      │
      └─────────────────────────────┘
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
Vision-capable AI model for image analysis
openai/gpt-oss-20b for complaint generation
Database & Storage
Supabase PostgreSQL
Supabase Storage
Development
Git
GitHub
REST APIs
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
Calculate priority
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
Backend requires:
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key
Never commit API keys or secret credentials to GitHub.
▶️ Local Development
1. Clone Backend
git clone https://github.com/santoshml-lab/CivicAlert-AI-Backend.git
cd CivicAlert-AI-Backend
2. Install Dependencies
pip install -r requirements.txt
3. Configure Environment Variables
Create:
.env
and add:
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key
4. Run Backend
uvicorn main:app --reload
Backend will run locally at:
http://127.0.0.1:8000
💻 Frontend Setup
git clone https://github.com/santoshml-lab/CivicAlert-AI-Frontend.git
cd CivicAlert-AI-Frontend
Install dependencies:
npm install
Run development server:
npm run dev
Build for production:
npm run build
🔄 Complete User Workflow
1. User opens CivicAlert AI
          ↓
2. Selects civic issue photo
          ↓
3. Enters location
          ↓
4. Uploads photo
          ↓
5. Photo stored in Supabase Storage
          ↓
6. AI analyzes image
          ↓
7. Category + Severity generated
          ↓
8. Priority score calculated
          ↓
9. Existing issues checked
          ↓
10. Issue stored in Supabase
          ↓
11. User can generate civic complaint
          ↓
12. Issue can be tracked
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
✅ Search
✅ Severity filtering
✅ Status filtering
✅ Loading state
✅ Error handling
✅ Responsive/mobile UI
✅ Production build
🎯 Project Goals
CivicAlert AI demonstrates how AI can be integrated into a practical civic technology workflow rather than being used only as a chatbot.
The project combines:
Computer Vision
      +
Generative AI
      +
Backend APIs
      +
Database
      +
Cloud Storage
      +
Issue Intelligence
      +
Full-Stack Development
🔮 Future Improvements
Potential future enhancements include:
🗺️ Interactive issue map
📍 GPS-based location detection
🔐 User authentication
👤 Citizen profiles
🏛️ Municipality/admin dashboard
📧 Complaint email integration
📱 PWA/mobile application
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
AI-powered Education & Civic Technology
⭐ Project
If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
CivicAlert AI — Turning community reports into actionable intelligence.
