import { app } from './app.js';
import dotenv from 'dotenv';
import connectDB from './db/index.js';

// Load environment variables from .env file
// Ensure this is at the very top of your main application file
dotenv.config({
    path: './.env' // This path is relative to the directory where you run the node command
});

const PORT = process.env.PORT || 8001;

// --- Debugging Check ---
// Log the value of MONGO_URI to confirm it's being loaded correctly
console.log("Attempting to connect with MONGO_URI:", process.env.MONGO_URI);

// Important: Check if MONGO_URI is defined before attempting to connect
if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in environment variables. Please check your .env file.");
    process.exit(1); // Exit the process if the critical variable is missing
}
// --- End Debugging Check ---


// Connect to the database, then start the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        // This catch block handles errors from connectDB()
        console.error(`Error starting server after DB connection attempt:`, error);
        process.exit(1); // Exit if DB connection fails
    });

    
