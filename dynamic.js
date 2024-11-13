// Function to open or display content for a category
function openCategory(category) {
    alert("You clicked on: " + category);
    // Here, you can replace alert with actual navigation or dynamic content loading
    switch(category) {
        case 'sql':
            alert("SQL: Learn about database management and querying!");
            break;
        case 'dsa':
            alert("DSA: Dive into data structures and algorithms!");
            break;
        case 'github':
            alert("GitHub: Understand version control and collaborate!");
            break;
        case 'system-design':
            alert("System Design: Learn how to design scalable and efficient systems!");
            break;
        case 'other-info':
            alert("Other Information: Explore a variety of other topics and expand your knowledge!");
            break;
        default:
            alert("Unknown Category");
    }
}
