import {
  getServices,
  getBranches,
  getAvailableDates,
  createAppointmentDeepLink
} from "../services/igovttService.js";

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

    const result = await getBranches({ serviceId });

    return res.json(result);
  } catch (error) {
    console.error("Unable to retrieve branches:", error);

    return res.status(500).json({
      error: "Unable to retrieve branches"
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

export default router;