# Backend Notes

Overview
The backend is an Express + TypeScript server that serves inventory data from a data.csv file. It provides a RESTful API for the frontend to fetch data and apply filters.

# Key Technologies

Express: For handling HTTP requests and responses.
TypeScript: For type safety and improved maintainability.
CSV Parser: To read and process the data.csv file.
CORS Middleware: To allow cross-origin requests from the frontend.
Features

# API Endpoint:

/api/inventory: Serves inventory data from the CSV file.
Supports filtering by vehicle make and date ranges via query parameters.

# CSV Integration:

Parses and loads the CSV file into memory on server start.
Applies filters dynamically based on incoming requests.

# How It Works

The server reads the data.csv file during initialization and parses it into JSON format.
The /api/inventory endpoint:
Accepts query parameters like vehicleMake and duration.
Filters the parsed data based on the parameters and returns the result.
The frontend fetches data from this endpoint and updates the UI accordingly.

# Commands
Start development server:
npx run dev

Build and run for production:
tsc
node dist/server.js

# API Documentation
Endpoint: /api/inventory
Method: GET
Query Parameters:
vehicleMake (optional): Filter by vehicle make (e.g., Toyota, Honda).
duration (optional): Time-based filtering (e.g., last-month, last-3-months).
# Response Format:
[
  {
    "condition": "NEW",
    "description": "2023 Toyota Corolla",
    "product_type": "Sedan",
    "price": 23000
  },
  ...
]
