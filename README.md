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
