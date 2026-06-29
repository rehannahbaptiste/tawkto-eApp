import express from "express";

const router = express.Router();

router.get("/services", async (req, res) => {
  return res.json({
    services: [
      {
        id: 1,
        name: "Business Registration",
        description: "Register a business.",
      },
      {
        id: 2,
        name: "Birth Certificate",
        description: "Apply for a birth certificate.",
      },
    ],
  });
});

export default router;