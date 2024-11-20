// Firebase config (replace with your actual Firebase credentials)
const firebaseConfig = {
  apiKey: "AIzaSyBaR7ud2D3Dg9gsgJq67WKK3i2v-UaoM2E",
  authDomain: "attendance-app-df536.firebaseapp.com",
  projectId: "attendance-app-df536",
  storageBucket: "attendance-app-df536.firebasestorage.app",
  messagingSenderId: "788510462730",
  appId: "1:788510462730:web:269e70518e4a57a25320f3"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to display categories and topics
function displayCategories(topics) {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';  // Clear previous categories

    // Loop through categories and display them
    Object.keys(topics).forEach((category) => {
        const categoryPlate = document.createElement('div');
        categoryPlate.classList.add('category-plate');
        
        categoryPlate.onclick = function() {
            showSubTopics(category);
        };

        categoryPlate.innerHTML = `
            <h2>${category}</h2>
            <p>Learn about ${category}!</p>
        `;
        container.appendChild(categoryPlate);
    });
}

// Function to show topics when a category is clicked
function showSubTopics(category) {
    const subTopicContainer = document.getElementById('sub-topic-container');
    subTopicContainer.innerHTML = '';  // Clear previous topics

    const selectedTopics = storedTopics[category] || [];
    selectedTopics.forEach((topic) => {
        const plate = document.createElement('div');
        plate.classList.add('sub-topic-plate');
        plate.innerHTML = `
            <h3>${topic.title}</h3>
            <p><strong>Why it matters:</strong> ${topic.reason}</p>
            <pre><code>${topic.code}</code></pre>
            <p><strong>Extra Information:</strong> ${topic.extra}</p>
        `;
        subTopicContainer.appendChild(plate);
    });
}

// Retrieve data from Firebase
async function retrieveDataFromFirebase() {
    try {
        const snapshot = await db.collection("topics").get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            storedTopics[doc.id] = data.topics || [];
        });
    } catch (error) {
        console.error("Error retrieving data from Firebase:", error);
    }
}

// Add a new category and topic to Firestore
async function addCategoryToFirebase(categoryName, topic) {
    try {
        const docRef = await db.collection("topics").add({
            name: categoryName,
            topics: [topic]
        });
        console.log("Document written with ID: ", docRef.id);
        // Reload data after adding new category
        retrieveDataFromFirebase().then(() => displayCategories(storedTopics));
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

// Event listener for adding a new category
document.getElementById('add-category-btn').addEventListener('click', () => {
    const categoryName = document.getElementById('new-category-name').value;
    const topic = {
        title: document.getElementById('new-category-name').value, // You can modify to accept more input fields
        reason: "Reason for this topic",
        code: "// code here",
        extra: "Additional information"
    };

    if (categoryName.trim()) {
        addCategoryToFirebase(categoryName, topic);
    } else {
        alert('Please enter a valid category name');
    }
});

// Start the app
async function startApp() {
    await retrieveDataFromFirebase();  // Retrieve existing categories and topics from Firebase
    displayCategories(storedTopics);  // Display them on the page
}

// Initialize storedTopics object globally to hold topics
let storedTopics = {};

// Start the app when page is loaded
window.onload = startApp;
