document.addEventListener("DOMContentLoaded", async () => {
    const taskInput = document.getElementById("taskInput");
    const taskTimeInput = document.getElementById("taskTime");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addTask");

    let tasks = await window.electronAPI.loadTasks();
    if (!Array.isArray(tasks)) {
        tasks = [];
    }

    let editingIndex = null; // Índice da tarefa que está sendo editada

    function saveTasks() {
        window.electronAPI.saveTasks(tasks);
    }

    function formatDate(dateTime) {
        if (!dateTime) return "Sem horário";
        const date = new Date(dateTime);
        return date.toLocaleString("pt-BR", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric", 
            hour: "2-digit", 
            minute: "2-digit"
        });
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("task-container");

            const textSpan = document.createElement("span");
            textSpan.classList.add("task-text");
            textSpan.textContent = task.text;

            const timeSpan = document.createElement("span");
            timeSpan.classList.add("task-time");
            timeSpan.textContent = formatDate(task.time);

            const buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("task-buttons");
            buttonsDiv.innerHTML = `
                <button class="edit">✏️</button>
                <button class="move-up">🔼</button>
                <button class="move-down">🔽</button>
                <button class="complete">✅</button>
                <button class="delete">X</button>
            `;

            // Evento para editar tarefa
            buttonsDiv.querySelector(".edit").addEventListener("click", () => editTask(index));

            buttonsDiv.querySelector(".complete").addEventListener("click", () => {
                li.classList.toggle("done");
            });

            buttonsDiv.querySelector(".delete").addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            buttonsDiv.querySelector(".move-up").addEventListener("click", () => {
                if (index > 0) {
                    [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
                    saveTasks();
                    renderTasks();
                }
            });

            buttonsDiv.querySelector(".move-down").addEventListener("click", () => {
                if (index < tasks.length - 1) {
                    [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
                    saveTasks();
                    renderTasks();
                }
            });

            li.appendChild(textSpan);
            li.appendChild(timeSpan);
            li.appendChild(buttonsDiv);
            taskList.appendChild(li);
        });
    }

    function editTask(index) {
        editingIndex = index; // Marca qual tarefa está sendo editada
        const task = tasks[index];

        taskInput.value = task.text;
        taskTimeInput.value = task.time || "";

        addButton.textContent = "Salvar Edição"; // Altera o botão para salvar a edição
        
        // Faz a página rolar automaticamente para os inputs de edição
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskTime = taskTimeInput.value || "";

        if (taskText === "") return;

        if (editingIndex !== null) {
            // Atualizando a tarefa existente
            tasks[editingIndex].text = taskText;
            tasks[editingIndex].time = taskTime;
            editingIndex = null; // Resetando o índice de edição
            addButton.textContent = "Adicionar"; // Voltando o botão ao normal
        } else {
            // Criando uma nova tarefa
            tasks.push({ text: taskText, time: taskTime });
        }

        saveTasks();
        renderTasks();

        taskInput.value = "";
        taskTimeInput.value = "";

        new Notification("Tarefa Salva", {
            body: `Tarefa "${taskText}" foi atualizada!`,
            silent: false
        });
    }

    function checkTaskNotifications() {
        const now = new Date();
        const currentTime = now.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:MM

        tasks.forEach(task => {
            if (task.time === currentTime) {
                new Notification("Lembrete de Tarefa", {
                    body: `Está na hora de: "${task.text}"`,
                    silent: false
                });
            }
        });
    }

    setInterval(checkTaskNotifications, 30000);

    addButton.addEventListener("click", addTask);
    taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });

    taskTimeInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });

    renderTasks();
});
