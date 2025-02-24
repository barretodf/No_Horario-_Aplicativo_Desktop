document.addEventListener("DOMContentLoaded", async () => {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addTask");

    let tasks = await window.electronAPI.loadTasks();

    function saveTasks() {
        window.electronAPI.saveTasks(tasks);
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((taskText, index) => {
            const li = document.createElement("li");
            li.classList.add("task-container");

            li.innerHTML = `
                <span class="task-text">${taskText}</span>
                <div class="task-buttons">
                    <button class="complete">✅</button>
                    <button class="delete">X</button>
                </div>
            `;

            li.querySelector(".complete").addEventListener("click", () => {
                li.classList.toggle("done");
            });

            li.querySelector(".delete").addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        tasks.push(taskText);
        saveTasks();
        renderTasks();
        taskInput.value = "";
    }

    addButton.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });

    renderTasks();
});
