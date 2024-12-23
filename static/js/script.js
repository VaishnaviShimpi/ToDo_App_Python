let currentTaskId = null;

async function fetchTasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();

    const taskContainer = document.getElementById("taskContainer");
    taskContainer.innerHTML = "";

    tasks.forEach((task) => {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="actions">
                <button class="primary-btn" onclick="toggleComplete('${task.id}', ${task.completed})">
                    ${task.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button class="secondary-btn" onclick="openEditModal('${task.id}', '${task.title}', '${task.description}')">
                    Edit
                </button>
                <button class="danger-btn" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        taskContainer.appendChild(taskCard);
    });
}

async function addTask() {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;

    if (!title) {
        alert("Task title is required!");
        return;
    }

    await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
    });

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    fetchTasks();
}

async function updateTask() {
    const title = document.getElementById("editTaskTitle").value;
    const description = document.getElementById("editTaskDescription").value;

    if (!title) {
        alert("Task title is required!");
        return;
    }

    await fetch(`/tasks/${currentTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
    });

    closeModal();
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
}

async function deleteAllTasks() {
    const confirmDelete = confirm("Are you sure you want to delete all tasks?");
    if (!confirmDelete) return;

    await fetch("/tasks", { method: "DELETE" });
    fetchTasks();
}

async function toggleComplete(id, completed) {
    await fetch(`/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
    });
    fetchTasks();
}

function openEditModal(taskId, title, description) {
    currentTaskId = taskId;
    document.getElementById("editTaskTitle").value = title;
    document.getElementById("editTaskDescription").value = description;
    document.getElementById("editModal").style.display = "block";
}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
    currentTaskId = null;
}

fetchTasks();
