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
                    <button class="move-up">🔼</button>
                    <button class="move-down">🔽</button>
                    <button class="edit">✏️</button>
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

            li.querySelector(".edit").addEventListener("click", () => {
                const span = li.querySelector(".task-text");
                const input = document.createElement("input");
                input.type = "text";
                input.value = taskText;
                input.classList.add("edit-input");

                span.replaceWith(input);
                input.focus();

                input.addEventListener("blur", () => {
                    const newText = input.value.trim();
                    if (newText) {
                        tasks[index] = newText;
                        saveTasks();
                        renderTasks();
                    } else {
                        renderTasks();
                    }
                });

                input.addEventListener("keypress", (event) => {
                    if (event.key === "Enter") {
                        input.blur();
                    }
                });
            });

            // Função para mover para cima
            li.querySelector(".move-up").addEventListener("click", () => {
                if (index > 0) {
                    [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
                    saveTasks();
                    renderTasks();
                }
            });

            // Função para mover para baixo
            li.querySelector(".move-down").addEventListener("click", () => {
                if (index < tasks.length - 1) {
                    [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
                    saveTasks();
                    renderTasks();
                }
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
