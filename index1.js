import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // For making HTTP requests to external services
import gTTS from 'gtts';  // Google Text-to-Speech library
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Handle POST request to generate audio
app.post("/generate-audio", (req, res) => {
    const { text, language } = req.body;

    // Debugging log to ensure text and language are received properly
    console.log("Received request with text:", text, "and language:", language);

    // Check if both text and language are provided
    if (!text || !language) {
        console.log("Error: Text and language are required");
        return res.status(400).send("Text and language are required");
    }

    try {
        // Convert text to speech using gTTS
        const gtts = new gTTS(text, language);  
        const filePath = path.join(__dirname, 'output.mp3'); // Path to save the audio file

        console.log("Saving audio to:", filePath);

        gtts.save(filePath, (err) => {
            if (err) {
                console.error("Error generating audio:", err);
                return res.status(500).send("Error generating audio");
            }

            // Log success and send the generated audio file
            console.log("Audio file generated successfully. Sending file:", filePath);
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error("Error sending audio file:", err);
                    res.status(500).send("Error sending audio file");
                }
            });
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("Error processing request");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
app.get("/", (req, res) => {
    res.send("Welcome to the Text-to-Speech API. Use the POST /generate-audio endpoint to generate audio.");
});
