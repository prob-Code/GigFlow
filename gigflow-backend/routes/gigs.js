import express from "express";
import Gig from "../models/Gig.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id
    });

    res.status(201).json(gig);
  } catch {
    res.status(500).json({ message: "Failed to create gig" });
  }
});
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    const gigs = await Gig.find({
      status: "open",
      title: { $regex: search, $options: "i" }
    }).populate("ownerId", "name");

    res.json(gigs);
  } catch {
    res.status(500).json({ message: "Failed to fetch gigs" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("ownerId", "name email");
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  } catch {
    res.status(500).json({ message: "Failed to fetch gig" });
  }
});

export default router;
