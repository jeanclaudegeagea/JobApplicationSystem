# JobApplicationSystem

Follow the steps below to set up and run the **JobApplicationSystem** project:

## Prerequisites

Ensure you have the following tools installed on your system:

- **PowerShell** (for Windows users)
- **Chocolatey** (for managing packages)
- **Node.js** (to run `npm` commands)
- **Visual Studio Code** (as the recommended code editor)

---

## Setup Instructions

### 1. Install `make` via Chocolatey

Open PowerShell as Administrator and run the following command:

```powershell
choco install make
```

### 2. Install Frontend Dependencies

Navigate to the `frontend` directory and run:

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Navigate to the `backend` directory and run:

```bash
cd backend
npm install
```

### 4. Set Up MongoDB

Ensure MongoDB is running locally. Use the following URI for your setup:

```env
mongodb://localhost:27017/JobApplication
```

### 5. Run the Application

Open the project in **Visual Studio Code**. Then:

- Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS) to open the Command Palette.
- Select **Run Task**.
- Choose the task named `Run JobApplicationSystem`.

---

## MongoDB Compass Setup Video

For setting up MongoDB Compass, you can follow this [YouTube link](https://youtu.be/gB6WLkSrtJk?si=66zZerdVwkJzxJr7).

---

## Additional Notes

- Ensure all dependencies are installed before running the application.
- If you encounter any issues, check the logs in the terminal for troubleshooting.
