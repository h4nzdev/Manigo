# Proposed Tech Stack (Simple Version)

## Project: Manigo – Smart Loan Monitoring System

---

# 1. What the system does

Manigo helps loan teams:

* Track payments
* Detect risky customers
* Guide staff using simple smart tools

---

# 2. Main Parts of the System

The system has four parts:

1. Frontend (user interface)
2. Backend (server logic)
3. Database (data storage)
4. Automation and AI (smart features)

---

# 3. Frontend (User Interface)

Technology:

* React
* Tailwind CSS

Use:

* Loan application form
* Dashboard
* Chat interface
* Suggestion panel (shows recommended actions)

---

# 4. Backend (Server)

Technology:

* Flask

Use:

* Receive data from frontend
* Process requests
* Connect to database
* Trigger automation
* Handle suggested actions and updates

---

# 5. Database

Technology:

* SQLite

Use:

* Store loan records
* Store customer data
* Store payment information
* Store suggested actions and their status

---

# 6. Automation and AI

Technology:

* n8n
* OpenAI API

Use:

* Send alerts for missed payments
* Provide chatbot answers
* Generate suggested actions based on data
* Trigger workflows when suggestions are accepted

---

# 7. Suggestion Workflow Feature (New)

The system provides suggested actions to loan officers.

Example:

* “Follow up with client”
* “Offer payment restructuring”

### When a suggestion is accepted:

* The system triggers a workflow (using n8n)
* Example steps:

  * Send reminder message to client
  * Schedule follow-up task
  * Update loan status

### When a suggestion is modified:

* Officer can edit the suggestion

* Example:

  * Change message content
  * Adjust follow-up date

* The updated version is then executed

* The system saves both the original and modified action

### Purpose:

* Gives guidance to officers
* Keeps flexibility for human decision
* Makes the system interactive and smart

---

# 8. Optional Feature (Map)

Technology:

* Leaflet.js or Google Maps API

Use:

* Show simple location-based data

---

# 9. Simple System Flow

1. User enters data in frontend
2. Data goes to backend
3. Backend saves data in database
4. Backend sends data to automation
5. Automation generates insights or suggestions
6. Suggestions are shown to the user
7. User accepts or modifies suggestion
8. System executes workflow and updates data

---

# 10. Final Tech Stack Summary

Frontend: React + Tailwind CSS
Backend: Flask
Database: SQLite
Automation: n8n
AI: OpenAI API
Optional: Leaflet or Google Maps

---

End of Document
