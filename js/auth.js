document.addEventListener('DOMContentLoaded', () => {
    // Password Visibility Toggle
    const passwordToggle = document.querySelectorAll('.show-password');
    
    passwordToggle.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordField = toggle.parentElement.previousElementSibling;
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggle.textContent = 'Hide';
            } else {
                passwordField.type = 'password';
                toggle.textContent = 'Show';
            }
        });
    });
    
    // Login Form Submission
    const loginForm = document.getElementById('login-form');
    
    loginForm?.addEventListener('submit', (e) => {
        // e.preventDefault();
        
        // Get form data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // In a real application, this would send the data to the server
        // For demo purposes, we'll simulate a successful login
        
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Logging in...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Store user info in localStorage for demo purposes
            localStorage.setItem('user', JSON.stringify({ email }));
            
            // Redirect to landing page
            window.location.href = 'landing.html';
        }, 1500);
    });
    
    // Signup Form Submission
    const signupForm = document.getElementById('signup-form');
    
    signupForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // In a real application, this would send the data to the server
        // For demo purposes, we'll simulate a successful signup
        
        // Show loading state
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Creating account...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Store user info in localStorage for demo purposes
            localStorage.setItem('user', JSON.stringify({ firstName, lastName, email }));
            
            // Redirect to landing page
            window.location.href = 'landing.html';
        }, 1500);
    });
    
    // Social Login Buttons
    const socialButtons = document.querySelectorAll('.social-button');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            // In a real application, this would open a popup for social login
            // For demo purposes, we'll just show an alert
            alert('Social login functionality would be implemented in a production environment.');
        });
    });
    
    // Animation for sidebar
    const authSidebar = document.querySelector('.auth-sidebar');
    
    if (authSidebar) {
        // Add a subtle parallax effect on mouse move
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const depthX = 20;
            const depthY = 20;
            
            const moveX = (mouseX - 0.5) * depthX;
            const moveY = (mouseY - 0.5) * depthY;
            
            authSidebar.style.backgroundPosition = `${moveX}px ${moveY}px`;
        });
    }
});