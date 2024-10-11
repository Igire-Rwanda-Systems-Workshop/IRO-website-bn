// routes/contentRoutes.js
import express from "express";
import contentControllers from "../controllers/contentController.js";
const router = express.Router();

// Define the routes for content management
router.post("/ourHist_create", contentControllers.createContent);
router.get("/get", contentControllers.getContent);
router.put("/update/:id", contentControllers.updateContent);
router.delete("/delete/:id", contentControllers.deleteContent);

// Export the router
export default router;
