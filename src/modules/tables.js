// =================
// Constants
// =================
const DEFAULT_TABLE_CLASS = "library-table";
const ROWS_PER_PAGE = 5;

// =================
// Utility Functions
// =================

// -----------
// DOM Helpers
// -----------
function createElement(tag, classNames = []) {
    const el = document.createElement(tag);
    classNames.forEach(cls => el.classList.add(cls));
    return el;
}

function clearChildren(parent) {
    while (parent.firstChild) parent.removeChild(parent.firstChild);
}

// =================
// Table Rendering Functions
// =================

// -----------
// Ensure Table Structure
// -----------
function ensureTableStructure(table) {
    if (!table.querySelector("colgroup")) table.insertBefore(createElement("colgroup"), table.firstChild);
    if (!table.querySelector("thead")) table.appendChild(createElement("thead"));
    if (!table.querySelector("tbody")) table.appendChild(createElement("tbody"));
}

// -----------
// Column Group
// -----------
function insertColgroup(table, obj) {
    const colgroup = table.querySelector("colgroup");
    clearChildren(colgroup);
    Object.keys(obj).forEach(() => colgroup.appendChild(document.createElement("col")));
}

// -----------
// Table Header
// -----------
function addTableHeader(obj, thead, onSort) {
    clearChildren(thead);
    const row = createElement("tr", ["library-head-row"]);

    Object.keys(obj).forEach(key => {
        const th = createElement("th", ["library-head-cell"]);
        th.setAttribute("scope", "col");
        th.textContent = key;
        th.style.cursor = "pointer";

        if (onSort) {
            th.addEventListener("click", () => onSort(key));
        }

        row.appendChild(th);
    });

    thead.appendChild(row);
}

// -----------
// Table Rows
// -----------
function addTableRow(obj, tbody) {
    const row = createElement("tr", ["library-record"]);
    Object.values(obj).forEach(value => {
        const td = createElement("td", ["library-cell"]);
        td.textContent = value;
        row.appendChild(td);
    });
    tbody.appendChild(row);
}

function removeTableRow(id) {
    const recordToRemove = document.querySelector(`[data-id="${id}"]`);
    recordToRemove.remove();
}

// -----------
// Table Cells
// -----------

function updateTableCell(obj, colName) {
    const rowToUpdate = document.querySelector(`[data-id="${obj.id}"]`);
    rowToUpdate.querySelector(`.${colName}-cell`).textContent = obj[`${colName}`];
}

// -----------
// Multiple Rows
// -----------
function addRowsFromArray(arr, tbody) {
    arr.forEach(obj => addTableRow(obj, tbody));
}

// -----------
// Clear Table Body
// -----------
function clearTableBody(table) {
    const tbody = table.querySelector("tbody");
    clearChildren(tbody);
}

// =================
// Table Features
// =================

// -----------
// Sorting
// -----------
function sortArrayByKey(arr, key, ascending = true) {
    return arr.slice().sort((a, b) => {
        if (a[key] < b[key]) return ascending ? -1 : 1;
        if (a[key] > b[key]) return ascending ? 1 : -1;
        return 0;
    });
}

// -----------
// Filtering
// -----------
function filterArray(arr, predicate) {
    return arr.filter(predicate);
}

// -----------
// Pagination
// -----------
function paginateArray(arr, page = 1, perPage = ROWS_PER_PAGE) {
    const start = (page - 1) * perPage;
    return arr.slice(start, start + perPage);
}

// -----------
// Toggle Column Visibility
// -----------
function toggleColumn(table, colIndex, visible) {
    Array.from(table.rows).forEach(row => {
        const cell = row.cells[colIndex];
        if (cell) cell.style.display = visible ? "" : "none";
    });
}

// -----------
// Row Striping
// -----------
function stripeRows(tbody) {
    Array.from(tbody.rows).forEach((row, idx) => {
        row.classList.toggle("odd-row", idx % 2 === 0);
        row.classList.toggle("even-row", idx % 2 !== 0);
    });
}

// =================
// Main Execution / Initialization
// =================
function initTable(tableId, dataArray) {
    const table = document.getElementById(tableId);
    if (!table || !dataArray || !dataArray.length) return;

    table.classList.add(DEFAULT_TABLE_CLASS);
    ensureTableStructure(table);

    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    insertColgroup(table, dataArray[0]);

    let currentData = dataArray.slice();
    let ascending = true;

    const render = (data) => {
        clearTableBody(table);
        addRowsFromArray(data, tbody);
        stripeRows(tbody);
    };

    const handleSort = (key) => {
        currentData = sortArrayByKey(currentData, key, ascending);
        ascending = !ascending;
        render(currentData);
    };

    addTableHeader(dataArray[0], thead, handleSort);
    render(currentData);

    return {
        sort: handleSort,
        filter: (predicate) => { currentData = filterArray(dataArray, predicate); render(currentData); },
        paginate: (page, perPage = ROWS_PER_PAGE) => render(paginateArray(currentData, page, perPage)),
        toggleColumn: (index, visible) => toggleColumn(table, index, visible),
    };
}

// =================
// Example Usage
// =================
/*
const myBooks = [
    { title: "The Hobbit", author: "J.R.R. Tolkien", pages: 295, read: false },
    { title: "To Kill a Mockingbird", author: "Harper Lee", pages: 320, read: true },
    { title: "1984", author: "George Orwell", pages: 328, read: false },
    { title: "Dune", author: "Frank Herbert", pages: 412, read: true },
    { title: "Fahrenheit 451", author: "Ray Bradbury", pages: 158, read: false },
];

const tableAPI = initTable("libraryTable", myBooks);

// Example interactions:
// tableAPI.sort("pages");
// tableAPI.filter(book => book.read === true);
// tableAPI.paginate(2, 2);
// tableAPI.toggleColumn(3, false);
*/