console.log("Renderer.js carregado com sucesso!");

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addTask");

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const li = document.createElement("li");
        li.classList.add("task-container");

        // Criando a estrutura correta sem duplicação
        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <div class="task-buttons">
                <button class="complete">✅</button>
                <button class="delete">X</button>
            </div>
        `;

        // Evento para marcar como concluída
        li.querySelector(".complete").addEventListener("click", () => {
            li.classList.toggle("done");
        });

        // Evento para remover a tarefa
        li.querySelector(".delete").addEventListener("click", () => {
            li.remove();
        });

        taskList.appendChild(li);
        taskInput.value = "";
    }

    addButton.addEventListener("click", addTask);

    // Permitir adicionar tarefas pressionando Enter
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });
});
