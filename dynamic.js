// Function to display sub-topics based on selected category
function showSubTopics(category) {
    const subTopicContainer = document.getElementById('sub-topic-container');
    subTopicContainer.innerHTML = ''; // Clear previous content

    // Define sub-topics for each category
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
        ],
        github: [
            {
                title: 'Version Control',
                reason: 'GitHub is used for version control to track changes in code.',
                code: 'git commit -m "Fix bug in user login";',
                extra: 'Essential for team collaboration and code history management.'
            }
        ],
        systemDesign: [
            {
                title: 'Scalability',
                reason: 'Designing systems that can handle increased load is crucial.',
                code: 'Implementing load balancers, database sharding.',
                extra: 'Scaling up ensures systems can handle more users and data.'
            }
        ],
        otherInfo: [
            {
                title: 'Other Topics',
                reason: 'Various miscellaneous topics to explore and learn.',
                code: 'const newTopic = "Exploring new topics";',
                extra: 'Various subjects that do not fit into the main categories.'
            }
        ]
    };

    // Get the topics based on the category
    const selectedTopics = topics[category];

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
