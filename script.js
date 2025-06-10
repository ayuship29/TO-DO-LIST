const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clearCompleted");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


//TO add task to list and mark check 
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    
    const label = document.createElement("label");
    label.className = "checkbox-wrapper";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(index);

    const customCheck = document.createElement("span");
    customCheck.className = "custom-check";

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.onclick = () => deleteTask(index);

    label.appendChild(checkbox);
    label.appendChild(customCheck);
    label.appendChild(taskText);

    li.appendChild(label);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}


function addTask(e) {
  e.preventDefault();
  const newTask = taskInput.value.trim();
  if (newTask) {
    tasks.push({ text: newTask, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function applyFilter(filter) {
  currentFilter = filter;
  filters.forEach(f => f.classList.remove("active"));
  document.querySelector(`[data-filter="${filter}"]`).classList.add("active");
  renderTasks();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

// Event Listeners
taskForm.addEventListener("submit", addTask);
clearCompletedBtn.addEventListener("click", clearCompleted);
filters.forEach(f => f.addEventListener("click", () => applyFilter(f.dataset.filter)));
themeToggle.addEventListener("click", toggleTheme);

// Load theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

renderTasks();
