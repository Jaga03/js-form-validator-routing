const app = document.getElementById("app");
const routes = {
  "#home": renderHome,
  "#register": renderRegister,
  "#login": renderLogin,
  "#profile": renderProfile,
};


function updateNav() {
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  document.getElementById("navRegister").style.display = loggedIn ? "none" : "inline";
  document.getElementById("navLogin").style.display = loggedIn ? "none" : "inline";
  document.getElementById("navProfile").style.display = loggedIn ? "inline" : "none";
}


function router() {
  const hash = window.location.hash || "#home";
  const render = routes[hash] || renderNotFound;
  render();
}


function renderHome() {
  app.innerHTML = `<h2>Welcome!</h2><p>This is a user registration Single Page Application.</p>`;
}


function renderRegister() {
  app.innerHTML = `
    <h2>Register</h2>
    <form id="registerForm">
      <input type="email" id="regEmail" placeholder="Email" required />

      <div class="password-wrapper">
        <input type="password" id="regPassword" placeholder="Password" required />
        <i class="fas fa-eye toggle-password" data-target="regPassword"></i>
      </div>
      <div id="strength"></div>

      <div class="password-wrapper">
        <input type="password" id="confirmPassword" placeholder="Confirm Password" required />
        <i class="fas fa-eye toggle-password" data-target="confirmPassword"></i>
      </div>

      <button type="submit">Register</button>
      <p id="registerMessage"></p>
    </form>
  `;

  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetInput = document.getElementById(icon.dataset.target);
      const isVisible = targetInput.type === "text";
      targetInput.type = isVisible ? "password" : "text";
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  });

  const passwordInput = document.getElementById("regPassword");
  const strengthDiv = document.getElementById("strength");

  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;
    if (val.length < 8) {
      strengthDiv.textContent = "Weak";
      strengthDiv.style.color = "red";
    } else if (/[A-Z]/.test(val) && /[a-z]/.test(val) && /\d/.test(val)) {
      strengthDiv.textContent = "Moderate";
      strengthDiv.style.color = "orange";
    }
    if (/[\W_]/.test(val) && val.length >= 8) {
      strengthDiv.textContent = "Strong";
      strengthDiv.style.color = "green";
    }
  });

  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("registerMessage");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!emailRegex.test(email)) {
      message.textContent = "Invalid email format.";
      message.style.color = "red";
      return;
    }

    if (!passwordRegex.test(password)) {
      message.textContent = "Password must be at least 8 characters with uppercase, lowercase, number, and symbol.";
      message.style.color = "red";
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match!";
      message.style.color = "red";
      return;
    }

    localStorage.setItem("user", JSON.stringify({ email, password }));
    message.style.color = "green";
    message.textContent = "Registered successfully! Please log in.";
    document.getElementById('registerForm').reset();
    document.getElementById('strength').textContent = '';
  });
}


function renderLogin() {
  app.innerHTML = `
    <h2>Login</h2>
   <form id="loginForm">
      <input type="email" id="loginEmail" placeholder="Email" required />
      
      <div class="password-wrapper">
        <input type="password" id="loginPassword" placeholder="Password" required />
        <i class="fas fa-eye toggle-password" data-target="loginPassword"></i>
      </div>

      <button type="submit">Login</button>
      <p id="loginMessage"></p>
    </form>
  `;

   document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetInput = document.getElementById(icon.dataset.target);
      const isVisible = targetInput.type === "text";
      targetInput.type = isVisible ? "password" : "text";
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  });

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.password === password) {
      localStorage.setItem("loggedIn", "true");
      updateNav();
      location.hash = "#profile";
    } else {
      message.textContent = "Invalid credentials.";
      message.style.color = "red";
    }
  });
}


function renderProfile() {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user"));

  if (!isLoggedIn || !user) {
    location.hash = "#login";
    return;
  }

  app.innerHTML = `
    <h2>Welcome, ${user.email}</h2>
    <p>Your account is active.</p>
    <button id="logoutBtn">Logout</button>
  `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    updateNav();
    location.hash = "#login";
  });
}


function renderNotFound() {
  app.innerHTML = `<h2>404 - Page not found</h2>`;
}

window.addEventListener("hashchange", router);
window.addEventListener("load", () => {
  updateNav();
  router();
});

