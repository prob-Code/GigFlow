import express from "express";
import auth from "../middleware/auth.js";
import Gig from "../models/Gig.js";
import Bid from "../models/Bid.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { gigId, message, price, contact, upiId } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== "open") {
      return res.status(400).json({ message: "Gig not open" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price,
      freelancerContact: contact,
      freelancerUpi: upiId
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit bid" });
  }
});

router.get("/:gigId", auth, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const bids = await Bid.find({ gigId: gig._id })
      .populate("freelancerId", "name email");

    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bids" });
  }
});

router.patch("/:bidId/hire", auth, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const gig = await Gig.findById(bid.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (gig.status === "assigned") {
      return res.status(400).json({ message: "Gig already assigned" });
    }

    // 1️⃣ Assign gig
    gig.status = "assigned";
    await gig.save();

    // 2️⃣ Hire selected bid
    bid.status = "hired";
    await bid.save();

    // 3️⃣ Reject others
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    res.json({ message: "Freelancer hired successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hiring failed" });
  }
});

// 4️⃣ Mark Initial Payment (50%) as Paid
router.patch("/:bidId/pay-initial", auth, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const gig = await Gig.findById(bid.gigId);
    if (gig.ownerId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    bid.initialPaymentPaid = true;
    await bid.save();
    res.json({ message: "Advance payment marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// 5️⃣ Mark Final Payment (50%) as Paid
router.patch("/:bidId/pay-final", auth, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const gig = await Gig.findById(bid.gigId);
    if (gig.ownerId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    bid.finalPaymentPaid = true;
    await bid.save();
    res.json({ message: "Final payment marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;
