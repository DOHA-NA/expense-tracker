
const API_URL = "http://localhost:3000/api/expenses";

let dataList = []; 

const alertBox = document.getElementById("alertBox");
const loading = document.getElementById("loading");
const tableBody = document.getElementById("tableBody");

const totalVal = document.getElementById("totalVal");
const totalNum = document.getElementById("totalNum");
const maxVal = document.getElementById("maxVal");

const addForm = document.getElementById("addForm");
const editForm = document.getElementById("editForm");
const filterSelect = document.getElementById("filterSelect");

const editModalEl = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalEl);

document.addEventListener("DOMContentLoaded", () => {
    loadData();

    addForm.addEventListener("submit", onAdd);
    editForm.addEventListener("submit", onEdit);
    filterSelect.addEventListener("change", renderUI);
});

function getBadge(cat) {
    if (cat === "Food") return "bg-success";
    if (cat === "Transport") return "bg-info text-dark";
    if (cat === "Bills") return "bg-danger";
    if (cat === "Entertainment") return "bg-warning text-dark";
    return "bg-secondary";
}

function msg(text, type = "danger") {
    alertBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function clearMsg() {
    alertBox.innerHTML = "";
}

function showSpinner(flag) {
    if (flag) {
        loading.classList.remove("d-none");
    } else {
        loading.classList.add("d-none");
    }
}

async function loadData() {
    showSpinner(true);
    clearMsg();

    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to load data");
        }
        dataList = await res.json();
        renderUI();
    } catch (err) {
        msg(err.message);
    } finally {
        showSpinner(false);
    }
}

function renderUI() {
    let count = dataList.length;
    let sum = 0;
    let max = 0;

    dataList.forEach(item => {
        let num = parseFloat(item.amount) || 0;
        sum += num;
        if (num > max) max = num;
    });

    totalNum.textContent = count;
    totalVal.textContent = `$${sum.toFixed(2)}`;
    maxVal.textContent = `$${max.toFixed(2)}`;

    let selected = filterSelect.value;
    let items = selected === "ALL" ? dataList : dataList.filter(x => x.category === selected);

    if (items.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No data found</td></tr>`;
        return;
    }

    tableBody.innerHTML = items.map((item, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${item.title}</td>
            <td class="text-primary fw-bold">$${parseFloat(item.amount).toFixed(2)}</td>
            <td><span class="badge ${getBadge(item.category)}">${item.category}</span></td>
            <td>${item.date || '-'}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="openEdit(${item.id})">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="onDelete(${item.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function onAdd(e) {
    e.preventDefault();

    addForm.classList.add("was-validated");
    if (!addForm.checkValidity()) return;

    let title = document.getElementById("addTitle").value.trim();
    let amount = parseFloat(document.getElementById("addAmount").value);
    let category = document.getElementById("addCategory").value;

    showSpinner(true);
    clearMsg();

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, amount, category })
        });

        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || "Failed to add");

        addForm.reset();
        addForm.classList.remove("was-validated");
        await loadData();
        msg("Expense added!", "success");
    } catch (err) {
        msg(err.message);
        showSpinner(false);
    }
}

function openEdit(id) {
    let item = dataList.find(x => x.id === id);
    if (!item) return;

    document.getElementById("editId").value = item.id;
    document.getElementById("editTitle").value = item.title;
    document.getElementById("editAmount").value = item.amount;
    document.getElementById("editCategory").value = item.category;

    editForm.classList.remove("was-validated");
    editModal.show();
}

async function onEdit(e) {
    e.preventDefault();

    editForm.classList.add("was-validated");
    if (!editForm.checkValidity()) return;

    let id = document.getElementById("editId").value;
    let title = document.getElementById("editTitle").value.trim();
    let amount = parseFloat(document.getElementById("editAmount").value);
    let category = document.getElementById("editCategory").value;

    editModal.hide();
    showSpinner(true);
    clearMsg();

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, amount, category })
        });

        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || "Failed to update");

        await loadData();
        msg("Updated successfully!", "success");
    } catch (err) {
        msg(err.message);
        showSpinner(false);
    }
}

async function onDelete(id) {
    if (!confirm("Are you sure?")) return;

    showSpinner(true);
    clearMsg();

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const resData = await res.json();

        if (!res.ok) throw new Error(resData.error || "Failed to delete");

        await loadData();
        msg("Deleted!", "warning");
    } catch (err) {
        msg(err.message);
        showSpinner(false);
    }
}
const themeToggleBtn = document.getElementById('themeToggleBtn');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️ Light Mode';
}

themeToggleBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '☀️ Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '🌙 Dark Mode';
    }
});
