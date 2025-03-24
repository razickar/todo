function openLayer() {
    document.getElementById("layer").style.visibility = "visible";
}

function closeLayer() {
    document.getElementById("layer").style.visibility = "hidden";
    var userInput = document.getElementById("userinput").value.trim();
    if (userInput === "") {
        alert("Please enter some text!");
        return;
    }
    
    var category = prompt("Enter category (leave blank for 'General'):").trim();
    if (!category) {
        category = "General";
    }
    
    // Add date and priority
    var dueDate = prompt("Enter due date (optional):").trim();
    var priority = prompt("Enter priority (High, Medium, Low):").toLowerCase().trim();
    
    // Validate priority
    if (!["high", "medium", "low"].includes(priority)) {
        priority = "medium";
    }
    
    var task = { 
        text: userInput, 
        category: category,
        dueDate: dueDate,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    saveTaskToLocalStorage(task);
    renderTask(task);
    document.getElementById("userinput").value = "";
}

function renderTask(task) {
    var contentdiv = document.getElementById("contentdiv");
    var div = document.createElement("div");
    div.classList.add("notes");
    
    // Add priority color
    if (task.priority === "high") {
        div.style.background = "linear-gradient(135deg, #6b1d1d, #a52a2a)";
    } else if (task.priority === "low") {
        div.style.background = "linear-gradient(135deg, #1d3b1d, #17612f)";
    }
    
    // Create checkbox for completion
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.classList.add("task-checkbox");
    checkbox.onchange = function() {
        task.completed = checkbox.checked;
        textSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
        updateLocalStorage();
    };
    
    // Create text content with all details
    var textSpan = document.createElement("span");
    textSpan.innerText = task.text;
    if (task.completed) {
        textSpan.style.textDecoration = "line-through";
    }
    
    var categorySpan = document.createElement("div");
    categorySpan.classList.add("category");
    categorySpan.innerText = task.category;
    
    var dateInfo = document.createElement("div");
    dateInfo.classList.add("date-info");
    if (task.dueDate) {
        dateInfo.innerText = "Due: " + task.dueDate;
    }
    
    // Edit button
    var editButton = document.createElement("button");
    editButton.innerHTML = "&#x270F;"; 
    editButton.classList.add("edit-btn");
    editButton.onclick = function() {
        var newText = prompt("Edit your note:", task.text);
        if (newText !== null && newText.trim() !== "") {
            task.text = newText.trim();
            textSpan.innerText = task.text;
            
            var newCategory = prompt("Edit category:", task.category);
            if (newCategory !== null && newCategory.trim() !== "") {
                task.category = newCategory.trim();
                categorySpan.innerText = task.category;
            }
            
            var newDueDate = prompt("Edit due date:", task.dueDate || "");
            task.dueDate = newDueDate.trim();
            dateInfo.innerText = task.dueDate ? "Due: " + task.dueDate : "";
            
            var newPriority = prompt("Edit priority (High, Medium, Low):", task.priority);
            if (["high", "medium", "low"].includes(newPriority.toLowerCase().trim())) {
                task.priority = newPriority.toLowerCase().trim();
                
                // Update priority color
                if (task.priority === "high") {
                    div.style.background = "linear-gradient(135deg, #6b1d1d, #a52a2a)";
                } else if (task.priority === "medium") {
                    div.style.background = "linear-gradient(135deg, #222825, #1b7345)";
                } else if (task.priority === "low") {
                    div.style.background = "linear-gradient(135deg, #1d3b1d, #17612f)";
                }
            }
            
            updateLocalStorage();
        }
    };
    
    // Delete button
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#x1F5D1;";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = function() {
        if (confirm("Are you sure you want to delete this task?")) {
            div.remove();
            removeTaskFromLocalStorage(task);
        }
    };
    
    div.appendChild(checkbox);
    div.appendChild(textSpan);
    div.appendChild(document.createElement("br"));
    div.appendChild(categorySpan);
    if (task.dueDate) {
        div.appendChild(dateInfo);
    }
    div.appendChild(editButton);
    div.appendChild(deleteButton);
    
    contentdiv.appendChild(div);
}

