import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import connectDB from "./db/index.js";
import { app } from "./app.js";

const startServer = async () => {
  try {
    // 1. Connect to the database
    await connectDB();

    // 2. Set up an error listener on the app
    app.on("error", (error) => {
      console.error("ERROR: ", error);
      throw error; // Or handle it as needed
    });

    // 3. Define the port
    const port = process.env.PORT || 8080;

    // 4. Start the server
    app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server is running on port: ${port}`);
      console.log(`🌐 Accessible from: http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ MONGO DB connection failed !!! ", err);
    process.exit(1); // Exit the process with failure
  }
};

startServer();
