// Firebase Configuration
// TODO: Replace with your Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const form = document.getElementById('responseForm');
const messageInput = document.getElementById('message');
const nameInput = document.getElementById('name');
const anonymousCheckbox = document.getElementById('anonymous');
const imageUpload = document.getElementById('imageUpload');
const imageFileInput = document.getElementById('imageFile');
const imagePreview = document.getElementById('imagePreview');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

let selectedImage = null;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Anonymous checkbox toggle
    anonymousCheckbox.addEventListener('change', toggleAnonymous);
    
    // Image upload handlers
    imageUpload.addEventListener('click', () => imageFileInput.click());
    imageFileInput.addEventListener('change', handleImageSelect);
    
    // Drag and drop for images
    imageUpload.addEventListener('dragover', handleDragOver);
    imageUpload.addEventListener('dragleave', handleDragLeave);
    imageUpload.addEventListener('drop', handleDrop);
}

function toggleAnonymous() {
    if (anonymousCheckbox.checked) {
        nameInput.disabled = true;
        nameInput.value = '';
        nameInput.placeholder = 'Anonymous';
    } else {
        nameInput.disabled = false;
        nameInput.placeholder = 'Enter your name';
    }
}

function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        validateAndPreviewImage(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    imageUpload.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    imageUpload.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    imageUpload.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            validateAndPreviewImage(file);
        } else {
            showError('Please select a valid image file.');
        }
    }
}

function validateAndPreviewImage(file) {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB.');
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file.');
        return;
    }
    
    selectedImage = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.innerHTML = `
            <div class="text-center">
                <img src="${e.target.result}" alt="Preview" class="image-preview">
                <div class="mt-2">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeImage()">
                        <i class="fas fa-times"></i> Remove
                    </button>
                </div>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    selectedImage = null;
    imagePreview.innerHTML = '';
    imageFileInput.value = '';
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    hideMessages();
    
    try {
        // Prepare data
        const formData = {
            message: messageInput.value.trim(),
            name: anonymousCheckbox.checked ? 'Anonymous' : (nameInput.value.trim() || 'Anonymous'),
            isAnonymous: anonymousCheckbox.checked,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: new Date().toISOString()
        };
        
        // Upload image if selected
        if (selectedImage) {
            const imageUrl = await uploadImage(selectedImage);
            formData.imageUrl = imageUrl;
        }
        
        // Save to Firestore
        await saveToFirestore(formData);
        
        // Show success message
        showSuccess();
        resetForm();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Failed to send message. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

function validateForm() {
    const message = messageInput.value.trim();
    
    if (!message) {
        showError('Please enter a message.');
        messageInput.focus();
        return false;
    }
    
    if (message.length < 10) {
        showError('Message must be at least 10 characters long.');
        messageInput.focus();
        return false;
    }
    
    return true;
}

async function uploadImage(file) {
    const timestamp = Date.now();
    const filename = `responses/${timestamp}_${file.name}`;
    const storageRef = storage.ref(filename);
    
    // Upload file
    const snapshot = await storageRef.put(file);
    
    // Get download URL
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
}

async function saveToFirestore(data) {
    await db.collection('responses').add(data);
}

function setLoadingState(isLoading) {
    submitBtn.disabled = isLoading;
    const normalText = submitBtn.querySelector('.normal-text');
    const loadingText = submitBtn.querySelector('.loading');
    
    if (isLoading) {
        normalText.style.display = 'none';
        loadingText.style.display = 'inline';
    } else {
        normalText.style.display = 'inline';
        loadingText.style.display = 'none';
    }
}

function showSuccess() {
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 8000);
}

function hideMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

function resetForm() {
    form.reset();
    removeImage();
    nameInput.disabled = false;
    nameInput.placeholder = 'Enter your name';
}

// Utility function to format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return new Date().toLocaleString();
    
    if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
    }
    
    return new Date(timestamp).toLocaleString();
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        toggleAnonymous,
        validateAndPreviewImage,
        removeImage
    };
}