import fetch from 'node-fetch'; // Import fetch for making HTTP requests
import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs'; // File system module for saving files
import path from 'path'; // Utility for handling file paths
import { fileURLToPath } from "url";
const port = 3030;
const app = express();

const link = "https://text-to-speach-v4pi.onrender.com/generate-audio"
const __filename = fileURLToPath(import.meta.url); // Get the current file's path
const __dirname = path.dirname(__filename);
// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // To parse JSON bodies

// Set up EJS view engine
app.set("view engine", "ejs");
app.set("views", "./views"); // Ensure your templates are in the 'views' directory

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve the form
app.get("/", (req, res) => {
    res.render("index"); // Render index.ejs template for the form
});

// Handle form submission and send data to the backend server
app.post("/done", async (req, res) => {
    const { text, language,voice,rate,pitch } = req.body;

    console.log("Received Text:", text, "Received Language:", language, "Received voice:", voice , "Received rate:", rate , "Received pitch:", pitch  ); // Debugging log

    if (!text || !language) {
        return res.status(400).send("Text and language are required");
    }

    try {
        const response = await fetch("http://localhost:3000/generate-audio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, language }), // Send data as JSON
        });
        console.log(response)

        if (!response.ok) {
            throw new Error("Error generating audio");
        }

        const audioBuffer = await response.arrayBuffer(); // Get the audio as an ArrayBuffer
        const buffer = Buffer.from(audioBuffer); // Convert ArrayBuffer to Node.js Buffer

        const filePath = path.join(__dirname, "public", "output.mp3"); // Path to save the file

        // Save the file to the 'public' directory
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                console.error("Error saving the file:", err);
                return res.status(500).send("Error saving the file");
            }
            console.log("File saved successfully:", filePath);
            res.status(200).send("Audio file generated and saved successfully");
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("Error processing request");
    }
});

// Start the client server
app.listen(port, () => {
    console.log(`Client-side server is running on http://localhost:${port}`);
});
