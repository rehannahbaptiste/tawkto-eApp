import express from "express";
import {
  createAppointmentDeepLink,
  getServices
} from "../services/igovttService.js";

const router = express.Router();

router.get("/services", async (req, res) => {
  try {
    const result = await getServices();
    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to retrieve services"
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

    const result = await createAppointmentDeepLink({ serviceId, branchId });

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to create appointment link"
    });
  }
});

export default router;