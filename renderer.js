document.addEventListener("DOMContentLoaded", async () => {
    const taskInput = document.getElementById("taskInput");
    const taskTimeInput = document.getElementById("taskTime");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addTask");

    let tasks = await window.electronAPI.loadTasks();
    tasks = Array.isArray(tasks) ? tasks : [];
    let editingIndex = null;

    function saveTasks() {
        window.electronAPI.saveTasks(tasks);
    }

    function formatDate(dateTime) {
        if (!dateTime) return "Sem horário";
        return new Date(dateTime).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    }

    function renderTasks() {
        taskList.innerHTML = tasks.map((task, index) => `
            <li class="task-container" data-index="${index}">
                <span class="task-text">${task.text}</span>
                <span class="task-time">${formatDate(task.time)}</span>
                <div class="task-buttons">
                    <button class="edit">✏️</button>
                    <button class="move-up">🔼</button>
                    <button class="move-down">🔽</button>
                    <button class="complete">✅</button>
                    <button class="delete">X</button>
                </div>
            </li>
        `).join("");
    }

    function handleTaskAction(event) {
        const button = event.target;
        const taskElement = button.closest("li");
        if (!taskElement) return;
        
        const index = Number(taskElement.dataset.index);
        if (button.classList.contains("edit")) editTask(index);
        if (button.classList.contains("delete")) deleteTask(index);
        if (button.classList.contains("complete")) taskElement.classList.toggle("done");
        if (button.classList.contains("move-up")) moveTask(index, -1);
        if (button.classList.contains("move-down")) moveTask(index, 1);
    }

    function editTask(index) {
        editingIndex = index;
        const task = tasks[index];
        taskInput.value = task.text;
        taskTimeInput.value = task.time || "";
        addButton.textContent = "Salvar Edição";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function moveTask(index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < tasks.length) {
            [tasks[index], tasks[newIndex]] = [tasks[newIndex], tasks[index]];
            saveTasks();
            renderTasks();
        }
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const taskTime = taskTimeInput.value || "";
        if (editingIndex !== null) {
            tasks[editingIndex] = { text: taskText, time: taskTime };
            editingIndex = null;
            addButton.textContent = "Adicionar";
        } else {
            tasks.push({ text: taskText, time: taskTime });
        }

        saveTasks();
        renderTasks();
        taskInput.value = "";
        taskTimeInput.value = "";
        new Notification("Tarefa Salva", { body: `Tarefa "${taskText}" foi atualizada!` });
    }

    function checkTaskNotifications() {
        const currentTime = new Date().toISOString().slice(0, 16);
        tasks.forEach(task => {
            if (task.time === currentTime) {
                new Notification("Lembrete de Tarefa", { body: `Está na hora de: "${task.text}"` });
            }
        });
    }

    setInterval(checkTaskNotifications, 30000);
    addButton.addEventListener("click", addTask);
    taskList.addEventListener("click", handleTaskAction);
    [taskInput, taskTimeInput].forEach(input => input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTask();
        }
    }));

    renderTasks();
});
