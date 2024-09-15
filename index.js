const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the error page
app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'error.html'));
});

// Handle PDF upload and processing
app.post('/upload', upload.single('pdf'), async (req, res) => {
  const { file } = req;
  const { apiKey } = req.body;

  if (!file || !apiKey) {
    return res.redirect('/error?message=PDF file or OpenAI API key missing');
  }

  try {
    // Parse PDF text
    const pdfBuffer = fs.readFileSync(file.path);
    const pdfText = (await pdfParse(pdfBuffer)).text;

    // Send text to OpenAI for summarization or formatting
    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo", // Ensure the model is available
      messages: [
        { role: "system", content: "Extract and format a resume from the provided text." },
        { role: "user", content: `Here is the PDF content:\n${pdfText}` }
      ],
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Check the response structure
    const formattedResume = openaiResponse.data.choices[0].message.content || openaiResponse.data.choices[0].text;

    // Send the formatted resume as an HTML response
    res.send(`
      <html>
      <body>
        <h1>Generated Resume</h1>
        <pre>${formattedResume}</pre>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error with OpenAI API or file processing:", error.response ? error.response.data : error.message);
    if (error.response && error.response.data.error.code === 'insufficient_quota') {
      res.redirect('/error?message=Quota exceeded. Please check your plan and billing details.');
    } else {
      res.redirect('/error?message=Error processing the PDF or using OpenAI API');
    }
  }
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
