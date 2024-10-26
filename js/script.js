let tasks = [];

// Get the current month from the document title
const month = document.title.split(" - ")[1];

// Load tasks from local storage on page load
const loadTasks = () => {
    const storedTasks = localStorage.getItem(`tasks_${month}`);
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
    renderTasks();
    updateUnfinishedTaskCount(); // Update the unfinished task count
};

// Save tasks to local storage
const saveTasks = () => {
    localStorage.setItem(`tasks_${month}`, JSON.stringify(tasks));
};

// Function to add a task
const addTask = (taskText) => {
    tasks.push({ text: taskText, completed: false });
    saveTasks();
    renderTasks();
    updateUnfinishedTaskCount(); // Update the unfinished task count
};

// Function to render tasks
const renderTasks = () => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear the list before re-rendering

    tasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");

        // Left side container for checkbox and text
        const taskLeft = document.createElement("div");
        taskLeft.classList.add("task-left");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            toggleTaskCompletion(index);
            updateUnfinishedTaskCount(); // Update the unfinished task count
        });
        taskLeft.appendChild(checkbox);

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        if (task.completed) taskText.style.textDecoration = "line-through";
        taskLeft.appendChild(taskText);

        taskItem.appendChild(taskLeft);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-task");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener("click", () => {
            deleteTask(index);
            updateUnfinishedTaskCount(); // Update the unfinished task count
        });
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    });
    updateProgress();
};

// Function to delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

// Function to toggle task completion
const toggleTaskCompletion = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
};

// Update progress bar and numbers
const updateProgress = () => {
    const progressElement = document.getElementById("progress");
    const numbersElement = document.getElementById("numbers");

    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercent = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    progressElement.style.width = `${progressPercent}%`;
    numbersElement.textContent = `${completedTasks} / ${totalTasks}`;
};

// Update unfinished task count in local storage
const updateUnfinishedTaskCount = () => {
    const unfinishedTasks = tasks.filter(task => !task.completed).length;
    localStorage.setItem(`unfinishedTasks_${month}`, unfinishedTasks);
};

// Event listener for form submission
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        addTask(taskText);
        taskInput.value = ""; // Clear input field
    }
});

// Load tasks on initial page load
loadTasks();
