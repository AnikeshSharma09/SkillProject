# 📘 AI-FLOW: The Simple, Plain-English Guide

> **"Smart Documents. Smart Workflows. Smarter Decisions."**

---

## 💡 1. What is AI-FLOW? (In Simple Words)

Imagine you run an organization that receives hundreds of documents every day:
- **Invoices & Bills**
- **Employee Leave Requests**
- **Medical Forms & Claims**
- **College Admission & Scholarship Forms**
- **Contracts & Purchase Orders**

Normally, humans have to manually open each PDF, read it line by line, type the amounts and dates into an Excel sheet, email a manager for sign-off, and file it into a folder. **This takes hours and causes costly mistakes.**

### 🤖 What AI-FLOW Does Instead:
AI-FLOW is like a **super-smart digital office assistant**:
1. You drop any PDF or photo into it.
2. It **reads the text** instantly (using OCR).
3. It **figures out what type of document it is** (Invoice, Leave Form, Medical Claim, etc.).
4. It **extracts all key fields** (Total Amount, Due Date, Vendor Name, Employee Name) into neat data boxes.
5. It **checks your office rules** (e.g., *"If an invoice is above ₹50,000, ask Vikram Patel for approval"*).
6. It **notifies the right person** or approves it automatically.
7. It **files it away** in an encrypted digital cabinet and writes an immutable record in the audit log.

**All of this happens in 3 to 4 seconds.**

---

## 🔄 2. The 7-Step Document Journey (How it Works)

```
[1. Upload Document] (PDF / JPG / PNG)
       ↓
[2. OCR & Reading] (Reads all words from the scan)
       ↓
[3. AI Classification] (Identifies: Invoice / Leave / PO / Contract)
       ↓
[4. Data Extraction] (Pulls Total, Vendor, Dates into structured boxes)
       ↓
[5. Confidence Check] (Is AI > 70% sure?)
     ├── If Blurry / Low Confidence → [Human Review Queue] (Staff verifies)
     └── If High Confidence → [Rule Engine]
                                    ↓
                       [Amount > ₹50,000?]
                       ├── Yes → [Manager Approval Task] (Vikram Patel signs off)
                       └── No  → [Auto-Approved] (Zero-touch processing)
                                    ↓
                       [Archive & Audit Log] (Tamper-proof permanent record)
```

---

## 🖥️ 3. Guided Tour: What Each Screen Does

### 1. 📊 Dashboard (`/dashboard`)
- **What it is**: Your command center.
- **What you see**:
  - **4 Live KPI Cards**: How many documents have been processed, your straight-through automation rate, pending approvals, and average processing speed.
  - **AI Insight Card**: A smart summary of your repository with a quick "Upload Document" button.
  - **Document Types Donut Chart**: Shows the percentage breakdown of your files (Invoices, Resumes, Leave Forms, etc.).
  - **Recent Documents Table**: Live feed of the latest uploaded files and their current status (`Processed`, `Extracting`, or `Review Needed`).

---

### 2. 📁 Documents Repository (`/documents`)
- **What it is**: Your organization's central digital filing cabinet.
- **What you can do**:
  - Click **Upload Document** to upload single or batch files.
  - Search by file name, vendor, or category.
  - Filter by document type (`Invoice`, `Receipt`, `Medical Form`, etc.) or status (`Processed`, `Archived`).
  - Switch between a **Table View** and a **Grid View**.
  - Click on any document to open its **Intelligence Studio**.

---

### 3. 🔍 Document Studio (`/documents/[id]`)
- **What it is**: The detailed inspection workstation for any individual file.
- **What you can see**:
  - **Left Side**: The original document preview with interactive bounding boxes showing where the AI extracted each piece of information.
  - **Right Side**:
    - **Extracted Fields**: The exact field values (e.g., Vendor, Invoice No, Total Amount, Due Date) alongside confidence bars (98%, 95%).
    - **Edit & Correct**: If an amount was read slightly off, you can click the edit pencil, update the value, and the change is automatically logged.
    - **Workflow Visualizer**: Shows which stage of the automated pipeline the document is currently in.
    - **Document History**: The timestamped history of who uploaded or reviewed the file.

---

### 4. 💬 AI Assistant (`/assistant`)
- **What it is**: ChatGPT for your company's documents.
- **What you can ask it**:
  - *"Which invoices are above ₹50,000?"*
  - *"Find all contracts expiring next month"*
  - *"Show me medical claims from Apollo Hospitals"*
- **How it works (RAG - Retrieval Augmented Generation)**:
  - Instead of guessing, the AI searches your uploaded documents and quotes the exact document names and amounts as **clickable citations**.

