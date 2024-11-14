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
    ]
};

// Function to escape HTML special characters (like < and >)
function escapeHTML(str) {
    var element = document.createElement('div');
    if (str) {
        element.innerText = str;
        element.textContent = str;
    }
    return element.innerHTML;
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

    const selectedTopics = storedTopics[category] || [];

    selectedTopics.forEach((topic, index) => {
        const plate = document.createElement('div');
        plate.classList.add('sub-topic-plate');

        plate.innerHTML = `
            <h3>${topic.title}</h3>
            <p><strong>Why it matters:</strong> ${topic.reason}</p>
            <pre><code>${topic.code}</code></pre> <!-- Display the code inside <pre><code> -->
            <p><strong>Extra Information:</strong> ${topic.extra}</p>
            <button onclick="deleteTopic('${category}', ${index})">Delete Topic</button>
        `;

        subTopicContainer.appendChild(plate);
    });
}

// Function to handle adding new topics
document.getElementById('topicForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    const title = document.getElementById('title').value;
    const reason = document.getElementById('reason').value;
    const code = document.getElementById('code').value;
    const extra = document.getElementById('extra').value;

    // Escape the code to prevent special characters from being interpreted as HTML
    const escapedCode = escapeHTML(code);

    const newTopic = {
        title: title,
        reason: reason,
        code: escapedCode, // Store the escaped code
        extra: extra
    };

    if (!storedTopics[currentCategory]) {
        storedTopics[currentCategory] = [];
    }

    storedTopics[currentCategory].push(newTopic);

    saveTopicsToLocalStorage(); // Save updated topics to localStorage
    showSubTopics(currentCategory); // Refresh sub-topics display
    document.getElementById('topicForm').reset(); // Reset the form
});
