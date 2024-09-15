




# LinkedIn PDF Resume Generator

## Overview

This project allows users to upload a LinkedIn PDF, which is then processed and formatted into an HTML resume using the OpenAI API. The application includes an error handling page that provides clear feedback in case of issues.

## Setup

### Prerequisites

- Node.js and npm installed
- An OpenAI API key with sufficient quota

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Ensure you have a valid OpenAI API key and set up billing to avoid quota issues.

### Configuration

1. **HTML File (`index.html`)**: This is the front-end form for uploading PDFs and entering the OpenAI API key.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload LinkedIn PDF</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                background-color: #f4f4f4;
            }
            h1 {
                color: #333;
            }
            form {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            label {
                font-weight: bold;
            }
            input[type="file"],
            input[type="text"] {
                padding: 10px;
                width: 100%;
                margin: 10px 0;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            button {
                padding: 10px 20px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            button:hover {
                background-color: #218838;
            }
        </style>
    </head>
    <body>
        <h1>Upload Your LinkedIn PDF</h1>
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <label for="pdf">Select LinkedIn PDF:</label>
            <input type="file" id="pdf" name="pdf" accept="application/pdf" required><br><br>
            
            <label for="apiKey">OpenAI API Key:</label>
            <input type="text" id="apiKey" name="apiKey" required><br><br>
            
            <button type="submit">Generate HTML Resume</button>
        </form>
    </body>
    </html>
    ```

2. **Server Code (`server.js`)**: This file handles the PDF upload, processes it, and communicates with the OpenAI API.

    ```javascript
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

    // Handle PDF upload and processing
    app.post('/upload', upload.single('pdf'), async (req, res) => {
      const { file } = req;
      const { apiKey } = req.body;

      if (!file || !apiKey) {
        return res.status(400).sendFile(path.join(__dirname, 'error.html'));
      }

      try {
        // Parse PDF text
        const pdfBuffer = fs.readFileSync(file.path);
        const pdfText = (await pdfParse(pdfBuffer)).text;

        // Send text to OpenAI for summarization or formatting
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
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
          res.status(503).sendFile(path.join(__dirname, 'error.html'));
        } else {
          res.status(500).sendFile(path.join(__dirname, 'error.html'));
        }
      }
    });

    app.listen(3000, () => {
      console.log('Server started on http://localhost:3000');
    });
    ```

3. **Error Page (`error.html`)**: This page displays a user-friendly message if an error occurs.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                background-color: #f4f4f4;
                text-align: center;
            }
            h1 {
                color: #d9534f;
            }
            p {
                color: #666;
            }
            a {
                color: #0288d1;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <h1>Oops! Something went wrong.</h1>
        <p>We encountered an issue while processing your request. Please check your OpenAI API key and quota, and try again.</p>
        <a href="/">Return to the upload page</a>
    </body>
    </html>
    ```

## Usage

1. Start the server:

    ```bash
    node server.js
    ```

2. Open your browser and go to `http://localhost:3000`.

3. Upload your LinkedIn PDF and enter your OpenAI API key.

4. The application will process the PDF and generate an HTML resume or display an error page if something goes wrong.

## Troubleshooting

- **Quota Issues**: If you see a "Quota exceeded" error, ensure your OpenAI API plan is sufficient and that you have not exceeded your usage limits.
- **File Issues**: Make sure the uploaded file is a valid PDF.
- **API Key**: Verify that your OpenAI API key is correct and has the necessary permissions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

