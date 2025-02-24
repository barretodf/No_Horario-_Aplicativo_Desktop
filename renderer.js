document.addEventListener("DOMContentLoaded", async () => {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addTask");

    let tasks = await window.api.loadTasks(); // Carrega tarefas salvas

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("task-container");
            if (task.done) li.classList.add("done");

            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-buttons">
                    <button class="complete">✅</button>
                    <button class="delete">X</button>
                </div>
            `;

            li.querySelector(".complete").addEventListener("click", () => {
                tasks[index].done = !tasks[index].done;
                window.api.saveTasks(tasks);
                renderTasks();
            });

            li.querySelector(".delete").addEventListener("click", () => {
                tasks.splice(index, 1);
                window.api.saveTasks(tasks);
                renderTasks();
            });

            taskList.appendChild(li);
        });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        tasks.push({ text: taskText, done: false });
        window.api.saveTasks(tasks);
        taskInput.value = "";
        renderTasks();
    }

    addButton.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") addTask();
    });

    renderTasks(); // Exibir tarefas ao iniciar
});
