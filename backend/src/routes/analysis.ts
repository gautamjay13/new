import express, { type Request, type Response } from "express";

const router = express.Router();

// Get analysis summary
router.get("/summary", (_req: Request, res: Response) => {
  // In a real app, this would fetch from database
  // For now, return a placeholder
  res.json({
    message: "Use POST /api/upload/analyze to upload and analyze CSV files",
  });
});

export { router as analysisRouter };
