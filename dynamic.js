// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

// Your Firebase configuration
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

let currentCategory = ''; // Variable to store the current selected category

// Function to display categories
function displayCategories() {
    const categoriesRef = collection(db, 'topics');
    getDocs(categoriesRef).then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.log("No categories found");
        }
        querySnapshot.forEach((doc) => {
            const category = doc.id;
            const categoryPlate = document.createElement('div');
            categoryPlate.classList.add('category-plate');
            categoryPlate.onclick = function() {
                showSubTopics(category);
            };

            categoryPlate.innerHTML = `
                <h2>${category}</h2>
                <p>Learn about ${category}!</p>
            `;

            document.getElementById('main-container').appendChild(categoryPlate);
        });
    }).catch((error) => {
        console.error("Error displaying categories: ", error);
    });
}

// Function to show sub-topics for a category
function showSubTopics(category) {
    currentCategory = category; // Set the current category
    const subTopicContainer = document.getElementById('sub-topic-container');
    const addTopicForm = document.getElementById('add-topic-form');
    subTopicContainer.innerHTML = ''; // Clear previous content
    addTopicForm.style.display = 'block'; // Show the form to add new topics

    // Fetch topics for the selected category from Firestore
    const categoryRef = doc(db, "topics", category);
    getDoc(categoryRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
            const selectedTopics = docSnapshot.data().topics || [];

            selectedTopics.forEach((topic, index) => {
                const plate = document.createElement('div');
                plate.classList.add('sub-topic-plate');

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete Topic';
                deleteButton.addEventListener('click', function() {
                    deleteTopic(category, index);
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
        } else {
            console.log("No topics found for this category");
        }
    }).catch((error) => {
        console.error("Error fetching topics: ", error);
    });
}

// Function to handle adding new topics
document.getElementById('topicForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    const title = document.getElementById('title').value;
    const reason = document.getElementById('reason').value;
    const code = document.getElementById('code').value;
    const extra = document.getElementById('extra').value;

    const newTopic = { title, reason, code, extra };

    // Fetch the current topics and add the new one
    const categoryRef = doc(db, "topics", currentCategory);
    getDoc(categoryRef).then((docSnapshot) => {
        let topics = docSnapshot.exists() ? docSnapshot.data().topics : [];
        topics.push(newTopic);

        // Save the updated topics back to Firestore
        setDoc(categoryRef, { topics }, { merge: true }).then(() => {
            showSubTopics(currentCategory);
            document.getElementById('topicForm').reset();
        }).catch((error) => {
            console.error("Error adding topic: ", error);
        });
    }).catch((error) => {
        console.error("Error fetching category: ", error);
    });
});

// Function to handle adding new categories
document.getElementById('add-category-btn').addEventListener('click', function() {
    const newCategoryName = prompt("Enter the name of the new category:");

    if (newCategoryName && !storedTopics[newCategoryName.toLowerCase()]) {
        const newCategoryRef = doc(db, 'topics', newCategoryName.toLowerCase());

        // Initialize the new category with an empty list of topics
        setDoc(newCategoryRef, { topics: [] }).then(() => {
            const newCategoryPlate = document.createElement('div');
            newCategoryPlate.classList.add('category-plate');
            newCategoryPlate.onclick = function() {
                showSubTopics(newCategoryName.toLowerCase());
            };

            newCategoryPlate.innerHTML = `
                <h2>${newCategoryName}</h2>
                <p>Learn about ${newCategoryName}!</p>
            `;

            document.getElementById('new-categories-container').appendChild(newCategoryPlate);
        }).catch((error) => {
            console.error("Error creating category: ", error);
        });
    } else {
        alert("Category name is either empty or already exists.");
    }
});

// Initial display of categories on page load
displayCategories();
