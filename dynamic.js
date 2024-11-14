let currentCategory = ''; // Variable to store the current selected category

// Load topics from localStorage or use the default if none exists
const storedTopics = JSON.parse(localStorage.getItem('topics')) || {
    sql: [
        {
            title: 'SQL Insertion',
            reason: 'Inserting data into a database is crucial for data management.',
            code: 'INSERT INTO users (name, age) VALUES ("John", 25);',
            extra: 'Used to add new records into the database.'
        },
        {
            title: 'SQL Deletion',
            reason: 'Deleting data from a database is essential for data management.',
            code: 'DELETE FROM users WHERE id = 1;',
            extra: 'Used to remove data from a table based on a condition.'
        }
    ]
};

// Function to escape HTML special characters
function escapeHtml(text) {
    const element = document.createElement('div');
    if (text) {
        element.innerText = text;
        element.textContent = text;
    }
    return element.innerHTML;
}

// Function to unescape HTML special characters (optional)
function unescapeHtml(text) {
    const element = document.createElement('div');
    if (text) {
        element.innerHTML = text;
    }
    return element.innerText;
}

// Save the topics to LocalStorage
function saveTopicsToLocalStorage() {
    localStorage.setItem('topics', JSON.stringify(storedTopics));
}

// Function to display sub-topics based on the selected category
function showSubTopics(category) {
    currentCategory = category; // Set the current category
    const subTopicContainer = document.getElementById('sub-topic-container');
    const addTopicForm = document.getElementById('add-topic-form');
    subTopicContainer.innerHTML = ''; // Clear previous content
    addTopicForm.style.display = 'block'; // Show the form to add new topics

    // Get the topics based on the category
    const selectedTopics = storedTopics[category] || [];

    // Create a plate for each topic
    selectedTopics.forEach((topic, index) => {
        const plate = document.createElement('div');
        plate.classList.add('sub-topic-plate');

        plate.innerHTML = `
            <h3>${topic.title}</h3>
            <p><strong>Why it matters:</strong> ${topic.reason}</p>
            <pre><code>${escapeHtml(topic.code)}</code></pre>
            <p><strong>Extra Information:</strong> ${topic.extra}</p>
            <button onclick="deleteTopic('${category}', ${index})">Delete Topic</button>
        `;

        subTopicContainer.appendChild(plate);
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

    // Check if the category exists
    if (!storedTopics[currentCategory]) {
        storedTopics[currentCategory] = [];
    }

    // Add the new topic to the current category
    storedTopics[currentCategory].push(newTopic);

    // Save updated topics to LocalStorage
    saveTopicsToLocalStorage();

    // Call showSubTopics again to refresh the topics displayed
    showSubTopics(currentCategory);

    // Reset the form
    document.getElementById('topicForm').reset();
});

// ... (previous code)

// Function to handle adding new categories
document.getElementById('add-category-btn').addEventListener('click', function() {
    const newCategoryName = prompt("Enter the name of the new category:");

    // Add validation and error handling here
    if (newCategoryName && !storedTopics[newCategoryName.toLowerCase()]) {
        storedTopics[newCategoryName.toLowerCase()] = [];
        saveTopicsToLocalStorage();

        // Create a new category plate and append it to the page
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
    } else {
        alert("Category name is either empty or already exists.");
    }
});

// Function to delete a category
function deleteCategory(category) {
    if (confirm(`Are you sure you want to delete the category: ${category}?`)) {
        delete storedTopics[category];
        saveTopicsToLocalStorage();
        document.getElementById('main-container').innerHTML = '';
        displayCategories();
    }
}

// Function to display all categories
function displayCategories() {
    const categories = Object.keys(storedTopics);
    categories.forEach(category => {
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
}

// Initial display of categories on page load
displayCategories();

