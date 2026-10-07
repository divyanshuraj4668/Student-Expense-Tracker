# Student Expense Tracker

A simple browser-based expense tracker designed as a practical final-year student project. It helps students record income and expenses, view their current balance, search transaction history, and understand spending by category.

## Overview

The Student Expense Tracker is a client-side web application. All transaction data is stored in the browser using `localStorage`, so the data remains available after refreshing the page.

The project intentionally uses a small technology stack and straightforward JavaScript so that the complete application can be understood and explained easily in a fresher-level technical interview.

## Features

- Dashboard with Total Income, Total Expenses, and Current Balance
- Add income or expense transactions
- Student-friendly expense categories
- Transaction history table
- Delete individual transactions
- Dynamic search by description, category, or transaction type
- Category-wise expense visualization using Chart.js
- Browser data persistence using `localStorage`
- Clear All option with confirmation
- Responsive desktop and mobile layout
- Clear empty states

## Tech Stack

- **HTML5** — page structure and form elements
- **CSS3** — responsive layout and visual styling
- **Vanilla JavaScript** — application logic, calculations, DOM updates, search, and events
- **Chart.js** — expense category doughnut chart
- **Browser localStorage** — client-side transaction persistence

No React, Node.js, backend server, database, authentication, or build system is required.

## How It Works

```text
User Input
    ↓
JavaScript Transaction Object
    ↓
localStorage
    ↓
Calculations
    ↓
UI Rendering
    ↓
Chart.js Visualization
```

When the form is submitted, JavaScript creates a transaction object containing its type, description, category, amount, date, and ID. It is added to the `transactions` array and saved to `localStorage` as JSON.

The dashboard totals, transaction table, and chart are then rendered again. When the page is opened again, `loadTransactions()` reads the saved JSON data and restores the transaction array.

## Project Structure

```text
student-expense-tracker/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── screenshots/
│   └── README.md
│
├── README.md
│
└── .gitignore
```

## How to Run

### Option 1 — Open Directly

1. Download or clone the repository.
2. Open `index.html` in a modern web browser.
3. Start adding transactions.

### Option 2 — VS Code Live Server

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

The project uses Chart.js from a CDN, so an internet connection is required for the chart library when the application is loaded.

## Screenshots

Screenshots can be added to the `screenshots/` directory and linked here later.

Example:

```markdown
![Dashboard](screenshots/dashboard.png)
```

## Future Improvements

These features are **not implemented** in the current version:

- CSV export
- Monthly budgets
- Monthly spending reports
- Cloud database storage
- User authentication
- Dark mode

## Limitations

This is a client-side student project. Data is stored only in the current browser using `localStorage`.

That means data is not automatically synchronized between devices, clearing browser storage can remove saved transactions, and there is no user account or cloud backup.

## Author

**Student Project**

Built as a final-year B.Tech portfolio project to demonstrate fundamentals of HTML, CSS, JavaScript, browser storage, DOM manipulation, and basic data visualization.
