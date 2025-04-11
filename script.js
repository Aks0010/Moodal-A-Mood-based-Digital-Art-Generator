// script.js

// Camera functionality
const cameraButton = document.getElementById("cameraButton");
const cameraStream = document.getElementById("cameraStream");
const captureButton = document.getElementById("captureButton");

cameraButton.addEventListener("click", () => {
    alert("This application requires access to your camera for full functionality.");
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            cameraStream.srcObject = stream;
            cameraStream.style.display = "block";
            captureButton.style.display = "inline-block";
        })
        .catch((err) => {
            console.error("Error accessing camera:", err);
            alert("Unable to access the camera. Please check your permissions.");
        });
});

captureButton.addEventListener("click", () => {
    alert("Capture functionality coming soon!");
});

// Voice recording functionality
const startRecording = document.getElementById("startRecording");
const stopRecording = document.getElementById("stopRecording");
const recordingStatus = document.getElementById("recordingStatus");

let mediaRecorder;
let audioChunks = [];

startRecording.addEventListener("click", () => {
    alert("This application requires access to your microphone for full functionality.");
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            recordingStatus.textContent = "Recording...";
            startRecording.disabled = true;
            stopRecording.disabled = false;

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                const audioUrl = URL.createObjectURL(audioBlob);
                console.log("Audio URL:", audioUrl);
                recordingStatus.textContent = "Recording stopped";
            };
        })
        .catch((err) => {
            console.error("Error accessing microphone:", err);
            alert("Unable to access the microphone. Please check your permissions.");
        });
});

stopRecording.addEventListener("click", () => {
    mediaRecorder.stop();
    startRecording.disabled = false;
    stopRecording.disabled = true;
});

// Mood buttons functionality
document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = document.querySelectorAll('.mood-button');

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.getAttribute('data-mood');
            console.log(`Mood selected: ${mood}`);
            // Add additional functionality here, e.g., updating UI or triggering events
        });
    });
});

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Authentication popup functionality
const authLink = document.getElementById("authLink");
const authPopup = document.getElementById("authPopup");
const closePopup = document.getElementById("closePopup");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

function showSuccessMessage(message) {
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

authLink.addEventListener("click", (e) => {
    e.preventDefault();
    authPopup.style.display = "block";
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    document.querySelector(".container").classList.add("overlay");
});

closePopup.addEventListener("click", () => {
    authPopup.style.display = "none";
    document.querySelector(".container").classList.remove("overlay");
});

showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

window.addEventListener("click", (e) => {
    if (e.target === authPopup) {
        authPopup.style.display = "none";
        document.querySelector(".container").classList.remove("overlay");
    }
});

// Handle login form submission
loginForm.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    if (username && password) {
        auth.signInWithEmailAndPassword(username, password)
            .then((userCredential) => {
                showSuccessMessage(`Welcome back, ${username}!`);
                authPopup.style.display = "none";
                document.querySelector(".container").classList.remove("overlay");
                loginForm.querySelector("form").reset(); // Clear inputs
            })
            .catch((error) => {
                alert(`Login failed: ${error.message}`);
            });
    } else {
        alert("Please fill in all fields.");
    }
});

// Handle register form submission
registerForm.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const emailOrMobile = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (emailOrMobile && password) {
        auth.createUserWithEmailAndPassword(emailOrMobile, password)
            .then((userCredential) => {
                showSuccessMessage(`Registration successful! Welcome to Moodal!`);
                authPopup.style.display = "none";
                document.querySelector(".container").classList.remove("overlay");
                registerForm.querySelector("form").reset(); // Clear inputs
            })
            .catch((error) => {
                alert(`Registration failed: ${error.message}`);
            });
    } else {
        alert("Please fill in all fields.");
    }
});
