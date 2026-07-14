import {
  getServices,
  getBranches,
  getAvailableDates,
  getAvailableTimeSlots,
  createAppointmentDeepLink
} from "../services/igovttService.js";

import express from "express";
const router = express.Router();

router.get("/services", async (req, res) => {
  try {
    const result = await getServices();
    return res.json(result);
  } catch (error) {
    console.error("Unable to retrieve services:", error);

    return res.status(500).json({
      error: "Unable to retrieve services"
    });
  }
});

router.post("/branches", async (req, res) => {
  try {
    const { serviceId } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        error: "serviceId is required"
      });
    }

    console.log("Listing branches for serviceId:", serviceId);

    const result = await getBranches({ serviceId });

    console.log("Branches result:", JSON.stringify(result));

    return res.json(result);
  } catch (error) {
    console.error("Unable to retrieve branches:", error);

    return res.status(500).json({
      error: "Unable to retrieve branches",
      details: error.message
    });
  }
});

router.post("/appointment-deeplink", async (req, res) => {
  try {
    const { serviceId, branchId } = req.body;

    if (!serviceId || !branchId) {
      return res.status(400).json({
        error: "serviceId and branchId are required"
      });
    }

    const result = await createAppointmentDeepLink({
      serviceId,
      branchId
    });

    return res.json(result);
  } catch (error) {
    console.error("Unable to create appointment link:", error);

    return res.status(500).json({
      error: "Unable to create appointment link"
    });
  }
});

router.post("/available-dates", async (req, res) => {
  try {
    const { serviceId, branchId } = req.body;

    if (!serviceId || !branchId) {
      return res.status(400).json({
        error: "serviceId and branchId are required"
      });
    }

    const result = await getAvailableDates({
      serviceId,
      branchId
    });

    return res.json(result);
  } catch (error) {
    console.error("Unable to retrieve available dates:", error);

    return res.status(500).json({
      error: "Unable to retrieve available dates"
    });
  }
});

router.post("/available-time-slots", async (req, res) => {
  try {
    const {
      serviceId,
      branchId,
      selectedDate
    } = req.body;

    if (!serviceId || !branchId || !selectedDate) {
      return res.status(400).json({
        error:
          "serviceId, branchId and selectedDate are required"
      });
    }

    const result = await getAvailableTimeSlots({
      serviceId,
      branchId,
      selectedDate
    });

    return res.json(result);
  } catch (error) {
    console.error(
      "Unable to retrieve available time slots:",
      error
    );

    return res.status(500).json({
      error: "Unable to retrieve available time slots"
    });
  }
});

export default router;