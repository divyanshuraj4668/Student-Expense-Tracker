const STORAGE_KEY = "studentExpenseTrackerTransactions";
let transactions = [];
let expenseChart = null;

const transactionForm = document.getElementById("transaction-form");
const typeInput = document.getElementById("type");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const searchInput = document.getElementById("search");
const transactionList = document.getElementById("transaction-list");
const transactionEmpty = document.getElementById("transaction-empty");
const searchEmpty = document.getElementById("search-empty");
const clearAllButton = document.getElementById("clear-all");
const chartCanvas = document.getElementById("expense-chart");
const chartEmpty = document.getElementById("chart-empty");

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
    dateInput.value = getTodayDate();
    loadTransactions();
    updateDashboard();
    renderTransactions();
    renderChart();
    transactionForm.addEventListener("submit", addTransaction);
    searchInput.addEventListener("input", renderTransactions);
    clearAllButton.addEventListener("click", clearAllTransactions);
}

function getTodayDate() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function addTransaction(event) {
    event.preventDefault();
    const description = descriptionInput.value.trim();
    const category = categoryInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const type = typeInput.value;

    if (!description || !category || !date || amount <= 0) {
        alert("Please enter valid transaction details.");
        return;
    }

    transactions.push({ id: Date.now(), type, description, category, amount, date });
    saveTransactions();
    transactionForm.reset();
    dateInput.value = getTodayDate();
    typeInput.value = "expense";
    updateDashboard();
    renderTransactions();
    renderChart();
}

function deleteTransaction(id) {
    if (!confirm("Delete this transaction?")) return;
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions();
    updateDashboard();
    renderTransactions();
    renderChart();
}

function clearAllTransactions() {
    if (transactions.length === 0) {
        alert("There are no transactions to clear.");
        return;
    }
    if (!confirm("Are you sure you want to clear all transactions?")) return;
    transactions = [];
    saveTransactions();
    updateDashboard();
    renderTransactions();
    renderChart();
}

function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function loadTransactions() {
    const storedTransactions = localStorage.getItem(STORAGE_KEY);
    if (!storedTransactions) {
        transactions = [];
        return;
    }
    try {
        transactions = JSON.parse(storedTransactions);
        if (!Array.isArray(transactions)) transactions = [];
    } catch (error) {
        console.error("Could not load saved transactions:", error);
        transactions = [];
    }
}

function calculateTotals() {
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach(transaction => {
        if (transaction.type === "income") totalIncome += Number(transaction.amount);
        else totalExpenses += Number(transaction.amount);
    });
    return { income: totalIncome, expenses: totalExpenses, balance: totalIncome - totalExpenses };
}

function updateDashboard() {
    const totals = calculateTotals();
    document.getElementById("total-income").textContent = formatCurrency(totals.income);
    document.getElementById("total-expenses").textContent = formatCurrency(totals.expenses);
    document.getElementById("current-balance").textContent = formatCurrency(totals.balance);
}

function renderTransactions() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredTransactions = transactions.filter(transaction => {
        const searchableText = [transaction.description, transaction.category, transaction.type].join(" ").toLowerCase();
        return searchableText.includes(searchTerm);
    }).sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id);

    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionEmpty.hidden = false;
        searchEmpty.hidden = true;
    } else if (filteredTransactions.length === 0) {
        transactionEmpty.hidden = true;
        searchEmpty.hidden = false;
    } else {
        transactionEmpty.hidden = true;
        searchEmpty.hidden = true;
    }

    filteredTransactions.forEach(transaction => {
        const row = document.createElement("tr");
        const descriptionCell = document.createElement("td");
        const categoryCell = document.createElement("td");
        const dateCell = document.createElement("td");
        const typeCell = document.createElement("td");
        const amountCell = document.createElement("td");
        const actionCell = document.createElement("td");
        const typeBadge = document.createElement("span");
        const deleteButton = document.createElement("button");

        descriptionCell.textContent = transaction.description;
        categoryCell.textContent = transaction.category;
        dateCell.textContent = formatDate(transaction.date);
        typeBadge.className = `type-badge type-${transaction.type}`;
        typeBadge.textContent = transaction.type;
        typeCell.appendChild(typeBadge);
        amountCell.className = transaction.type === "income" ? "amount-income" : "amount-expense";
        amountCell.textContent = `${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}`;
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${transaction.description}`);
        deleteButton.addEventListener("click", () => deleteTransaction(transaction.id));
        actionCell.appendChild(deleteButton);

        row.append(descriptionCell, categoryCell, dateCell, typeCell, amountCell, actionCell);
        transactionList.appendChild(row);
    });
}

function renderChart() {
    const expenseTransactions = transactions.filter(transaction => transaction.type === "expense");
    const categoryTotals = {};

    expenseTransactions.forEach(transaction => {
        if (!categoryTotals[transaction.category]) categoryTotals[transaction.category] = 0;
        categoryTotals[transaction.category] += Number(transaction.amount);
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    if (expenseChart) {
        expenseChart.destroy();
        expenseChart = null;
    }

    if (categories.length === 0) {
        chartCanvas.hidden = true;
        chartEmpty.hidden = false;
        return;
    }

    chartCanvas.hidden = false;
    chartEmpty.hidden = true;
    expenseChart = new Chart(chartCanvas, {
        type: "doughnut",
        data: {
            labels: categories,
            datasets: [{ data: amounts, borderWidth: 2, borderColor: "#ffffff" }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom", labels: { padding: 16, usePointStyle: true, font: { size: 12 } } },
                tooltip: { callbacks: { label: context => `${context.label}: ${formatCurrency(context.raw)}` } }
            }
        }
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function formatDate(dateString) {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
