import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load env variables first!
dotenv.config();

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI environment variable is not set!");
  console.error("Please create a .env file with: MONGO_URI=your_mongodb_connection_string");
  process.exit(1);
}

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
// Log connection status (hide password for security)
const safeUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
console.log(`🔌 Attempting to connect to MongoDB: ${safeUri}`);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   Host: ${mongoose.connection.host}`);
  })
  .catch(error => {
    console.error("❌ MongoDB connection failed!");
    console.error(`   Error: ${error.message}`);
    
    // Provide helpful error messages based on error type
    if (error.message.includes("ENOTFOUND") || error.message.includes("querySrv")) {
      console.error("\n💡 Troubleshooting tips:");
      console.error("   1. Check your MongoDB connection string in .env file");
      console.error("   2. Ensure your MongoDB Atlas cluster is running");
      console.error("   3. Verify your IP address is whitelisted in MongoDB Atlas");
      console.error("   4. Check your username and password are correct");
      console.error("   5. Connection string format should be:");
      console.error("      MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname");
    } else if (error.message.includes("authentication")) {
      console.error("\n💡 Authentication failed. Check your username and password.");
    }
    
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
