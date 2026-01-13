# GigFlow - Mini Freelance Marketplace

GigFlow is a full-stack MERN application that allows users to post gigs, submit bids, and hire freelancers. When a freelancer is hired, all other bids for that gig are automatically rejected.

## Tech Stack

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**: Database and ODM.
- **JWT (JSON Web Tokens)**: Authentication stored in HttpOnly cookies.
- **Bcryptjs**: Password hashing.
- **Dotenv**: Environment variable management.

### Frontend
- **React (Vite)**
- **Tailwind CSS**: Modern, premium styling with glassmorphism.
- **Axios**: API requests with credentials.
- **React Router**: Client-side routing.
- **Context API**: Authentication state management.

---

## Features

- **User Authentication**: Secure registration and login.
- **Gig Management**:
  - View all open gigs with real-time search.
  - View detailed gig information.
  - Post new gigs (authenticated users).
- **Bidding System**:
  - Submit bids with a custom message and price.
  - Only gig owners can see bids on their own gigs.
- **Hiring Logic**:
  - Owners can hire a freelancer with a single click.
  - Hiring updates gig status to "assigned".
  - Automatically rejects all other pending bids for the same gig.
  - Prevents double hiring or race conditions.

---

## How to Run Locally

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (running locally or a Cloud URI)

### 2. Backend Setup
1. Navigate to the `gigflow-backend` directory.
2. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gigflow
   JWT_SECRET=your_secret_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server (development mode):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `gigflow-frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Hiring Logic Implementation details

The hiring logic is implemented as a single transaction-like operation in `routes/bids.js`:
- It verifies the requester is the owner.
- It checks if the gig is still "open".
- It updates the gig status.
- It updates the specific bid status.
- it uses `updateMany` to reject all other competitive bids in one database operation.

---

## Project Structure

```text
gigflow-backend/
 ├── models/ (User, Gig, Bid)
 ├── routes/ (auth, gigs, bids)
 ├── middleware/ (auth layer)
 └── server.js
gigflow-frontend/
 ├── src/
 │   ├── api/ (axios config)
 │   ├── components/ (Layout, Navbar)
 │   ├── context/ (Auth state)
 │   └── pages/ (Register, Login, Gigs, Detailed view, Posting)
```
