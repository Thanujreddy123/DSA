let currentCategory = ''; // Variable to store the current selected category

// Function to get all categories from the backend
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5000/api/categories');
        const categories = await response.json();
        categories.forEach(category => {
            const newCategoryPlate = document.createElement('div');
            newCategoryPlate.classList.add('category-plate');
            newCategoryPlate.onclick = function() {
                showSubTopics(category.name);
            };
            newCategoryPlate.innerHTML = `
                <h2>${category.name}</h2>
                <p>Learn about ${category.name}!</p>
            `;
            document.getElementById('new-categories-container').appendChild(newCategoryPlate);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Function to display sub-topics based on the selected category
async function showSubTopics(category) {
    currentCategory = category;
    const subTopicContainer = document.getElementById('sub-topic-container');
    const addTopicForm = document.getElementById('add-topic-form');
    subTopicContainer.innerHTML = ''; // Clear previous content
    addTopicForm.style.display = 'block'; // Show the form to add new topics

    try {
        const response = await fetch(`http://localhost:5000/api/topics/${category}`);
        const topics = await response.json();
        
        topics.forEach((topic, index) => {
            const plate = document.createElement('div');
            plate.classList.add('sub-topic-plate');

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete Topic';
            deleteButton.addEventListener('click', function() {
                deleteTopic(topic._id); // Pass the topic ID to delete it
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
    } catch (error) {
        console.error("Error fetching topics:", error);
    }
}

// Function to handle adding new topics
document.getElementById('topicForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting

    const title = document.getElementById('title').value;
    const reason = document.getElementById('reason').value;
    const code = document.getElementById('code').value;
    const extra = document.getElementById('extra').value;

    const newTopic = { title, reason, code, extra, category: currentCategory };

    try {
        const response = await fetch('http://localhost:5000/api/topics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTopic)
        });
        const data = await response.json();
        alert(data.message); // Show success message
        showSubTopics(currentCategory); // Refresh the topics
        document.getElementById('topicForm').reset();
    } catch (error) {
        console.error("Error adding topic:", error);
    }
});

// Function to handle deleting a topic
async function deleteTopic(id) {
    if (confirm("Are you sure you want to delete this topic?")) {
        try {
            const response = await fetch(`http://localhost:5000/api/topics/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            alert(data.message); // Show success message
            showSubTopics(currentCategory); // Refresh the topics
        } catch (error) {
            console.error("Error deleting topic:", error);
        }
    }
}

// Fetch categories when the page loads
window.onload = function() {
    fetchCategories();
};
