//========================DOM SELECTORS & VARIABLES===================================
//BTN selector
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");
//Form selector
const todo = document.getElementById("todo");
const form = document.querySelector(".todo-form");
const alert = document.querySelector(".alert");
//List selector
const container = document.querySelector(".todo-container");
const list = document.querySelector(".todo-list");
//Edit option
let editElement;
let editFlag = false;
let editID = "";

//========================EVENT LISTENERS =================================
//Submit form
form.addEventListener("submit", addItem);
//Clear list
clearBtn.addEventListener("click", clearItems);
//setup items
window.addEventListener("DOMContentLoaded", setupItems);

//========================FUNCTIONS =================================
//add Item
function addItem(e) {
  e.preventDefault();
  const value = todo.value;
  const id = new Date().getTime().toString();
  //WENN EINGABE
  if (value && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("todo-item");
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
    //add event listeners to both buttons (hier unten weil dynamisch erstellt)
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    //append Child
    list.appendChild(element);
    //display alert
    displayAlert("Eine Aufgabe wurde hinzugefügt", "success");
    //show container
    container.classList.add("show-container");
    //set local storage
    addToLocalStorage(id, value);
    //set back to default
    setBackToDefault();
    //WENN EDITIEREN
  } else if (value && editFlag) {
    //console.log("Editing...");
    editElement.innerHTML = value;
    displayAlert("Todo wurde geändert", "success");
    //edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
    //WENN FELD LEER
  } else {
    displayAlert("Bitte gebe etwas ein", "danger");
  }
}
//display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
//clear items
function clearItems() {
  //console.log("dummy alles löschen");
  const items = document.querySelectorAll(".todo-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("Liste wurde geleert", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

//delete items
function deleteItem(e) {
  //console.log("dummy löschen");
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("todo entfernt", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
}
//edit items
function editItem(e) {
  //console.log("dummy edit");
  const element = e.currentTarget.parentElement.parentElement;
  //set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //set form value
  todo.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.innerHTML = '<i class="fas fa-edit"></i>';
}

//Set back to defaults
function setBackToDefault() {
  todo.value = "";
  editFlag = false;
  editID = "";
  submitBtn.innerHTML = '<i class="fas fa-plus"></i>';
}
//===================LOCAL STORAGE==================
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
function addToLocalStorage(id, value) {
  //console.log("dummy speichern");
  const todo = { id, value };
  let items = getLocalStorage();
  items.push(todo);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  //console.log("dummy entfernen");
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  //console.log("dummy ändern");
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

//================SETUP ITEMS====================
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}
function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("todo-item");
  element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  //add event listeners to both buttons (hier unten weil dynamisch erstellt)
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  //append Child
  list.appendChild(element);
}
