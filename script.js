// ========================================
// JOB APPLICATION TRACKER
// ========================================


// Get applications from localStorage
let applications =
    JSON.parse(localStorage.getItem("applications")) || [];


// DOM Elements
const dashboardSection =
    document.getElementById("dashboardSection");

const applicationsSection =
    document.getElementById("applicationsSection");

const addSection =
    document.getElementById("addSection");

const pageTitle =
    document.getElementById("pageTitle");

const navItems =
    document.querySelectorAll(".nav-item");

const applicationForm =
    document.getElementById("applicationForm");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");


// ========================================
// NAVIGATION
// ========================================

navItems.forEach(button => {

    button.addEventListener("click", () => {

        const section = button.dataset.section;

        showSection(section);

    });

});


function showSection(section) {

    // Hide everything
    dashboardSection.classList.add("hidden");
    applicationsSection.classList.add("hidden");
    addSection.classList.add("hidden");

    // Remove active state
    navItems.forEach(item => {
        item.classList.remove("active");
    });


    if (section === "dashboard") {

        dashboardSection.classList.remove("hidden");

        pageTitle.textContent = "Dashboard";

        document
            .querySelector('[data-section="dashboard"]')
            .classList.add("active");

        renderDashboard();

    }


    else if (section === "applications") {

        applicationsSection.classList.remove("hidden");

        pageTitle.textContent = "Applications";

        document
            .querySelector('[data-section="applications"]')
            .classList.add("active");

        renderApplications();

    }


    else if (section === "add") {

        addSection.classList.remove("hidden");

        pageTitle.textContent = "Add Application";

        document
            .querySelector('[data-section="add"]')
            .classList.add("active");

    }

}


// ========================================
// ADD APPLICATION BUTTONS
// ========================================

document
    .getElementById("headerAddBtn")
    .addEventListener("click", () => {

        resetForm();

        showSection("add");

    });


document
    .getElementById("cancelBtn")
    .addEventListener("click", () => {

        resetForm();

        showSection("dashboard");

    });


document
    .getElementById("viewAllBtn")
    .addEventListener("click", () => {

        showSection("applications");

    });


// ========================================
// FORM SUBMISSION
// ========================================

applicationForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const editId =
        document.getElementById("editId").value;


    const application = {

        id: editId
            ? Number(editId)
            : Date.now(),

        company:
            document.getElementById("company").value.trim(),

        position:
            document.getElementById("position").value.trim(),

        dateApplied:
            document.getElementById("dateApplied").value,

        status:
            document.getElementById("status").value,

        interviewDate:
            document.getElementById("interviewDate").value,

        jobType:
            document.getElementById("jobType").value,

        jobUrl:
            document.getElementById("jobUrl").value.trim(),

        notes:
            document.getElementById("notes").value.trim()

    };


    // EDIT
    if (editId) {

        applications =
            applications.map(app => {

                if (app.id === Number(editId)) {

                    return application;

                }

                return app;

            });

    }


    // ADD
    else {

        applications.unshift(application);

    }


    saveApplications();

    resetForm();

    showSection("dashboard");

});


// ========================================
// SAVE TO LOCAL STORAGE
// ========================================

function saveApplications() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

}


// ========================================
// DASHBOARD
// ========================================

function renderDashboard() {

    const total =
        applications.length;


    const applied =
        applications.filter(
            app => app.status === "Applied"
        ).length;


    const interviews =
        applications.filter(
            app => app.status === "Interview"
        ).length;


    const offers =
        applications.filter(
            app => app.status === "Offer"
        ).length;


    const rejected =
        applications.filter(
            app => app.status === "Rejected"
        ).length;


    document.getElementById("totalCount")
        .textContent = total;


    document.getElementById("appliedCount")
        .textContent = applied;


    document.getElementById("interviewCount")
        .textContent = interviews;


    document.getElementById("offerCount")
        .textContent = offers;


    document.getElementById("rejectedCount")
        .textContent = rejected;


    renderRecentApplications();

}


// ========================================
// RECENT APPLICATIONS
// ========================================

