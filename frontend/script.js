const BASE_URL = "https://old-age-home-4avd.onrender.com/auth";

// Show/Hide Password
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

// REGISTER
function register() {
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const error = document.getElementById("regError");

    if (!email || !password) {
        error.innerText = "All fields are required";
        return;
    }

    fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            window.location.href = "home.html";
        })
        .catch(() => error.innerText = "Something went wrong");
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.role === "admin") {
                saveUser("admin");
                window.location.href = "admin.html";
            } else if (data.role === "user") {
                saveUser("user");
                window.location.href = "home.html";
            } else {
                alert("Login failed");
            }
        });
}

// SAVE USER ROLE AFTER LOGIN
function saveUser(role) {
    localStorage.setItem("role", role);
}

// CHECK LOGIN
function checkAuth() {
    const role = localStorage.getItem("role");
    if (!role) {
        window.location.href = "index.html";
    }
}

function checkAdmin() {
    let role = localStorage.getItem("role");

    if (role !== "admin") {
        alert("Access Denied!");
        window.location.href = "admin.html";
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("role");
    window.location.href = "index.html";
}


let selectedNeed = null;

// Load Needs
fetch(`${BASE_URL}/get-needs`)
    .then(res => res.json())
    .then(data => {
        let html = "";

        data.forEach(n => {
            html += `
             <div class="need-card">
                <h3>${n.item}</h3>
                <div class="need-qty">Required: ${n.quantity}</div>
                <p>${n.description}</p>
                <button onclick="openForm(${n.id})">💝 Donate Now</button>
            </div>
            `;
        });

        document.getElementById("needsList").innerHTML = html;
    });

// Open Form
function openForm(id) {
    selectedNeed = id;
    document.getElementById("donationModal").style.display = "block";
}

// Close Form
function closeForm() {
    document.getElementById("donationModal").style.display = "none";
}

// Submit
function submitDonation() {
    fetch(`${BASE_URL}/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            item: document.getElementById("item").value,
            message: document.getElementById("message").value,
            need_id: selectedNeed
        })
    })
        .then(res => res.json())
        .then(() => {
            alert("✅ Donation Submitted!");
            closeForm();
        });
}

function submitVolunteer() {

    fetch(`${BASE_URL}/volunteer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("vname").value,
            email: document.getElementById("vemail").value,
            phone: document.getElementById("vphone").value,
            area: document.getElementById("varea").value
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("✅ Volunteer request submitted!");
        alert("✅ visit us");
        document.getElementById("vname").value = "";
        document.getElementById("vemail").value = "";
        document.getElementById("vphone").value = "";
        document.getElementById("varea").selectedIndex = 0;
    })
    .catch(err => console.error(err));
}

function loadAdminData() {

    // LOAD NEEDS
    fetch(`${BASE_URL}/get-needs`)
    .then(res => res.json())
    .then(data => {

        document.getElementById("totalNeeds").innerText = data.length;

        let html = "";
        data.forEach(n => {
            html += `
                <div class="admin-card">
                    <b>${n.item}</b> - ${n.quantity}
                    <p>${n.description}</p>
                    <button onclick="deleteNeed(${n.id})">Delete</button>
                </div>
            `;
        });

        document.getElementById("needsList").innerHTML = html;
    });


    // LOAD DONATIONS
    fetch(`${BASE_URL}/get-donations`)
    .then(res => res.json())
    .then(data => {

        document.getElementById("totalDonations").innerText = data.length;

        let html = "";
        data.forEach(d => {
            html += `
                <div class="admin-card">
                    <b>${d.name}</b> (${d.email})
                    <p>${d.item} | ${d.phone}</p>
                    <p>${d.message}</p>
                </div>
            `;
        });

        document.getElementById("donationsList").innerHTML = html;
    });


    // LOAD VOLUNTEERS
    fetch(`${BASE_URL}/get-volunteers`)
    .then(res => res.json())
    .then(data => {

        document.getElementById("totalVolunteers").innerText = data.length;

        let html = "";
        data.forEach(v => {
            html += `
                <div class="admin-card">
                    <b>${v.name}</b>
                    <p>${v.email} | ${v.phone}</p>
                    <p>${v.area}</p>
                </div>
            `;
        });

        document.getElementById("volunteersList").innerHTML = html;
    });
}


/* ADD NEED */
function addNeed() {
    fetch(`${BASE_URL}/add-need`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            item: document.getElementById("item").value,
            quantity: document.getElementById("quantity").value,
            description: document.getElementById("desc").value
        })
    })
    .then(() => {
        alert("Added!");
        loadAdminData();
        document.getElementById("item").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("desc").value = "";
    });
}

/* DELETE */
function deleteNeed(id) {
    fetch(`http://127.0.0.1:5000/auth/delete-need/${id}`, {
        method: "DELETE"
    })
    .then(() => loadAdminData());
}

