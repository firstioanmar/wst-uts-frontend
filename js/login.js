document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("authenticated", "true");
      window.location.href = "index.html";
    } else {
      document.getElementById("errorMessage").textContent = "Username atau password salah!";
    }
  });
  