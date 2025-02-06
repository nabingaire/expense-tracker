const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category'); // New category input
const categoryFilter = document.getElementById('category-filter'); // Category filter input

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions =
    localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
            category: category.value // Include category
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
        category.value = 'Food'; // Reset category to default
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    // Get sign for amount
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Add class based on transaction amount
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    // Display transaction details, including category
    item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> 
    <span class="category">${transaction.category}</span> 
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

    list.appendChild(item);
}

// Update the balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
        -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Filter transactions based on selected category
function filterTransactions() {
    const selectedCategory = categoryFilter.value;
    list.innerHTML = '';

    let filteredTransactions = transactions;

    if (selectedCategory !== 'All') {
        filteredTransactions = transactions.filter(transaction => transaction.category === selectedCategory);
    }

    filteredTransactions.forEach(addTransactionDOM);
}

init();

// Event listeners
form.addEventListener('submit', addTransaction);
categoryFilter.addEventListener('change', filterTransactions);