---

### 5. 🔀 Workflows (`/workflows`)
- **What it is**: The automation brain of AI-FLOW.
- **What you can do**:
  - **AI Workflow Synthesizer**: Type in plain English:
    > *"Whenever an invoice above ₹50,000 is uploaded, send it to the department manager for approval. If approved, send it to finance and archive it."*
    The AI will automatically convert your sentence into a multi-node workflow!
  - **Industry Templates**: One-click presets for **Offices (Invoices)**, **Colleges (Scholarships & Leaves)**, **Hospitals (Insurance Pre-Auth)**, and **Logistics (Proof of Delivery)**.
  - **Visual Studio Canvas (`/workflows/builder`)**: Drag and drop nodes (Start Trigger → Document Upload → AI Extraction → Condition → Manager Approval → Outbound API → Archive).

---

### 6. ✅ Approvals (`/approvals`)
- **What it is**: The sign-off inbox for Managers and Admins.
- **How it works**:
  - When an invoice exceeds ₹50,000 or ₹1,00,000, it safely pauses in this inbox.
  - The manager can review the vendor, amount, and original scan.
  - Click **Approve** (triggers celebration confetti and continues the workflow) or **Reject** (asks for a reason and notifies the requester).

---

### 7. 👁️ Human Review (`/review`)
- **What it is**: The safety net for low-confidence scans.
- **Why it exists**:
  - If someone uploads a blurry phone photo or a crumpled receipt, the AI might only be 60% sure about the date or total amount.
  - Instead of making dangerous guesses with money, AI-FLOW flags it for a human operator to verify.
  - Once the operator confirms or edits the field, the document is released back into the automated workflow.

---

### 8. 📋 Tasks (`/tasks`)
- **What it is**: The unified to-do list for your team.
- Combines your **Human Review Tasks** and **Pending Manager Approvals** in one quick screen.

---

### 9. 🔌 Integrations (`/integrations`)
- **What it is**: Connects AI-FLOW to your existing software.
- Available pre-built integrations:
  - **Email (SMTP / Resend)**: Sends automatic notifications when approvals are required.
  - **Slack**: Sends messages into your company Slack channel with one-click approve buttons.
  - **Enterprise Webhook & REST API**: Posts approved invoice data straight into ERP systems (SAP, Oracle, Tally, Zoho).
  - **Google Drive**: Pulls scanned PDFs automatically from a designated Google Drive folder.

---

### 10. 📈 Analytics & AI Observability (`/analytics` & `/analytics/ai`)
- **Platform Analytics**: Shows graphs of document volume, percentage of documents that required zero human touch, and system response times.
- **AI Observability**: Shows technical metrics: token usage, AI inference latency, and precision/recall accuracy scores.

---

### 11. 🛡️ Audit Logs (`/audit-logs`)
- **What it is**: The tamper-proof diary of your organization.
- Every single time a document is uploaded, scanned, approved, rejected, edited, or archived, a timestamped entry is recorded with the user's name and exact change details.
- Complies with ISO, SOC2, and enterprise compliance requirements.

---

## 🚀 4. How to Run the App (Quick Start)

### Step 1: Open Terminal in the project folder
```powershell
cd d:\SkillProject
```

### Step 2: Start the development server
```powershell
npm run dev
```

### Step 3: Open your browser
Navigate to:
```
http://localhost:3000
```

### 👤 Switch Between Demo Roles:
Click on the user avatar in the bottom-left sidebar to switch between:
1. **Anikesh Sharma** — `ADMIN` (Symbiosis University)
2. **Sarah Chen** — `ADMIN` (Full System Access)
3. **Vikram Patel** — `MANAGER` (Signs off on invoices > ₹50k)
4. **Elena Rostova** — `APPROVER` (Reviews medical & insurance forms)
5. **Rahul Sharma** — `EMPLOYEE` (Uploads documents)

---

## ❓ 5. Common Questions & Answers

### Q: Why is my dashboard showing 0 documents right now?
**A:** We just cleared all the pre-fed demo data so that you have a **100% clean, blank slate**. When you upload your first real PDF or image, the counts will start tracking your actual documents in real time!

### Q: Can AI execute dangerous financial actions on its own?
**A:** **No.** One of the core architecture principles of AI-FLOW is **separation of AI from deterministic business rules**. AI only reads, extracts, and summarizes. The **Rule Engine** decides if a human manager must sign off before any money moves or ERP sync happens.

### Q: Can I run automated tests?
**A:** Yes, anytime! Run:
```powershell
npm test
```
All unit tests will execute and confirm that the document pipeline, rule engine, RBAC security, and search algorithms are functioning with 100% success.