function renderRecentApplications() {

    const container =
        document.getElementById("recentApplications");


    container.innerHTML = "";


    if (applications.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <div class="empty-icon">📭</div>
                <h3>No applications yet</h3>
                <p>Start tracking your job applications.</p>
            </div>
        `;

        return;

    }


    const recent =
        applications.slice(0, 5);


    recent.forEach(app => {

        const item =
            document.createElement("div");


        item.className =
            "application-item";


        item.innerHTML = `

            <div class="company-info">

                <div class="company-logo">
                    ${getInitials(app.company)}
                </div>

                <div>

                    <div class="company-name">
                        ${escapeHTML(app.company)}
                    </div>

                    <div class="position">
                        ${escapeHTML(app.position)}
                    </div>

                </div>

            </div>


            <span class="status status-${app.status}">
                ${app.status}
            </span>

        `;


        container.appendChild(item);

    });

}


// ========================================
// APPLICATIONS PAGE
// ========================================

function renderApplications() {

    const container =
        document.getElementById("allApplications");


    container.innerHTML = "";


    const search =
        searchInput.value.toLowerCase();


    const filter =
        statusFilter.value;


    const filtered =
        applications.filter(app => {

            const matchesSearch =

                app.company
                    .toLowerCase()
                    .includes(search)

                ||

                app.position
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                filter === "All"
                ||
                app.status === filter;


            return matchesSearch && matchesStatus;

        });


    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <div class="empty-icon">🔍</div>
                <h3>No applications found</h3>
                <p>Try changing your search or filter.</p>
            </div>
        `;

        return;

    }


    filtered.forEach(app => {

        const card =
            document.createElement("div");


        card.className =
            "app-card";


        card.innerHTML = `

            <div class="app-card-top">

                <div>

                    <h3>
                        ${escapeHTML(app.company)}
                    </h3>

                    <div class="role">
                        ${escapeHTML(app.position)}
                    </div>

                </div>

                <span class="status status-${app.status}">
                    ${app.status}
                </span>

            </div>


            <div class="app-info">

                📅 Applied:
                ${formatDate(app.dateApplied)}

                <br>

                💼 Type:
                ${escapeHTML(app.jobType)}

                ${
                    app.interviewDate
                    ?
                    `<br>🎤 Interview:
                    ${formatDate(app.interviewDate)}`
                    :
                    ""
                }

            </div>


            ${
                app.notes
                ?
                `
                <div class="app-notes">

                    📝
                    ${escapeHTML(app.notes)}

                </div>
                `
                :
                ""
            }


            <div class="card-actions">

                ${
                    app.jobUrl
                    ?
                    `
                    <button
                        class="edit-btn"
                        onclick="openJob('${escapeAttribute(app.jobUrl)}')"
                    >
                        🔗 Job
                    </button>
                    `
                    :
                    ""
                }

                <button
                    class="edit-btn"
                    onclick="editApplication(${app.id})"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteApplication(${app.id})"
                >
                    🗑 Delete
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    renderApplications
);


statusFilter.addEventListener(
    "change",
    renderApplications
);


// ========================================
// EDIT APPLICATION
// ========================================

function editApplication(id) {

    const app =
        applications.find(
            item => item.id === id
        );


    if (!app) return;


    document.getElementById("editId")
        .value = app.id;


    document.getElementById("company")
        .value = app.company;


    document.getElementById("position")
        .value = app.position;


    document.getElementById("dateApplied")
        .value = app.dateApplied;


    document.getElementById("status")
        .value = app.status;


    document.getElementById("interviewDate")
        .value = app.interviewDate;


    document.getElementById("jobType")
        .value = app.jobType;


    document.getElementById("jobUrl")
        .value = app.jobUrl;


    document.getElementById("notes")
        .value = app.notes;


    document.getElementById("formTitle")
        .textContent = "Edit Application";


    document.getElementById("submitText")
        .textContent = "Update Application";


    showSection("add");

}


// ========================================
// DELETE
// ========================================

function deleteApplication(id) {

    const app =
        applications.find(
            item => item.id === id
        );


    if (!app) return;


    const confirmDelete =
        confirm(
            `Delete application for ${app.company}?`
        );


    if (!confirmDelete) return;


    applications =
        applications.filter(
            item => item.id !== id
        );


    saveApplications();

    renderDashboard();

    renderApplications();

}


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    applicationForm.reset();


    document.getElementById("editId")
        .value = "";


    document.getElementById("formTitle")
        .textContent = "Add New Application";


    document.getElementById("submitText")
        .textContent = "Add Application";

}


// ========================================
// DARK MODE
// ========================================

const themeBtn =
    document.getElementById("themeBtn");


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        const dark =
            document.body.classList.contains("dark");


        themeBtn.textContent =
            dark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";


        localStorage.setItem(
            "darkMode",
            dark
        );

    }
);


// Load saved theme
if (
    localStorage.getItem("darkMode")
    === "true"
) {

    document.body.classList.add("dark");

    themeBtn.textContent =
        "☀️ Light Mode";

}


// ========================================
// UTILITY FUNCTIONS
// ========================================

function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


function formatDate(date) {

    if (!date) return "N/A";


    const d =
        new Date(date + "T00:00:00");


    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// Prevent HTML injection
function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


function escapeAttribute(text) {

    return text.replace(
        /'/g,
        "\\'"
    );

}


function openJob(url) {

    window.open(
        url,
        "_blank"
    );

}


// ========================================
// INITIAL LOAD
// ========================================

renderDashboard();