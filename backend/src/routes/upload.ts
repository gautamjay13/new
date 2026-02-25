import express, { type Request, type Response } from "express";
import multer from "multer";
import { parseCSV } from "../utils/csvParser.js";
import { FraudDetector } from "../services/fraudDetector.js";
import { NetworkGraphGenerator } from "../services/networkGraph.js";
import type { AnalysisResult } from "../types/transaction.js";

const router = express.Router();

// Configure multer with file size limits
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Store analysis results in memory (in production, use a database)
const analysisCache = new Map<string, AnalysisResult>();

router.post("/analyze", upload.single("file"), async (req: Request, res: Response) => {
  try {
    console.log("Upload request received");
    console.log("File:", req.file ? { name: req.file.originalname, size: req.file.size } : "No file");
    
    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate file type
    if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
      return res.status(400).json({ error: "File must be a CSV file" });
    }

    const startTime = Date.now();

    // Parse CSV
    console.log("Parsing CSV...");
    const transactions = parseCSV(req.file.buffer);
    console.log(`Parsed ${transactions.length} transactions`);

    if (transactions.length === 0) {
      return res.status(400).json({ error: "No valid transactions found in CSV. Please check the file format." });
    }

    // Process transactions
    console.log("Processing transactions for fraud detection...");
    const detector = new FraudDetector();
    detector.processTransactions(transactions);

    // Generate network graph
    console.log("Generating network graph...");
    const graphGenerator = new NetworkGraphGenerator();
    const networkGraph = graphGenerator.generateGraph(
      detector.getTransactions(),
      detector.getAccountStats(),
      detector.getSuspiciousAccounts()
    );

    const processingTime = (Date.now() - startTime) / 1000;

    // Build result
    const result: AnalysisResult = {
      summary: {
        totalAccounts: detector.getAccountStats().size,
        suspiciousAccounts: detector.getSuspiciousAccounts().length,
        fraudRings: detector.getFraudRings().length,
        processingTime: Math.round(processingTime * 100) / 100,
      },
      suspiciousAccounts: detector.getSuspiciousAccounts(),
      fraudRings: detector.getFraudRings(),
      networkGraph,
    };

    // Cache result (use file hash or ID in production)
    const cacheKey = req.file.originalname + req.file.size;
    analysisCache.set(cacheKey, result);

    console.log("Analysis complete:", {
      totalAccounts: result.summary.totalAccounts,
      suspiciousAccounts: result.summary.suspiciousAccounts,
      fraudRings: result.summary.fraudRings,
      processingTime: result.summary.processingTime,
    });

    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    res.status(500).json({
      error: "Failed to analyze transactions",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export { router as uploadRouter };
