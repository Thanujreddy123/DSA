// Firebase configuration (replace with your actual Firebase credentials)
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

// Variable to hold the current category
let currentCategory = ''; 

// Function to escape HTML special characters (use only when you need to escape)
function escapeHtml(text) {
    const element = document.createElement('div');
    if (text) {
        element.textContent = text;  // Only use textContent to avoid HTML parsing
    }
    return element.innerHTML;  // Returns the HTML-escaped version of the string
}

// Function to display sub-topics based on the selected category
function showSubTopics(category) {
    currentCategory = category; // Set the current category
    const subTopicContainer = document.getElementById('sub-topic-container');
    const addTopicForm = document.getElementById('add-topic-form');
    subTopicContainer.innerHTML = ''; // Clear previous content
    addTopicForm.style.display = 'block'; // Show the form to add new topics

    // Fetch the topics for the selected category from Firestore
    db.collection('topics').doc(category).get().then((doc) => {
        if (doc.exists) {
            const selectedTopics = doc.data().topics || [];

            // Create a plate for each topic
            selectedTopics.forEach((topic, index) => {
                const plate = document.createElement('div');
                plate.classList.add('sub-topic-plate');

                // Create the delete button here
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete Topic';

                // Attach the click event listener for deleting the topic
                deleteButton.addEventListener('click', function() {
                    deleteTopic(category, index);
                });

                plate.innerHTML = `
                    <h3>${topic.title}</h3>
                    <p><strong>Why it matters:</strong> ${topic.reason}</p>
                    <pre><code>${topic.code}</code></pre>
                    <p><strong>Extra Information:</strong> ${topic.extra}</p>
                `;

                // Append the button to the plate
                plate.appendChild(deleteButton);

                subTopicContainer.appendChild(plate);
            });
        }
    }).catch((error) => {
        console.error("Error fetching topics: ", error);
    });
}

// Function to handle adding new topics
document.getElementById('topicForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the values from the form inputs
    const title = document.getElementById('title').value;
    const reason = document.getElementById('reason').value;
    const code = document.getElementById('code').value;
    const extra = document.getElementById('extra').value;

    // Escape the code to prevent special characters from breaking HTML
    const escapedCode = escapeHtml(code);

    // Create a new topic object
    const newTopic = {
        title: title,
        reason: reason,
        code: escapedCode,
        extra: extra
    };

    // Add the new topic to Firestore
    const categoryRef = db.collection('topics').doc(currentCategory);
    categoryRef.update({
        topics: firebase.firestore.FieldValue.arrayUnion(newTopic)
    }).then(() => {
        // Refresh the topics after adding
        showSubTopics(currentCategory);
        document.getElementById('topicForm').reset(); // Reset the form
    }).catch((error) => {
        console.error("Error adding topic: ", error);
    });
});

// Function to handle adding new categories
document.getElementById('add-category-btn').addEventListener('click', function() {
    const newCategoryName = prompt("Enter the name of the new category:");

    // Validate and check if category already exists
    if (newCategoryName) {
        const categoryRef = db.collection('topics').doc(newCategoryName.toLowerCase());

        categoryRef.get().then((docSnapshot) => {
            if (!docSnapshot.exists) {
                // Create new category in Firestore
                categoryRef.set({
                    name: newCategoryName,
                    topics: []  // Empty array for topics
                }).then(() => {
                    // Create the category plate and append it to the page
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
                });
            } else {
                alert("Category already exists.");
            }
        }).catch((error) => {
            console.error("Error creating category: ", error);
        });
    }
});

// Function to delete a topic
function deleteTopic(category, index) {
    if (confirm(`Are you sure you want to delete the topic: ${storedTopics[category][index].title}?`)) {
        // Remove the topic from Firestore
        const categoryRef = db.collection('topics').doc(category);
        categoryRef.update({
            topics: firebase.firestore.FieldValue.arrayRemove(storedTopics[category][index])
        }).then(() => {
            // Refresh the displayed sub-topics
            showSubTopics(category);
        }).catch((error) => {
            console.error("Error deleting topic: ", error);
        });
    }
}

// Function to display all categories
function displayCategories() {
    db.collection('topics').get().then((querySnapshot) => {
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

// Initial display of categories on page load
displayCategories();