// Filter tasks
function addFilterControls() {
    var container = document.querySelector('.container');
    var heading = document.querySelector('.heading');
    
    var filterDiv = document.createElement('div');
    filterDiv.classList.add('filter-controls');
    
    var categorySelect = document.createElement('select');
    categorySelect.id = 'category-filter';
    var defaultOption = document.createElement('option');
    defaultOption.value = 'all';
    defaultOption.textContent = 'All Categories';
    categorySelect.appendChild(defaultOption);
    
    var prioritySelect = document.createElement('select');
    prioritySelect.id = 'priority-filter';
    var defaultPriorityOption = document.createElement('option');
    defaultPriorityOption.value = 'all';
    defaultPriorityOption.textContent = 'All Priorities';
    prioritySelect.appendChild(defaultPriorityOption);
    
    for (let priority of ['High', 'Medium', 'Low']) {
        let option = document.createElement('option');
        option.value = priority.toLowerCase();
        option.textContent = priority;
        prioritySelect.appendChild(option);
    }
    
    var statusSelect = document.createElement('select');
    statusSelect.id = 'status-filter';
    var allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Tasks';
    statusSelect.appendChild(allOption);
    
    var pendingOption = document.createElement('option');
    pendingOption.value = 'pending';
    pendingOption.textContent = 'Pending';
    statusSelect.appendChild(pendingOption);
    
    var completedOption = document.createElement('option');
    completedOption.value = 'completed';
    completedOption.textContent = 'Completed';
    statusSelect.appendChild(completedOption);
    
    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search tasks...';
    searchInput.id = 'search-input';
    
    filterDiv.appendChild(document.createTextNode('Filter: '));
    filterDiv.appendChild(categorySelect);
    filterDiv.appendChild(prioritySelect);
    filterDiv.appendChild(statusSelect);
    filterDiv.appendChild(searchInput);
    
    container.insertBefore(filterDiv, document.getElementById('contentdiv'));
    
    // Event listeners for filters
    categorySelect.addEventListener('change', applyFilters);
    prioritySelect.addEventListener('change', applyFilters);
    statusSelect.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
    
    // Update category list with existing categories
    updateCategoryList();
}

