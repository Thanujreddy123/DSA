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

// The current category for adding topics
let currentCategory = ''; 

// Function to save topics to Firestore
async function saveTopicsToFirestore(category, topics) {
    const topicsCollectionRef = collection(db, 'categories');
    // Adding category data to Firestore
    try {
        await addDoc(topicsCollectionRef, {
            category: category,
            topics: topics
        });
        console.log('Data saved to Firestore');
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Load topics from Firestore
async function loadTopicsFromFirestore(category) {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    querySnapshot.forEach((doc) => {
        if (doc.data().category === category) {
            const topics = doc.data().topics;
            displaySubTopics(topics);  // Display the topics on the page
        }
    });
}

// Function to display topics on the page
function displaySubTopics(topics) {
    const subTopicContainer = document.getElementById('sub-topic-container');
    subTopicContainer.innerHTML = '';  // Clear existing topics
    topics.forEach((topic, index) => {
        const plate = document.createElement('div');
        plate.classList.add('sub-topic-plate');
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Topic';
        deleteButton.addEventListener('click', function () {
            deleteTopic(index);
        });

        plate.innerHTML = `
            <h3>${topic.title}</h3>
            <p><strong>Why it matters:</strong> ${topic.reason}</p>
            <pre><code>${topic.code}</code></pre>
            <p><strong>Extra Information:</strong> ${topic.extra}</p>
        `;

        plate.appendChild(deleteButton);
        subTopicContainer.appendChild(plate);
    });
}

// Function to handle form submission for new topics
document.getElementById('topicForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const title = document.getElementById('title').value;
    const reason = document.getElementById('reason').value;
    const code = document.getElementById('code').value;
    const extra = document.getElementById('extra').value;

    const newTopic = {
        title: title,
        reason: reason,
        code: code,
        extra: extra
    };

    // Save the topic to Firestore
    saveTopicsToFirestore(currentCategory, [newTopic]);

    // Reset the form
    document.getElementById('topicForm').reset();
});

// Function to handle category selection
document.getElementById('add-category-btn').addEventListener('click', function () {
    const newCategoryName = prompt("Enter the name of the new category:");
    if (newCategoryName && !currentCategory) {
        currentCategory = newCategoryName.toLowerCase();
        loadTopicsFromFirestore(currentCategory);
    }
});

// Function to delete a topic from Firestore
function deleteTopic(index) {
    // Logic to delete a topic from Firestore (you can implement this similarly as above)
    console.log("Deleting topic at index: ", index);
}

