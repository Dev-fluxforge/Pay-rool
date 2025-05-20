document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  // Reusable toast function
  const showToast = (message, isSuccess = false) => {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      style: {
        background: isSuccess 
          ? "linear-gradient(to right, #00b09b, #96c93d)" 
          : "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
  };
  
  // Create and show loader
  const showLoader = () => {
    const loader = document.createElement("div");
    loader.id = "formLoader";
    loader.style.position = "fixed";
    loader.style.top = "0";
    loader.style.left = "0";
    loader.style.width = "100%";
    loader.style.height = "100%";
    loader.style.backgroundColor = "rgba(0,0,0,0.5)";
    loader.style.display = "flex";
    loader.style.justifyContent = "center";
    loader.style.alignItems = "center";
    loader.style.zIndex = "9999";
    
    const spinner = document.createElement("div");
    spinner.style.border = "5px solid #f3f3f3";
    spinner.style.borderTop = "5px solid #4CAF50";
    spinner.style.borderRadius = "50%";
    spinner.style.width = "50px";
    spinner.style.height = "50px";
    spinner.style.animation = "spin 1s linear infinite";
    
    const style = document.createElement("style");
    style.textContent = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
    document.head.appendChild(style);
    
    loader.appendChild(spinner);
    document.body.appendChild(loader);
  };
  
  // Remove loader
  const hideLoader = () => {
    const loader = document.getElementById("formLoader");
    if (loader) {
      document.body.removeChild(loader);
    }
  };

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loader
    showLoader();

    const inputEmail = document.getElementById('email').value.trim().toUpperCase();
    const inputPassword = document.getElementById('password').value;

    // Fetch stored credentials from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');

    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate
    if (!storedEmail || !storedPassword) {
      hideLoader();
      showToast("No account found. Please sign up first.");
      return;
    }

    if (inputEmail === storedEmail && inputPassword === storedPassword) {
      hideLoader();
      showToast("Login successful! Redirecting to Dashboard...", true);
      
      // Set login status flag
      localStorage.setItem("isLoggedIn", "true");
      
      // Redirect after successful login with a nice transition
      setTimeout(() => {
        const fadeOut = document.createElement('div');
        fadeOut.style.position = 'fixed';
        fadeOut.style.top = '0';
        fadeOut.style.left = '0';
        fadeOut.style.width = '100%';
        fadeOut.style.height = '100%';
        fadeOut.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
        fadeOut.style.zIndex = '9999';
        fadeOut.style.opacity = '0';
        fadeOut.style.transition = 'opacity 0.5s';
        
        document.body.appendChild(fadeOut);
        
        setTimeout(() => {
          fadeOut.style.opacity = '1';
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 500);
        }, 100);
      }, 1000);
    } else {
      hideLoader();
      showToast("Invalid email or password. Please try again!");
    }
  });
  
  // Allow form submission with Enter key
  loginForm.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loginForm.dispatchEvent(new Event("submit"));
    }
  });
});