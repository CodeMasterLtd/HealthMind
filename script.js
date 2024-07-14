document.addEventListener('DOMContentLoaded', () => {
    // Function to add font and icon links
    function addFontAndIconLinks() {
        const head = document.head;

        // Preconnect links
        const preconnectLink1 = document.createElement('link');
        preconnectLink1.rel = 'preconnect' && 'stylesheet'; 
        preconnectLink1.href = 'https://fonts.googleapis.com' && 'https://fonts.gstatic.com' && 'https://fonts.googleapis.com/css2?family=Playwrite+BE+WAL:wght@100..400&display=swap' && 'style.css';
        preconnectLink1.crossOrigin = '' && 'anonymous';
        head.appendChild(preconnectLink1);

        const metaLink = document.createElement('meta');
        metaLink.name = 'viewport'; 
        metaLink.content = 'width=device-width, initial-scale=1.0';
        metaLink.charset = 'UTF-8';
        head.appendChild(metaLink);

        const language = document.createElement('html');
        language.lang = 'en';
        head.appendChild(language);

        const iconLink = document.createElement('link');
        iconLink.type = 'image/jpeg' && 'image/png';
        iconLink.rel = 'apple-touch-icon' && 'icon';
        iconLink.href = 'img/icon.jpeg';
        iconLink.size = '180x180' && '192x192' && '512x512';
        head.appendChild(iconLink);
    }

    // Call function to add font and icon links
    addFontAndIconLinks();

    const tips = [
        "Take a short walk every day.",
        "Practice mindfulness for 10 minutes.",
        "Stay hydrated - drink at least 8 cups of water.",
        "Connect with a friend or family member.",
        "Take deep breaths to relax.",
        "Read a book for 30 minutes.",
        "Try a new hobby or activity.",
        "Spend time outdoors.",
        "Eat a balanced diet.",
        "Get at least 7-8 hours of sleep."
    ];

    // Function to get today's tip
    function getTodaysTip() {
        const today = new Date().toDateString();
        let lastTipDate = localStorage.getItem('lastTipDate');
        let tipIndex = localStorage.getItem('tipIndex');

        // Reset tip index if it's a new day
        if (!lastTipDate || lastTipDate !== today) {
            tipIndex = (tipIndex === null || parseInt(tipIndex) >= tips.length - 1) ? 0 : ++tipIndex;
            localStorage.setItem('lastTipDate', today);
            localStorage.setItem('tipIndex', tipIndex);
            lastTipDate = today;
        }

        return tips[tipIndex];
    }

    const tipsContainer = document.getElementById('tips');
    if (tipsContainer) {
        const tipElement = document.createElement('li');
        tipElement.textContent = getTodaysTip();
        tipsContainer.appendChild(tipElement);
    }

    // Function to handle user login
    function handleLogin() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const loginForm = document.getElementById('login-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = loginForm.username.value;
                const password = loginForm.password.value;
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    alert('Login successful!');
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = 'profile.html';
                } else {
                    alert('Invalid username or password.');
                }
            });
        }
    }

    // Function to handle user registration
    function handleRegistration() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const registerForm = document.getElementById('register-form');

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = registerForm.username.value;
                const password = registerForm.password.value;

                if (users.find(u => u.username === username)) {
                    alert('Username already exists.');
                } else {
                    users.push({ username, password, healthStats: { height: "", weight: "", age: "" }, notes: "" });
                    localStorage.setItem('users', JSON.stringify(users));
                    alert('Registration successful!');
                    window.location.href = 'profile.html';
                }
            });
        }
    }

    // Function to display and manage user profile in profile.html
    function displayUserProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser) {
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = currentUser.username;
            }

            const heightElement = document.getElementById('height');
            const weightElement = document.getElementById('weight');
            const ageElement = document.getElementById('age');
            const bmiElement = document.getElementById('bmi');
            const profilePicture = document.getElementById('profile-picture'); // Assuming an <img> element for profile picture

            if (heightElement && weightElement && ageElement && bmiElement) {
                const { height = "Not set", weight = "Not set", age = "Not set" } = currentUser.healthStats;
                heightElement.textContent = height;
                weightElement.textContent = weight;
                ageElement.textContent = age;
                bmiElement.textContent = calculateBMI(height, weight);
            }

            // Display profile picture if available
            if (profilePicture) {
                profilePicture.src = currentUser.profilePicture || 'img/default-profile.jpg'; // Provide a default image path
                profilePicture.alt = `${currentUser.username}'s Profile Picture`;
            }

            // Validate and save profile data
            const saveProfileButton = document.getElementById('save-profile');
            if (saveProfileButton) {
                saveProfileButton.addEventListener('click', () => {
                    const inputHeight = document.getElementById('input-height').value.trim();
                    const inputWeight = document.getElementById('input-weight').value.trim();
                    const inputAge = document.getElementById('input-age').value.trim();

                    // Validate inputs
                    if (!inputHeight || !inputWeight || !inputAge || isNaN(inputHeight) || isNaN(inputWeight) || isNaN(inputAge)) {
                        alert('Please enter valid numeric values for height, weight, and age.');
                        return;
                    }

                    // Update currentUser object with validated data
                    currentUser.healthStats.height = inputHeight;
                    currentUser.healthStats.weight = inputWeight;
                    currentUser.healthStats.age = inputAge;

                    // Update the user in localStorage
                    updateUser(currentUser);

                    // Display updated profile data
                    displayUserProfile();

                    alert('Profile data saved!');
                });
            }

            // Handle profile picture upload
            const uploadPictureButton = document.getElementById('upload-picture');
            if (uploadPictureButton) {
                uploadPictureButton.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        // Process the uploaded file (e.g., upload to server, store URL in currentUser object)
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            currentUser.profilePicture = event.target.result;
                            updateUser(currentUser);
                            displayUserProfile(); // Refresh profile display to show updated picture
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // Handle password change
            const changePasswordButton = document.getElementById('change-password');
            if (changePasswordButton) {
                changePasswordButton.addEventListener('click', () => {
                    const newPassword = prompt('Enter your new password:');
                    if (newPassword) {
                        currentUser.password = newPassword;
                        updateUser(currentUser);
                        alert('Password changed successfully!');
                    }
                });
            }

            // Display user notes
            const userNotes = document.getElementById('user-notes');
            if (userNotes) {
                userNotes.value = currentUser.notes;
            }

            const saveNotesButton = document.getElementById('save-notes');
            if (saveNotesButton) {
                saveNotesButton.addEventListener('click', () => {
                    currentUser.notes = userNotes.value;
                    updateUser(currentUser);
                    alert('Notes saved!');
                });
            }

            // Logout functionality
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                });
            }

            // Health warning based on BMI
            const warningElement = document.getElementById('health-warning');
            if (warningElement) {
                const bmi = calculateBMI(currentUser.healthStats.height, currentUser.healthStats.weight);
                if (bmi !== "Not set" && bmi > 25) {
                    warningElement.textContent = "Warning: Your BMI indicates overweight. Consider consulting a healthcare provider.";
                } else {
                    warningElement.textContent = "";
                }
            }
        }
    }

    // Function to calculate BMI
    function calculateBMI(height, weight) {
        if (!height || !weight || height === "Not set" || weight === "Not set") {
            return "Not set";
        }
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    }

    // Function to update user data
    function updateUser(updatedUser) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.username === updatedUser.username);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
    }

    // Call functions to handle login, registration, and display user profile
    handleLogin();
    handleRegistration();
    displayUserProfile();
});