PDF Upload and Processing Server
Overview
This project is a Node.js server that allows users to upload a PDF file and an OpenAI API key. The server processes the PDF to extract text and sends it to the OpenAI API for summarization or formatting. If any errors occur during the process, users are redirected to a custom error page with a relevant message.

Technologies Used
Node.js
Express.js
Multer (for handling file uploads)
pdf-parse (for extracting text from PDFs)
Axios (for making HTTP requests to the OpenAI API)
Setup
Prerequisites
Node.js (v14 or later recommended)
An OpenAI API key
Installation
Clone the Repository

bash
Copy code
git clone <repository-url>
cd <repository-directory>
Install Dependencies

bash
Copy code
npm install
Create an .env File

Create a .env file in the root directory to store environment variables. Add the following variables:

plaintext
Copy code
OPENAI_API_KEY=your_openai_api_key_here
Create uploads/ Directory

Make sure the uploads/ directory exists, as this is where uploaded files will be temporarily stored.

bash
Copy code
mkdir uploads
Usage
Start the Server

bash
Copy code
npm start
The server will start on http://localhost:3000.

Upload a PDF

Navigate to http://localhost:3000 in your browser.
Select a PDF file and enter your OpenAI API key.
Click "Generate HTML Resume" to upload the PDF.
View Results

If the upload and processing are successful, the generated resume will be displayed in HTML format.

Handle Errors

If an error occurs (e.g., quota exceeded or missing file/API key), you will be redirected to an error page with a descriptive message.

Error Handling
Missing File or API Key: Redirects to /error with a message indicating that either the PDF file or API key is missing.
Quota Exceeded: Redirects to /error with a message indicating that the OpenAI API quota has been exceeded.
General Errors: Redirects to /error with a generic error message.
Code Explanation
Server Setup:

express handles HTTP requests.
multer is used for file uploads.
pdf-parse extracts text from PDF files.
axios sends HTTP requests to the OpenAI API.
Routes:

GET /: Serves the main HTML file for uploading PDFs.
POST /upload: Handles file upload, text extraction, and OpenAI API request. Redirects to an error page if an error occurs.
GET /error: Serves the custom error page.
Custom Error Page
The error page (error.html) displays a user-friendly message based on the error type. Ensure that error.html is located in the root directory of the project.

Troubleshooting
Error Page Not Showing: Verify that error.html is in the correct directory and that file paths are correct.
Quota Issues: Check your OpenAI API quota and billing details.
License
This project is licensed under the MIT License - see the LICENSE file for details.