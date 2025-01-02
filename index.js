const express = require('express');
const bodyParser = require('body-parser');
const gTTS = require('gtts'); // Text-to-speech library
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views folder
app.use(express.static(path.join(__dirname, 'public'))); // For static assets like styles

// Route to render the HTML form
app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs
});

// Route to handle the form submission
app.post('/done', (req, res) => {
    const text = req.body.text;
    const language = 'en'; // Language for TTS

    const gtts = new gTTS(text, language);
    const filePath = path.join(__dirname, 'public', 'output.mp3');

    gtts.save(filePath, (err, result) => {
        if (err) {
            console.error(err);
            res.send('Error generating speech. Please try again.');
        } else {
            res.render('done', { audioFile: '/output.mp3' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
