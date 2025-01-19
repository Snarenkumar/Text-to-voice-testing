import express from 'express';
import bodyParser from 'body-parser';
import { TextToSpeechClient } from '@google-cloud/text-to-speech'; // Import Google Cloud Text-to-Speech library
import fs from 'fs';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Google Cloud Text-to-Speech client
const client = new TextToSpeechClient();

// Handle POST request to generate audio
app.post("/generate-audio", async (req, res) => {
    const { text, language, voice, rate, pitch } = req.body;

    console.log("Received request with text:", text, "language:", language, "voice:", voice, "rate:", rate, "pitch:", pitch);

    // Validate required fields
    if (!text || !language || !voice) {
        return res.status(400).send("Text, language, and voice are required");
    }

    try {
        // Construct request for Google Text-to-Speech API
        const request = {
            input: { text }, // Text to convert to speech
            voice: {
                languageCode: language,
                name: voice, // Specific voice name
            },
            audioConfig: {
                audioEncoding: "MP3", // Output format
                speakingRate: rate || 1.0, // Default rate
                pitch: pitch || 0, // Default pitch
            },
        };

        // Gcscsasdensadasdasderasadaste ausadasddio dsasdasdqweasda Googlqweasdasdasase Teasdassadasdssasdaxt-to-Spsadaeecasqweqwedash 
        const [response] = await client.synthesizeSpeech(request);

        // Save the audio content to a file
        const outputFilePath = path.join(__dirname, 'output.mp3');
        await util.promisify(fs.writeFile)(outputFilePath, response.audioContent, 'binary');
        console.log(`Audio content written to file: ${outputFilePath}`);

        // Send the audio file to the client
        res.sendFile(outputFilePath, (err) => {
            if (err) {
                console.error("Error sending audio file:", err);
                res.status(500).send("Error sending audio file");
            }
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("Error generating audio");
    }
});

// Root endpoint
app.get("/", (req, res) => {
    res.send("Welcome to the Text-to-Speech API. Use the POST /generate-audio endpoint to generate audio.");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.use(express.static('public')); // Serve static files from the 'public' folder
