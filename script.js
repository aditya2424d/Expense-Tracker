

const form = document.getElementById("expenseForm");

const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");

const expenseList = document.getElementById("expenseList");

const totalSpent = document.getElementById("totalSpent");
const monthlySpent = document.getElementById("monthlySpent");

const filterCategory = document.getElementById("filterCategory");
const sortAmount = document.getElementById("sortAmount");




let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let editId = null;


// Set Today's Date

date.value = new Date().toLocaleDateString("en-CA");


// Save Expenses

function saveExpenses() {

    localStorage.setItem("expenses", JSON.stringify(expenses));

}


// Add and Update Expense

form.addEventListener("submit", function(e) {

    e.preventDefault();

    if (title.value.trim() === "" || Number(amount.value) <= 0 ||
        category.value === "" || date.value === "") {

        alert("Please enter valid details");

        return;
    }

    if (editId !== null) {

        expenses = expenses.map(function(item) {

            if (item.id === editId) {

                return {
                    ...item,
                    title: title.value.trim(),
                    amount: Number(amount.value),
                    category: category.value,
                    date: date.value
                };

            }

            return item;

        });

        editId = null;

        document.getElementById("submitBtn").textContent = "Add Expense";

    }

    else {

        const expense = {

            id: Date.now(),

            title: title.value.trim(),

            amount: Number(amount.value),

            category: category.value,

            date: date.value

        };

        expenses.push(expense);

    }

    saveExpenses();

    displayExpenses();

    form.reset();

    date.value = new Date().toLocaleDateString("en-CA");

});


// Display Expenses

function displayExpenses() {

    expenseList.innerHTML = "";

    let data = [...expenses];


    // Filter

    if (filterCategory.value !== "All") {

        data = data.filter(function(item) {

            return item.category === filterCategory.value;

        });

    }


    // Sorting

    if (sortAmount.value === "low") {

        data.sort((a, b) => a.amount - b.amount);

    }

    else if (sortAmount.value === "high") {

        data.sort((a, b) => b.amount - a.amount);

    }

    else if (sortAmount.value === "newest") {

        data.sort((a, b) => b.date.localeCompare(a.date));

    }

    else if (sortAmount.value === "oldest") {

        data.sort((a, b) => a.date.localeCompare(b.date));

    }


    // Show Data

    data.forEach(function(item) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        row.children[0].textContent = item.title;
        row.children[1].textContent = item.category;
        row.children[2].textContent = item.date;
        row.children[3].textContent = "₹" + item.amount;

        row.querySelector(".edit-btn").addEventListener("click", function() {

            editExpense(item.id);

        });

        row.querySelector(".delete-btn").addEventListener("click", function() {

            deleteExpense(item.id);

        });

        expenseList.appendChild(row);

    });


    if (data.length === 0) {

        expenseList.innerHTML = "<tr><td colspan='5'>No Expenses Found</td></tr>";

    }

    updateTotal();

}


// Edit Expense

function editExpense(id) {

    const item = expenses.find(function(expense) {

        return expense.id === id;

    });

    if (!item) return;

    title.value = item.title;

    amount.value = item.amount;

    category.value = item.category;

    date.value = item.date;

    editId = id;

    document.getElementById("submitBtn").textContent = "Update Expense";

    form.scrollIntoView({ behavior: "smooth" });

}


// Delete Expense

function deleteExpense(id) {

    if (confirm("Are you sure you want to delete this expense?")) {

        expenses = expenses.filter(function(item) {

            return item.id !== id;

        });

        saveExpenses();

        displayExpenses();

    }

}


// Calculate Total

function updateTotal() {

    let total = expenses.reduce(function(sum, item) {

        return sum + item.amount;

    }, 0);

    totalSpent.textContent = "₹" + total;


    // Current Month Total

    const month = new Date().toLocaleDateString("en-CA").slice(0, 7);

    let monthly = expenses

        .filter(item => item.date.startsWith(month))

        .reduce((sum, item) => sum + item.amount, 0);

    monthlySpent.textContent = "₹" + monthly;

}


// Filter Events

filterCategory.addEventListener("change", displayExpenses);

sortAmount.addEventListener("change", displayExpenses);


// Dark Mode

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}

themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.textContent = "☀️";

    }

    else {

        localStorage.setItem("theme", "light");

        themeBtn.textContent = "🌙";

    }

});


// Initial Display

displayExpenses();
