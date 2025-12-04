// toggle task completion status
function toggleTaskStatus(taskId) {
  console.log(`Toggling status for task with ID: ${taskId}`);
  fetch(`/api/v1/tasks/${taskId}`, { method: 'PATCH' })
    .then(response => {
      if (response.ok) {
        const taskElement = document.getElementById(`task-${taskId}`);
        taskElement.classList.toggle('completed');
      }
    });
}

// add item to todo list
function addTaskToList(task) {
  const taskList = document.getElementById('task-list');
  const li = document.createElement('li');
  li.textContent = task.title;
  li.classList.add(task.priority); // Add priority class for styling
  li.innerHTML += ` <a href="#" id="task-${task.id}" class="remove-btn" onclick="removeTask(${task.id})">🗑️</a>`;
  taskList.appendChild(li);
}

// submit new task to API
const taskForm = document.getElementById('task-form');
taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskInput = document.getElementById('new-task');
  const priorityInput = document.getElementById('priority');
  const taskTitle = taskInput.value.trim();
  const priority = priorityInput.value;

  if (taskTitle) {
    fetch('/api/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: taskTitle, priority })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Task added:', data);
        taskInput.value = '';
        priorityInput.value = 'low';
        addTaskToList(data.task);
      });
  }
});

// Fetch and display tasks
function loadTasks() {
  fetch('/api/v1/tasks')
    .then(response => response.json())
    .then(data => {
      data.tasks.forEach(task => {
        addTaskToList(task);
      });
    });
}

// remove task function
function removeTask(taskId) {
  console.log(`Removing task with ID: ${taskId}`);
  fetch(`/remove/${taskId}`, { method: 'GET' })
    .then(response => {
      if (response.ok) {
        document.getElementById(`task-${taskId}`).closest('li').remove();
      }
    });
}


// main function calls
loadTasks();