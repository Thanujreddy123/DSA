// Import Firebase SDK for Web
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaR7ud2D3Dg9gsgJq67WKK3i2v-UaoM2E",
  authDomain: "attendance-app-df536.firebaseapp.com",
  projectId: "attendance-app-df536",
  storageBucket: "attendance-app-df536.firebasestorage.app",
  messagingSenderId: "788510462730",
  appId: "1:788510462730:web:269e70518e4a57a25320f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Step 1: Push data from localStorage to Firestore

async function pushDataToFirebase() {
    // Load topics from localStorage
    const storedTopics = JSON.parse(localStorage.getItem('topics')) || {};

    // Loop through each category in storedTopics
    for (let category in storedTopics) {
        const topics = storedTopics[category];

        // Push topics to Firebase
        if (topics && topics.length > 0) {
            try {
                // Reference to the Firestore collection for the category
                const categoryRef = collection(db, "categories");

                // Add each topic to Firestore
                for (let topic of topics) {
                    await addDoc(categoryRef, {
                        category: category,
                        title: topic.title,
                        reason: topic.reason,
                        code: topic.code,
                        extra: topic.extra,
                    });
                }

                console.log(`Successfully added topics for category: ${category}`);
            } catch (error) {
                console.error("Error adding data to Firebase: ", error);
            }
        }
    }
}

// Step 2: Retrieve data from Firebase (only from Firebase, not localStorage)

async function retrieveDataFromFirebase() {
    const querySnapshot = await getDocs(collection(db, "categories"));
    let topics = {};

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const category = data.category;

        // If category doesn't exist in the object, initialize it
        if (!topics[category]) {
            topics[category] = [];
        }

        // Push the topic data into the respective category
        topics[category].push({
            title: data.title,
            reason: data.reason,
            code: data.code,
            extra: data.extra,
        });
    });

    // After retrieving the data from Firestore, save it to localStorage
    localStorage.setItem('topics', JSON.stringify(topics));
    console.log("Data retrieved from Firebase and saved to localStorage:", topics);

    // Now you can display the topics on your webpage
    displayCategories(topics);
}

// Function to display all categories and topics
function displayCategories(topics) {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';  // Clear previous categories

    // Display each category
    for (const category in topics) {
        const categoryPlate = document.createElement('div');
        categoryPlate.classList.add('category-plate');
        categoryPlate.onclick = function() {
            showSubTopics(category, topics);
        };

        categoryPlate.innerHTML = `
            <h2>${category}</h2>
            <p>Learn about ${category}!</p>
        `;

        container.appendChild(categoryPlate);
    }
}

// Function to display sub-topics of a selected category
function showSubTopics(category, topics) {
    const subTopicContainer = document.getElementById('sub-topic-container');
    subTopicContainer.innerHTML = ''; // Clear previous content

    // Get the topics based on the category
    const selectedTopics = topics[category] || [];

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

// Function to escape HTML special characters
function escapeHtml(text) {
    const element = document.createElement('div');
    if (text) {
        element.textContent = text;  // Only use textContent to avoid HTML parsing
    }
    return element.innerHTML;  // Returns the HTML-escaped version of the string
}

// Start the process
async function startApp() {
    // Step 1: Push data from localStorage to Firestore
    await pushDataToFirebase();

    // Step 2: Retrieve data from Firestore and display it
    await retrieveDataFromFirebase();
}

// Initialize the app
startApp();
