// Moodal - Digital Art Generation Application

// Camera functionality
const captureButton = document.getElementById("captureButton");
const cameraStream = document.getElementById("cameraStream");

let cameraStreamActive = false; // Track if the camera stream is already active
let cameraStreamInitialized = false; // Track if the camera has been initialized

captureButton.addEventListener("click", () => {
  if (!cameraStreamInitialized) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        cameraStream.srcObject = stream;
        cameraStream.style.display = "block";
        cameraStreamActive = true; // Set camera stream as active
        cameraStreamInitialized = true; // Mark camera as initialized
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        alert("Unable to access the camera. Please check your permissions.");
      });
  } else {
    // Remove the previously captured image if it exists
    const existingImage =
      cameraStream.parentElement.querySelector(".captured-image");
    if (existingImage) {
      existingImage.remove();
    }

    if (cameraStream.srcObject) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = cameraStream.videoWidth || cameraStream.offsetWidth;
      canvas.height = cameraStream.videoHeight || cameraStream.offsetHeight;
      context.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);

      // Save the captured image as a Base64 string
      capturedImage = canvas.toDataURL("image/png");
      console.log("Image captured from camera.");

      // Stop the camera stream
      const tracks = cameraStream.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      cameraStream.srcObject = null;
      cameraStreamActive = false; // Reset camera stream status

      // Replace the camera stream with the captured image
      cameraStream.style.display = "none";
      const imgElement = document.createElement("img");
      imgElement.src = capturedImage;
      imgElement.alt = "Captured Image";
      imgElement.className = "captured-image";

      // Fit the image within the camera section
      imgElement.style.maxWidth = "100%";
      imgElement.style.maxHeight = "100%";
      imgElement.style.objectFit = "contain";
      imgElement.style.borderRadius = "15px";
      imgElement.style.marginTop = "15px";

      cameraStream.parentElement.appendChild(imgElement);
    } else {
      // Restart the camera stream if it was stopped
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          cameraStream.srcObject = stream;
          cameraStream.style.display = "block";
          cameraStreamActive = true;
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          alert("Unable to access the camera. Please check your permissions.");
        });
    }
  }
});

// Voice recording functionality
const startRecording = document.getElementById("startRecording");
const stopRecording = document.getElementById("stopRecording");
const recordingStatus = document.getElementById("recordingStatus");

let mediaRecorder;
let audioChunks = [];

startRecording.addEventListener("click", () => {
  alert(
    "This application requires access to your microphone for full functionality."
  );
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      recordingStatus.textContent = "Recording...";
      startRecording.disabled = true;
      stopRecording.disabled = false;

      audioChunks = []; // Clear previous audio chunks
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Display the recorded audio with media controls
        const audioElement = document.createElement("audio");
        audioElement.controls = true;
        audioElement.src = audioUrl;

        const voiceSection = document.querySelector(".voice-section");
        const existingAudio = voiceSection.querySelector("audio");
        if (existingAudio) {
          existingAudio.remove(); // Remove previous audio element if it exists
        }
        voiceSection.appendChild(audioElement);

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

// Popup functionality
const authLink = document.getElementById("authLink");
const authPopup = document.getElementById("authPopup");
const closePopup = document.getElementById("closePopup");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

// Open the popup and show the login form by default
authLink.addEventListener("click", (e) => {
  e.preventDefault();
  authPopup.style.display = "block";
  loginForm.style.display = "block";
  registerForm.style.display = "none";
});

// Close the popup
closePopup.addEventListener("click", () => {
  authPopup.style.display = "none";
});

// Switch to the register form
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  registerForm.style.display = "block";
});

// Close the popup when clicking outside of it
window.addEventListener("click", (e) => {
  if (e.target === authPopup) {
    authPopup.style.display = "none";
  }
});

// Function to show success message
function showSuccessMessage(message) {
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;
  document.body.appendChild(successDiv);

  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Handle login form submission
loginForm.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  if (username && password) {
    console.log(`Login attempt with username: ${username}`);
    showSuccessMessage(`Welcome back, ${username}!`);
    loginForm.querySelector("form").reset(); // Clear inputs
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
    console.log(`Registration attempt with email/mobile: ${emailOrMobile}`);
    showSuccessMessage(`Registration successful! Welcome to Moodal!`);
    registerForm.querySelector("form").reset(); // Clear inputs
  } else {
    alert("Please fill in all fields.");
  }
});

// Variables to store user inputs
let capturedImage = null;
let selectedMood = null;
let selectedStyle = null;
let artDescription = null;

// Handle mood button selection and art style selection
document.addEventListener("DOMContentLoaded", () => {
  const moodButtons = document.querySelectorAll(".mood-button");
  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      moodButtons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
      selectedMood = button.getAttribute("data-mood");
      console.log(`Mood selected: ${selectedMood}`);
    });
  });

  const styleButtons = document.querySelectorAll(".style-button");
  styleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      styleButtons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
      selectedStyle = button.getAttribute("data-style");
      console.log(`Style selected: ${selectedStyle}`);
    });
  });
});

