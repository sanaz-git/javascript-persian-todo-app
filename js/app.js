const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todos");

// const todos = [];
let todos = JSON.parse(localStorage.getItem("todos")) || [];
console.log(todos);

const e2p = (s) => s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const generatedId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  (alert.innerText = message), alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  // const todoList = data ? data : todos;
  const todoList = data || todos;
  todosBody.innerHTML = "";
  if (todoList.length === 0) {
    todosBody.innerHTML = "<tr><td colspan='4'>هیچ عنوانی یافت نشد</td></tr>";
    return;
  }
  todoList.forEach((todo) => {
    todosBody.innerHTML += `
    <tr>
    <td>${todo.task}</td>
    <td>${e2p(todo.date) || "بدون تاریخ"}</td>
    <td>${todo.completed ? "تکمیل شده" : "در حال انجام"}</td>
    <td>
    <button onclick="editHandler('${todo.id}')">ویرایش</button>
    <button onclick="toggleHandler('${todo.id}')">${
      todo.completed ? "قبل" : "بعد"
    }</button>
    <button onclick="deleteHandler('${todo.id}')">حذف</button>
    </td>
    </tr>
    `;
  });
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generatedId(),
    task,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();

    taskInput.value = "";
    dateInput.value = "";
    console.log(todos);
    showAlert("Tتودو با موفقیت اضافه شد", "success");
  } else {
    showAlert("لطفا تودو را کامل وارد کنید", "error");
  }
  displayTodos();
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("همه تودو ها حذف گردید", "success");
  } else {
    showAlert("هیچ تودویی برای حذف کردن وجود ندارد", "error");
  }
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  console.log(newTodos);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("حذف شد", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  console.log(todo);
  saveToLocalStorage();
  displayTodos();
  showAlert("وضعیت تودو تغییر کرد", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveToLocalStorage();
  displayTodos();
  showAlert("تودو با موفقیت ویرایش شد", "success");
};

const filterHandler = (event) => {
  let filteredTodos = null;
  console.log(event);
  const filter = event.target.dataset.filter;
  console.log(filter);
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;

    default:
      filteredTodos = todos;
      break;
  }

  console.log(filteredTodos);
  displayTodos(filteredTodos);
};

// window.addEventListener("load", displayTodos);
window.addEventListener("load", () => displayTodos()); //if we don't want get event after filter
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
