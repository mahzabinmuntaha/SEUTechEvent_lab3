/* =======================================================
   SEU Tech Event - script.js
   Lab 03: external JavaScript, DOM interaction
   ======================================================= */

/* ---- Required interaction 1: Check Registration Status ---- */
function checkRegistrationStatus() {
    var list = getRegistrations();
    var el = document.getElementById("registrationStatus");

    if (list.length > 0) {
        el.textContent = "Registration is OPEN. " + list.length + " student(s) have registered so far.";
    } else {
        el.textContent = "Registration is OPEN. No one has registered yet - be the first!";
    }
}

/* ---- Required interaction 2: Check Seat Availability (if...else) ---- */
var availableSeats = 12;

function checkSeatAvailability() {
    var el = document.getElementById("seatAvailability");

    if (availableSeats > 5) {
        el.textContent = "Plenty of seats left: " + availableSeats + " seats available.";
    } else if (availableSeats > 0) {
        el.textContent = "Hurry up! Only " + availableSeats + " seat(s) left.";
    } else {
        el.textContent = "Sorry, all seats are booked.";
    }
}

/* ---- Required interaction 3: Show Greeting ---- */
function showGreeting() {
    var nameField = document.getElementById("studentName");
    var el = document.getElementById("greetingMessage");
    var name = nameField.value.trim();

    if (name === "") {
        el.textContent = "Please type your full name above first.";
    } else {
        el.textContent = "Hello, " + name + "! Thanks for checking out the SEU Tech Event.";
    }
}

/* ---- Bonus independent interaction: Show Event Venue ---- */
function showVenue() {
    var el = document.getElementById("venueInfo");
    el.textContent = "Venue: SEU Auditorium & Lab Building, Southeast University, Dhaka. Main sessions run in the Auditorium; workshops run in Lab 304.";
}

/* =======================================================
   Registration form: save entries to localStorage
   ======================================================= */
var STORAGE_KEY = "seu_tech_event_registrations";

function getRegistrations() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveRegistrations(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function updateStatCount() {
    var count = getRegistrations().length;
    var statEl = document.getElementById("statRegistered");
    if (statEl) {
        statEl.textContent = count;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateStatCount();

    var regForm = document.getElementById("regForm");
    var regMsg = document.getElementById("regMsg");

    regForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var addons = Array.prototype.slice
            .call(regForm.querySelectorAll('input[name="addon"]:checked'))
            .map(function (el) { return el.value; });

        var entry = {
            fullName: document.getElementById("studentName").value.trim(),
            studentId: document.getElementById("studentId").value.trim(),
            email: document.getElementById("email").value.trim(),
            prefDate: document.getElementById("prefDate").value,
            slot: regForm.querySelector('input[name="slot"]:checked').value,
            addons: addons,
            submittedAt: new Date().toLocaleString()
        };

        var list = getRegistrations();
        list.push(entry);
        saveRegistrations(list);

        regMsg.textContent = "Registration saved. See you at the event, " + entry.fullName + "!";
        regMsg.className = "form-msg success";
        regForm.reset();
        updateStatCount();
        renderAdminTable();
    });

    /* ---- Admin login handling ---- */
    var ADMIN_EMAIL = "admin@seu.edu.bd";
    var ADMIN_PASSWORD = "admin443";

    var adminLoginForm = document.getElementById("adminLoginForm");
    var adminMsg = document.getElementById("adminMsg");
    var adminDashboard = document.getElementById("adminDashboard");
    var adminEmailLabel = document.getElementById("adminEmailLabel");

    adminLoginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = document.getElementById("adminEmail").value.trim();
        var pass = document.getElementById("adminPassword").value;

        if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
            adminMsg.textContent = "";
            adminLoginForm.classList.add("hidden");
            adminDashboard.classList.remove("hidden");
            adminEmailLabel.textContent = email;
            renderAdminTable();
        } else {
            adminMsg.textContent = "Incorrect email or password.";
            adminMsg.className = "form-msg error";
        }
    });

    document.getElementById("logoutBtn").addEventListener("click", function () {
        adminDashboard.classList.add("hidden");
        adminLoginForm.classList.remove("hidden");
        adminLoginForm.reset();
        adminMsg.textContent = "";
    });

    document.getElementById("clearBtn").addEventListener("click", function () {
        if (confirm("Clear all stored registrations? This cannot be undone.")) {
            saveRegistrations([]);
            renderAdminTable();
            updateStatCount();
        }
    });
});

function renderAdminTable() {
    var list = getRegistrations();
    var tbody = document.getElementById("adminTableBody");
    var emptyState = document.getElementById("adminEmptyState");
    var table = document.getElementById("adminTable");
    var countLabel = document.getElementById("dashboardCount");

    if (!tbody) { return; }

    countLabel.textContent = list.length;
    tbody.innerHTML = "";

    if (list.length === 0) {
        table.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }

    table.classList.remove("hidden");
    emptyState.classList.add("hidden");

    list.forEach(function (entry, index) {
        var tr = document.createElement("tr");
        tr.innerHTML =
            "<td>" + (index + 1) + "</td>" +
            "<td>" + entry.fullName + "</td>" +
            "<td>" + entry.studentId + "</td>" +
            "<td>" + entry.email + "</td>" +
            "<td>" + entry.prefDate + "</td>" +
            "<td>" + entry.slot + "</td>" +
            "<td>" + (entry.addons.length ? entry.addons.join(", ") : "None") + "</td>" +
            "<td>" + entry.submittedAt + "</td>";
        tbody.appendChild(tr);
    });
}
