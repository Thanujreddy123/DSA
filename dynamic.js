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
    ],
    dsa: [
        {
            title: 'Arrays',
            reason: 'Arrays are data structures used to store multiple values.',
            code: 'let arr = [1, 2, 3, 4];',
            extra: 'Arrays provide fast access to elements by index.'
        },
        {
            title: 'Linked Lists',
            reason: 'Linked lists are data structures with nodes connected through pointers.',
            code: 'let node1 = { value: 1, next: null };',
            extra: 'Good for dynamic memory allocation and easy insertion/deletion.'
        }
    ],
    github: [
        {
            title: 'Basic Git Commands',
            reason: 'Learning Git commands is fundamental for version control in software development.',
            code: 'git init\ngit add .\ngit commit -m "Initial commit"\ngit push origin master',
            extra: 'Git is a distributed version control system.'
        },
        {
            title: 'Forking and Pull Requests',
            reason: 'Forking repositories and creating pull requests are essential for collaborating on GitHub.',
            code: 'git fork <repo-url>\ngit clone <forked-repo-url>\ngit push origin branch-name',
            extra: 'Pull requests allow team collaboration on GitHub.'
        }
    ],
    systemDesign: [
        {
            title: 'Load Balancing',
            reason: 'Load balancing is used to distribute network traffic across multiple servers.',
            code: 'Implementing a load balancer in cloud environments like AWS, GCP, or Azure.',
            extra: 'Load balancers can be hardware or software-based.'
        },
        {
            title: 'Microservices Architecture',
            reason: 'Microservices enable building scalable and maintainable systems by dividing the system into smaller services.',
            code: 'Microservices communicate using REST APIs or messaging queues.',
            extra: 'Microservices can be deployed and scaled independently.'
        }
    ]
};

// Save the topics to LocalStorage
function saveTopicsToLocalStorage() {
    localStorage.setItem('topics', JSON.stringify(storedTopics));
}

// Function to escape HTML characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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

        // Escape the code to ensure HTML characters are displayed correctly
        const escapedCode = escapeHtml(topic.code);

        plate.innerHTML = `
            <h3>${topic.title}</h3>
            <p><strong>Why it matters:</strong> ${topic.reason}</p>
            <code>${escapedCode}</code>
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

    // Escape the code to ensure HTML characters are handled properly
    const escapedCode = escapeHtml(code);

    // Create a new topic object
    const newTopic = {
        title: title,
        reason: reason,
        code: escapedCode, // Use escaped code
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

// Function to handle adding new categories
document.getElementById('add-category-btn').addEventListener('click', function() {
    const newCategoryName = prompt("Enter the name of the new category:");

    // If the user provides a category name and it doesn't already exist
    if (newCategoryName && !storedTopics[newCategoryName.toLowerCase()]) {
        // Add the new category with an empty array of topics
        storedTopics[newCategoryName.toLowerCase()] = [];

        // Save updated topics to LocalStorage
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
            <button onclick="deleteCategory('${newCategoryName.toLowerCase()}')">Delete Category</button>
        `;

        // Add the new category plate to the container
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
        document.getElementById('main-container').innerHTML = ''; // Clear displayed categories
        displayCategories(); // Re-render categories after deletion
    }
}

// Function to delete a topic
function deleteTopic(category, index) {
    if (confirm(`Are you sure you want to delete the topic: ${storedTopics[category][index].title}?`)) {
        storedTopics[category].splice(index, 1);
        saveTopicsToLocalStorage();
        showSubTopics(category); // Refresh the topics for the selected category
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
            <button onclick="deleteCategory('${category}')">Delete Category</button>
        `;
        document.getElementById('main-container').appendChild(categoryPlate);
    });
}

// Initial display of categories on page load
displayCategories();
