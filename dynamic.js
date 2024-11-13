let currentCategory = ''; // Variable to store the current selected category

// Define sub-topics for each category outside the form submission handler
const topics = {
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

// Function to display sub-topics based on the selected category
function showSubTopics(category) {
    currentCategory = category; // Set the current category
    const subTopicContainer = document.getElementById('sub-topic-container');
    const addTopicForm = document.getElementById('add-topic-form');
    subTopicContainer.innerHTML = ''; // Clear previous content
    addTopicForm.style.display = 'block'; // Show the form to add new topics

    // Get the topics based on the category
    const selectedTopics = topics[category] || [];

    // Create a plate for each topic
    selectedTopics.forEach(topic => {
        const plate = document.createElement('div');
        plate.classList.add('sub-topic-plate');

        plate.innerHTML = `
            <h3>${topic.title}</h3>
            <p><strong>Why it matters:</strong> ${topic.reason}</p>
            <code>${topic.code}</code>
            <p><strong>Extra Information:</strong> ${topic.extra}</p>
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

    // Create a new topic object
    const newTopic = {
        title: title,
        reason: reason,
        code: code,
        extra: extra
    };

    // Check if the category exists
    if (!topics[currentCategory]) {
        topics[currentCategory] = [];
    }

    // Add the new topic to the current category
    topics[currentCategory].push(newTopic);

    // Call showSubTopics again to refresh the topics displayed
    showSubTopics(currentCategory);

    // Reset the form
    document.getElementById('topicForm').reset();
});