// Apply random colors to art style buttons
document.addEventListener("DOMContentLoaded", () => {
  const styleButtons = document.querySelectorAll(".style-button, .mood-button");
  styleButtons.forEach((button) => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    button.style.backgroundColor = randomColor;
    button.style.color = "#fff"; // Ensure text is visible
  });
});

// Handle image upload
const imageUpload = document.getElementById("imageUpload");
imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      capturedImage = reader.result; // Base64 encoded image
      console.log("Image uploaded successfully.");
    };
    reader.readAsDataURL(file);
  }
});

document
  .getElementById("imageUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Please upload only image files.");
      event.target.value = ""; // Clear the input
    }
  });

document
  .getElementById("imageUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById("imagePreview");
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

// Function to show the loading overlay
function showLoadingOverlay() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.innerHTML = `
    <div class="loading-text">Generating<span class="dots">
      <span></span><span></span><span></span>
    </span></div>
  `;
  loadingOverlay.style.display = "flex";
}

// Function to hide the loading overlay
function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "none";
}

// Function to send data to the backend API
async function generateDigitalArt() {
  if (!selectedMood || !selectedStyle) {
    alert("Please provide all inputs: mood and art style.");
    return;
  }

  const attributesElement = document.getElementById("artAttributes");
  const attributes = attributesElement ? attributesElement.value : "";

  const requestBody = {
    mood: selectedMood,
    style: selectedStyle,
    subject: attributes || "artwork",
  };

  try {
    showLoadingOverlay(); // Show loading overlay

    console.log("Sending request to backend with data:", requestBody);

    const response = await fetch("http://localhost:3000/generate-art", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      alert(`Backend error: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Backend response data:", data);

    if (data.url) {
      displayGeneratedArt(data.url);
    } else {
      alert("Failed to generate art. Please try again.");
    }
  } catch (error) {
    if (error.message.includes("HTTP error")) {
      console.error("Error during API call:", error);
    } else {
      alert("An error occurred while generating art. Please try again later.");
    }
  } finally {
    hideLoadingOverlay(); // Hide loading overlay
  }
}

// Function to display the generated art
function displayGeneratedArt(artUrl) {
  const artCanvas = document.getElementById("artCanvas");
  artCanvas.innerHTML = `<img src="${artUrl}" alt="Generated Art" class="generated-art" />`;

  const seeFullArtButton = document.getElementById("seeFullArtButton");
  seeFullArtButton.style.display = "inline-block";
  seeFullArtButton.addEventListener("click", () => {
    localStorage.setItem("generatedArtUrl", artUrl);
    window.location.href = "generated-art.htm";
  });
}

// Function to save the generated art
function saveArt() {
  const artCanvas = document.getElementById("artCanvas");
  const generatedArt = artCanvas.querySelector(".generated-art");

  if (!generatedArt) {
    alert("No art available to save. Please generate art first.");
    return;
  }

  const artUrl = generatedArt.src;
  const link = document.createElement("a");
  link.href = artUrl;
  link.download = "generated-art.png"; // Default filename
  link.click();
}

// Mood toggling functionality
const moodButtons = document.getElementById("moodButtons");
const toggleMoodsButton = document.getElementById("toggleMoodsButton");

const initialMoods = [
  { mood: "happy", label: "Happy" },
  { mood: "sad", label: "Sad" },
  { mood: "angry", label: "Angry" },
  { mood: "calm", label: "Calm" },
  { mood: "excited", label: "Excited" },
  { mood: "relaxed", label: "Relaxed" },
  { mood: "nostalgic", label: "Nostalgic" },
  { mood: "romantic", label: "Romantic" },
  { mood: "mysterious", label: "Mysterious" },
  { mood: "energetic", label: "Energetic" },
];

const otherMoods = [
  { mood: "playful", label: "Playful" },
  { mood: "dreamy", label: "Dreamy" },
  { mood: "serene", label: "Serene" },
  { mood: "curious", label: "Curious" },
  { mood: "melancholic", label: "Melancholic" },
  { mood: "adventurous", label: "Adventurous" },
];

let showingInitialMoods = true;

toggleMoodsButton.addEventListener("click", () => {
  moodButtons.innerHTML = "";
  const moodsToShow = showingInitialMoods ? otherMoods : initialMoods;
  moodsToShow.forEach(({ mood, label }) => {
    const button = document.createElement("button");
    button.className = "mood-button";
    button.dataset.mood = mood;
    button.textContent = label;

    // Preserve random color functionality for mood buttons
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    button.style.backgroundColor = randomColor;
    button.style.color = "#fff"; // Ensure text is visible

    // Add event listener for mood selection
    button.addEventListener("click", () => {
      // Remove 'selected' class from all buttons
      document.querySelectorAll(".mood-button").forEach((btn) => {
        btn.classList.remove("selected");
      });

      // Add 'selected' class to the clicked button
      button.classList.add("selected");

      // Update the selected mood and log it to the console
      selectedMood = button.dataset.mood;
      console.log(`Mood selected: ${selectedMood}`);
    });

    moodButtons.appendChild(button);
  });
  toggleMoodsButton.textContent = showingInitialMoods
    ? "Back to Initial Moods"
    : "Other Moods";
  showingInitialMoods = !showingInitialMoods;
});
