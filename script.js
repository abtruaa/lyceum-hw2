const task = document.querySelector(".task-text");
const taskElement = document.querySelector('input[name="task"]');
const buttonElement = document.querySelector("#addTask");

const values = { task: "" };
//счетчик задач и вывод
function updateTasksCounter() {
  const allCheckboxes = checkboxList.querySelectorAll('input[type="checkbox"]');
  let counter = 0;

  allCheckboxes.forEach((checkbox) => {
    if (!checkbox.checked) {
      // Если чекбокс НЕ отмечен
      counter++;
    }
  });

  if (lastParagraph) {
    lastParagraph.textContent = `Осталось задач: ${counter}`;
  }
}

//функции для спиннера при изменении состояния чекбокса
function replaceCheckbox(checkbox) {
  checkbox.insertAdjacentHTML("beforebegin", '<div class="loader"></div>');
  checkbox.style.opacity = 0;
  checkbox.style.pointerEvents = "none";
}
function restoreCheckbox(taskLabel) {
  const loader = taskLabel.querySelector(".loader");
  const checkbox = taskLabel.querySelector('input[type="checkbox"]');

  if (loader && checkbox) {
    loader.remove();
    checkbox.style.opacity = 1;
    checkbox.style.pointerEvents = "auto";
  }
}

//стилизация текста и блокировка мусорки при выполненной задаче
function stylingSingleCheckbox(e) {
  const checkbox = e.target;
  const taskLabel = checkbox.closest(".search-checkbox");
  const buttonDelete = taskLabel.querySelector(".delete");
  const taskText = taskLabel.querySelector(".task-text");

  checkbox.setAttribute("disabled", true);
  if (buttonDelete) {
    buttonDelete.setAttribute("disabled", true);
    buttonDelete.style.opacity = 0.5;
  }
  replaceCheckbox(checkbox);

  setTimeout(() => {
    if (checkbox.checked) {
      taskLabel.classList.add("checked-task");
      if (taskText) {
        taskText.style.textDecoration = "line-through";
      }
      if (buttonDelete) {
        buttonDelete.style.opacity = 0.5;
      }
    } else {
      taskLabel.classList.remove("checked-task");
      if (taskText) {
        taskText.style.textDecoration = "none";
      }
    }
    if (buttonDelete) {
      buttonDelete.removeAttribute("disabled");
      buttonDelete.style.opacity = 1;
    }

    restoreCheckbox(taskLabel);
    checkbox.removeAttribute("disabled");
    const checkedRadio = document.querySelector('input[name="mark"]:checked');
    if (checkedRadio) {
      filterTasks(checkedRadio.value);
    }
  }, getRandomArbitrary(2, 5) * 1000);
  updateTasksCounter();
}
//фильтрация задач по радиокнопкам
function filterTasks(filterValue) {
  const allTasks = checkboxList.querySelectorAll(".search-checkbox");

  allTasks.forEach((task) => {
    const checkbox = task.querySelector('input[type="checkbox"]');

    switch (filterValue) {
      case "all":
        task.style.display = "flex";
        break;
      case "marked":
        if (checkbox.checked) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;
      case "unmarked":
        if (!checkbox.checked) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;
      default:
        task.style.display = "flex";
        break;
    }
  });
}

const radioButtons = document.querySelectorAll('input[name="mark"]');

radioButtons.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    filterTasks(e.target.value);
  });
});

//блокировка кнопки если пустой ввод
const onChange = (e) => {
  values.task = e.target.value.trim();
  if (values.task !== "") {
    buttonElement.removeAttribute("disabled");
  } else {
    buttonElement.setAttribute("disabled", true);
  }
};

taskElement.addEventListener("input", onChange);

//функция для случайных чисел
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
//добавление задач
const checkboxList = document.querySelector(".checkbox-list");
const lastParagraph = document.querySelector("#remaining-tasks");

const onAdd = (e) => {
  const taskValue = values.task;
  if (!taskValue) {
    buttonElement.setAttribute("disabled", true);
    return;
  }

  const newTask = document.createElement("label");
  newTask.classList.add("search-checkbox", "task-enter");

  const taskContentDiv = document.createElement("div");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", stylingSingleCheckbox);

  const newSpan = document.createElement("span");
  newSpan.classList.add("task-text");
  newSpan.textContent = taskValue;

  taskContentDiv.append(checkbox);
  taskContentDiv.append(newSpan);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.type = "button";
  deleteButton.addEventListener("click", handleDeleteTask)

  const image = document.createElement("img");
  image.src = "red-trashcan.png";
  deleteButton.appendChild(image);

  newTask.append(taskContentDiv);
  newTask.append(deleteButton);

  const originalHTML = buttonElement.innerHTML;
  buttonElement.innerHTML = '<div class="loader"></div>';
  setTimeout(() => {
    checkboxList.append(newTask);

    setTimeout(() => {
      newTask.classList.add("task-enter-active");
    }, 10);

    taskElement.value = "";
    values.task = "";
    buttonElement.innerHTML = originalHTML;
    taskElement.removeAttribute("disabled");
  }, getRandomArbitrary(2, 5) * 1000);
  updateTasksCounter();
  buttonElement.setAttribute("disabled", true);
  taskElement.setAttribute("disabled", true);
};
buttonElement.addEventListener("click", onAdd);

checkboxList.addEventListener("change", (e) => {
  // Проверяем, было ли изменено состояние чекбокса
  if (e.target.type === "checkbox") {
    updateTasksCounter();
    const checkedRadio = document.querySelector('input[name="mark"]:checked');
    if (checkedRadio) {
      filterTasks(checkedRadio.value);
    }
  }
});

checkboxList.addEventListener("click", (e) => {
  if (e.target.closest(".delete")) {
    e.preventDefault();
    e.stopPropagation();
    handleDeleteTask(e);
  }
});

function handleDeleteTask(e) {
  const deleteButton = e.target.closest(".delete");
  const taskLabel = deleteButton.closest(".search-checkbox");
  const checkbox = taskLabel.querySelector('input[type="checkbox"]');
  checkbox.setAttribute("disabled", true);

  const originalHTML = deleteButton.innerHTML;
  deleteButton.innerHTML = '<div class="loader"></div>';
  deleteButton.style.pointerEvents = "none";
  setTimeout(() => {
    taskLabel.classList.add("task-exit-active");
    taskLabel.addEventListener('transitionend', function onTransitionEnd() {
    taskLabel.remove();
    const checkedRadio = document.querySelector('input[name="mark"]:checked');
    if (checkedRadio) {
      filterTasks(checkedRadio.value);
    }
  });
  }, getRandomArbitrary(2, 5) * 1000);
}