function updateCategoryList() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let categorySelect = document.getElementById('category-filter');
    let currentValue = categorySelect.value;
    
    // Remove all options except the first one
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }
    
    // Get unique categories
    let categories = [...new Set(tasks.map(task => task.category))];
    
    // Add categories to select
    categories.forEach(category => {
        let option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Restore selected value if possible
    if (currentValue !== 'all' && categories.includes(currentValue)) {
        categorySelect.value = currentValue;
    }
}

function applyFilters() {
    let categoryFilter = document.getElementById('category-filter').value;
    let priorityFilter = document.getElementById('priority-filter').value;
    let statusFilter = document.getElementById('status-filter').value;
    let searchText = document.getElementById('search-input').value.toLowerCase();
    
    let tasks = document.querySelectorAll('.notes');
    
    tasks.forEach(task => {
        let shouldShow = true;
        
        // Category filter
        if (categoryFilter !== 'all') {
            let taskCategory = task.querySelector('.category').innerText;
            if (taskCategory !== categoryFilter) {
                shouldShow = false;
            }
        }
        
        // Priority filter (using background color as indicator)
        if (priorityFilter !== 'all') {
            let background = window.getComputedStyle(task).background;
            if (priorityFilter === 'high' && !background.includes('6b1d1d')) {
                shouldShow = false;
            } else if (priorityFilter === 'medium' && !background.includes('222825')) {
                shouldShow = false;
            } else if (priorityFilter === 'low' && !background.includes('1d3b1d')) {
                shouldShow = false;
            }
        }
        
        // Status filter
        if (statusFilter !== 'all') {
            let isCompleted = task.querySelector('.task-checkbox').checked;
            if ((statusFilter === 'completed' && !isCompleted) || 
                (statusFilter === 'pending' && isCompleted)) {
                shouldShow = false;
            }
        }
        
        // Text search
        if (searchText) {
            let taskText = task.innerText.toLowerCase();
            if (!taskText.includes(searchText)) {
                shouldShow = false;
            }
        }
        
        task.style.display = shouldShow ? 'block' : 'none';
    });
}

// Sort tasks
function addSortControls() {
    var filterDiv = document.querySelector('.filter-controls');
    
    var sortLabel = document.createElement('span');
    sortLabel.textContent = ' Sort by: ';
    
    var sortSelect = document.createElement('select');
    sortSelect.id = 'sort-by';
    
    var options = [
        { value: 'createdAt', text: 'Date Created' },
        { value: 'dueDate', text: 'Due Date' },
        { value: 'priority', text: 'Priority' },
        { value: 'category', text: 'Category' }
    ];
    
    options.forEach(opt => {
        let option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        sortSelect.appendChild(option);
    });
    
    filterDiv.appendChild(sortLabel);
    filterDiv.appendChild(sortSelect);
    
    sortSelect.addEventListener('change', sortTasks);
}

function sortTasks() {
    let sortBy = document.getElementById('sort-by').value;
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    // Sort tasks based on selected criteria
    if (sortBy === 'priority') {
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'dueDate') {
        tasks.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    } else if (sortBy === 'category') {
        tasks.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === 'createdAt') {
        tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    // Update localStorage with sorted tasks
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    // Clear and redraw all tasks
    let contentDiv = document.getElementById("contentdiv");
    contentDiv.innerHTML = '';
    tasks.forEach(renderTask);
}

// Store tasks in localStorage
function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCategoryList();
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    // Add created date if not present (for older tasks)
    tasks = tasks.map(task => {
        if (!task.createdAt) {
            task.createdAt = new Date().toISOString();
        }
        if (!task.priority) {
            task.priority = "medium";
        }
        if (!task.completed) {
            task.completed = false;
        }
        return task;
    });
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasks.forEach(renderTask);
}

// Update localStorage after editing
function updateLocalStorage() {
    let allTaskElements = document.querySelectorAll(".notes");
    let tasks = [];
    
    allTaskElements.forEach(taskElement => {
        const textSpan = taskElement.querySelector("span");
        const categorySpan = taskElement.querySelector(".category");
        const dateInfo = taskElement.querySelector(".date-info");
        const checkbox = taskElement.querySelector(".task-checkbox");
        
        let dueDate = "";
        if (dateInfo) {
            dueDate = dateInfo.innerText.replace("Due: ", "");
        }
        
        // Determine priority from background color
        let priority = "medium";
        let background = window.getComputedStyle(taskElement).background;
        if (background.includes("6b1d1d")) {
            priority = "high";
        } else if (background.includes("1d3b1d")) {
            priority = "low";
        }
        
        tasks.push({
            text: textSpan.innerText,
            category: categorySpan.innerText,
            dueDate: dueDate,
            priority: priority,
            completed: checkbox.checked,
            createdAt: new Date().toISOString() // This will reset creation date, ideally should preserve original
        });
    });
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove task from localStorage after deletion
function removeTaskFromLocalStorage(taskToRemove) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => {
        return !(task.text === taskToRemove.text && 
                task.category === taskToRemove.category &&
                task.dueDate === taskToRemove.dueDate);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCategoryList();
}

// Add additional CSS styles
function addStyles() {
    var style = document.createElement('style');
    style.textContent = `
        .filter-controls {
            padding: 10px;
            background-color: #333;
            border-radius: 10px;
            margin: 10px 50px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        }
        
        .filter-controls select, .filter-controls input {
            padding: 5px;
            border-radius: 5px;
            border: none;
            background-color: #eee;
        }
        
        .category {
            font-size: 0.8em;
            font-weight: bold;
            margin-top: 5px;
            color: #ddd;
        }
        
        .date-info {
            font-size: 0.8em;
            color: #ddd;
            font-style: italic;
        }
        
        .task-checkbox {
            margin-right: 10px;
        }
        
        .notes {
            height: auto;
            min-height: 120px;
            width: 250px;
            margin: 10px;
            padding: 15px;
            position: relative;
        }
        
        .edit-btn {
            position: absolute;
            right: 40px;
            bottom: 10px;
        }
        
        .delete-btn {
            position: absolute;
            right: 10px;
            bottom: 10px;
        }
        
        #contentdiv {
            height: auto;
            min-height: 300px;
            max-height: 60vh;
        }
        
        /* Make sure the buttons don't animate in the notes */
        .notes button {
            animation: none;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize app
window.onload = function() {
    loadTasksFromLocalStorage();
    addStyles();
    addFilterControls();
    addSortControls();
};
