import express from "express";

import {
  getTourByID,
  getTourDetail,
  getListToursAfterNow,
  bookTour,
} from "../controllers/tourController.js";

const router = express.Router();

// tours Routes
// GET tour bu ID
router.post("/tour", getTourByID);
// GET tour detail
router.post("/tourDetail", getTourDetail);
// GET list of current tours
router.get("/getCurrentTours", getListToursAfterNow);
// POST book a tour
router.post("/bookTour", bookTour);

export default router;
