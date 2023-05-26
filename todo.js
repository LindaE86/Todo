
let arrayLength = 0;
const baseURL = "https://dummyjson.com/todos/";

//Lägger till funktioneltet för att kalla på funktionen addToDo() när man klickar på knappen.
document.getElementById("skicka").addEventListener("click", (event) => {
  addToDo();
});


const fetchData = async (method, todo, completed, userId, endpoint) => {
  const result = await fetch(`${baseURL}${endpoint}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: todo,
      completed: completed,
      userId: userId,
    }),
  });
  const data = await result.json();
  return data;
};


const updateCompleted = async (method, completed, userId, endpoint) => {
  const result = await fetch(`${baseURL}${endpoint}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      completed: completed,
      userId: userId,
    }),
  });
  const data = await result.json();
  return data;
};

const loadAllTodos = async (method, endpoint) => {
  const result = await fetch(`${baseURL}${endpoint}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
  });
  const data = await result.json();
  return data;
};

//Vi skickar en request till att lägga till en todo genom en post request.
const addToDo = async () => {
  const data = await fetchData(
    "POST",
    document.getElementById("todoInput").value,
    false,
    1,
    "add"
  );
  addTodoToDOM(data, true);
};
//Alltså läggs den på som en child, och så vi bygger upp strukturen
const addTodoToDOM = (data, isNew) => {
  const tBody = document.getElementById("tbody");
  const tr = document.createElement("tr");
  const thId = document.createElement("th");
  thId.innerText = isNew ? (arrayLength = arrayLength + 1) : data.id;
  tr.appendChild(thId);
  const thDescp = document.createElement("td");
  thDescp.innerText = data.todo;
  tr.appendChild(thDescp);
  const thStatus = document.createElement("td");
  tr.appendChild(thStatus);
  thStatus.innerText = data.completed ? "Avklarad" : "Ej avklarad";
  
  //shorthand för if else, kallas terenary operator.
  const thCheckbox = document.createElement("td");
  const inputCheckbox = document.createElement("input");
  inputCheckbox.setAttribute("type", "checkbox");
 
  //lägger på attribut för att det ska bli en checkbox.
  //alltså <input type="checkbox">
  thCheckbox.appendChild(inputCheckbox);
  checkboxTextNode = document.createTextNode("Klarmarkera");
 
  //Textbox som läggs till
  thCheckbox.appendChild(checkboxTextNode);
  inputCheckbox.addEventListener("change", (e) =>
    inputChange(e, thStatus, data.id)
  );
  tr.appendChild(thCheckbox);
  const thDelete = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("type", "button");
  deleteButton.className = "button";
  thDelete.appendChild(deleteButton);
  tr.appendChild(thDelete);
  deleteButton.innerText = "Ta bort";
  deleteButton.addEventListener("click", (e) => removeFromList(e, tr, data.id));
  tBody.appendChild(tr);
  document.getElementById("todoInput").value = "";
};

const inputChange = async (e, thStatus, id) => {
  //Vi kollar om boxen är checkad, för att kunna avgöra som vi ska
  
  const data = await updateCompleted("PUT", e.target.checked, 1, `${id - 1}`);
  //med resultat vi får tillbaka kan vi sedan kolla om data.checked är avklarat.

  thStatus.innerText = data.completed ? "Avklarad" : "Ej avklarad";
};

//request för att göra en delete.
const removeFromList = async (e, li, id) => {
  const data = await fetchData("DELETE", null, null, 1, `/${id - 1}`);
  li.remove();
};

const loadAllTodosToPage = async () => {
  const data = await loadAllTodos("GET", "");
  arrayLength = data.todos.length;
  data.todos.forEach((todo) => {
    addTodoToDOM(todo, false);
  });
};

loadAllTodosToPage();
