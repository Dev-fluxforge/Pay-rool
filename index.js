document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitLoader = document.getElementById("submitLoader");
  
  // Common elements
  const textInputs = form.querySelectorAll(
    'input[type="text"], input[type="email"]'
  );
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const emailInput = document.getElementById("email");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  
  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

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
  
  // Show button loader
  const showButtonLoader = () => {
    submitBtn.disabled = true;
    submitLoader.style.display = "inline-block";
    submitBtn.querySelector("span:first-child").textContent = "Processing...";
  };
  
  // Hide button loader
  const hideButtonLoader = () => {
    submitBtn.disabled = false;
    submitLoader.style.display = "none";
    submitBtn.querySelector("span:first-child").textContent = "Submit";
  };
  
  // Create and show full page loader
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

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Show the button loader first
    showButtonLoader();
    
    // After a short delay, show the full page loader
    setTimeout(() => {
      showLoader();
    }, 500);

    // 1. Convert all text inputs to UPPERCASE
    textInputs.forEach((input) => {
      input.value = input.value.toUpperCase();
    });

    // 2. Check if user already exists
    const email = emailInput.value.toUpperCase();
    const storedEmail = localStorage.getItem("userEmail");
    
    if (storedEmail && email === storedEmail) {
      hideLoader();
      hideButtonLoader();
      showToast("User with this email already exists. Please login instead.");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);
      return;
    }

    // 3. Validate Password
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!passwordRegex.test(password)) {
      hideLoader();
      hideButtonLoader();
      showToast("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    if (password !== confirmPassword) {
      hideLoader();
      hideButtonLoader();
      showToast("Passwords do not match!");
      return;
    }

    // 4. Save data to Local Storage
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user data
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
      localStorage.setItem("userFirstName", firstNameInput.value.toUpperCase());
      localStorage.setItem("userLastName", lastNameInput.value.toUpperCase());

      hideLoader();
      // Keep button in loading state for better visual cue
      
      showToast("Sign-up Successful! Redirecting to login page...", true);
      
      // Reset form and redirect after delay
      setTimeout(() => {
        // Create a fade transition effect
        const fadeOut = document.createElement('div');
        fadeOut.style.position = 'fixed';
        fadeOut.style.top = '0';
        fadeOut.style.left = '0';
        fadeOut.style.width = '100%';
        fadeOut.style.height = '100%';
        fadeOut.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
        fadeOut.style.zIndex = '9999';
        fadeOut.style.opacity = '0';
        fadeOut.style.transition = 'opacity 0.5s';
        
        document.body.appendChild(fadeOut);
        
        setTimeout(() => {
          fadeOut.style.opacity = '1';
          setTimeout(() => {
            form.reset();
            window.location.href = "login.html";
          }, 500);
        }, 100);
      }, 2000);
      
    } catch (error) {
      hideLoader();
      hideButtonLoader();
      showToast("Error saving data: " + error.message);
    }
  });
  
  // Allow form submission with Enter key
  form.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });
});
