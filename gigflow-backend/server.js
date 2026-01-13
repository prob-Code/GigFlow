import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import gigRoutes from "./routes/gigs.js";
import authRoutes from "./routes/auth.js";
import bidRoutes from "./routes/bids.js";
import Gig from "./models/Gig.js";
import User from "./models/User.js";

dotenv.config();
const app = express();

// Trust proxy for secure cookies on Render
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

// Seed Route (Convenience for "More Works")
app.post("/api/seed", async (req, res) => {
  try {
    let admin = await User.findOne();
    
    // Create a dummy system user if no one has registered yet
    if (!admin) {
      admin = await User.create({
        name: "GigFlow System",
        email: "system@gigflow.com",
        password: "hashed_dummy_password"
      });
    }

    const seedGigs = [
      { title: "iOS App Motion Design", description: "Looking for an expert to refine transitions in an Apple-style health app. Must understand SF Symbols and fluid mechanics.", budget: 2500, ownerId: admin._id, status: "open" },
      { title: "E-commerce Glassmorphism UI", description: "Redesigning a storefront with massive backdrop blurs and futuristic aesthetics. High precision required.", budget: 1800, ownerId: admin._id, status: "open" },
      { title: "React Performance Audit", description: "Need a senior engineer to optimize our MERN stack app to hit 60fps on mobile. Focus on memoization and bundle size.", budget: 3000, ownerId: admin._id, status: "open" },
      { title: "Premium Iconography Set", description: "Create 50 custom vector icons following Apple's Human Interface Guidelines.", budget: 1200, ownerId: admin._id, status: "open" }
    ];

    await Gig.deleteMany({ title: { $in: seedGigs.map(g => g.title) } });
    await Gig.insertMany(seedGigs);
    res.json({ message: "Seed successful! Gigs added." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("GigFlow API Running");
});

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
