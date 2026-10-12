# Expense Tracker

A simple and intuitive web application designed to help users track, manage, and analyze their daily expenses in real-time with a clean pastel lavender aesthetic.

## Repository Link

[https://github.com/DOHA-NA/expense-tracker.git](https://github.com/DOHA-NA/expense-tracker)
## How to run

**Backend**

1. Open PostgreSQL (pgAdmin or psql) and create a new database:

2. Run the `schema.sql` script inside your PostgreSQL tool to create the `expenses` table.

3. Open the project folder in VS Code and create a `.env` file in the root directory with your database details:

   ```
   PORT=3000
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=expense_tracker
   
   ```

4. Install dependencies and start the Express server:

   ```
   npm install
   npm start
   
   ```

**Frontend**

1. Ensure the backend server is running on `http://localhost:3000`.

2. Open `public/index.html` directly in your browser or using VS Code Live Server.

## Features

*Add an expense (with validation)

*  Delete an expense

* Edit an expense

* Filter by category

*  Summary cards (total, count, highest) using CSS Grid

*  Data is saved in a PostgreSQL database

*  Categorical spending progress bars (Bootstrap Progress)

*  Persistent Dark Mode toggle (`localStorage`)

## What was the hardest part?

The most challenging part of this project was transitioning from the default Bootstrap layout to custom CSS Grid for the summary cards while overriding Bootstrap's opinionated styles. Fine-tuning the responsiveness across devices without breaking the layout required careful CSS specificity management. Additionally, handling real-time data persistence between the Express API and PostgreSQL while dynamically updating both the progress bars and dark mode state provided great practice with asynchronous JavaScript.