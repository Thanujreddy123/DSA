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

// Function to display categories
function displayCategories(topics) {
    const container = document.getElementById('categories-container');
    
    if (!container) {
        console.error('Categories container not found!');
        return;
    }

    // Clear previous categories
    container.innerHTML = '';

    const categories = Object.keys(topics);  // Extract category names from the topics object
    categories.forEach(category => {
        const categoryPlate = document.createElement('div');
        categoryPlate.classList.add('category-plate');
        
        // Event listener for category click
        categoryPlate.onclick = function() {
            showSubTopics(category);
        };

        // Add category name to the plate
        categoryPlate.innerHTML = `
            <h2>${category}</h2>
            <p>Learn about ${category}!</p>
        `;

        // Append the plate to the container
        container.appendChild(categoryPlate);
    });
}

// Function to show sub-topics when a category is clicked
function showSubTopics(category) {
    const subTopicContainer = document.getElementById('sub-topic-container');
    
    // Clear the sub-topic container
    subTopicContainer.innerHTML = '';

    const selectedTopics = storedTopics[category] || []; // Retrieve topics for the selected category

    selectedTopics.forEach((topic, index) => {
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
            console.log('Document data:', data);
            storedTopics[doc.id] = data.topics || [];  // Assuming the topics are stored as an array
        });
    } catch (error) {
        console.error("Error retrieving data from Firebase:", error);
    }
}

// Call this function on page load
async function startApp() {
    await retrieveDataFromFirebase();  // Retrieve data from Firebase (update topics)
    displayCategories(storedTopics);  // Display categories on the page
}

// Call the startApp function when the page loads
window.onload = startApp;

let storedTopics = {};  // Initialize an empty object to hold topics retrieved from Firebase
