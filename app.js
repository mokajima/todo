var todoList = document.getElementById('js-todo__list');
var todoListItemLast = document.getElementById('js-todo__add').parentNode;

// Get Todo from localStorage
function get() {
  return undefined !== localStorage.todos ? JSON.parse(localStorage.todos) : [];
}

// Render Todo
function render() {

  var todos = get();
  var fragment = document.createDocumentFragment();

  todos.forEach(function(value) {

    var li = document.createElement('li');
    li.id = value.id;
    li.className = value.completed ? 'todo__list-item completed' : 'todo__list-item';

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__list-item-check';
    checkbox.checked = value.completed;
    checkbox.addEventListener('click', complete);

    var label = document.createElement('label');
    label.className = 'todo__list-item-label';
    label.textContent = value.value;
    label.addEventListener('click', edit);

    var button = document.createElement('button');
    button.className = 'todo__list-item-delete';
    button.addEventListener('click', remove);

    li.append(checkbox);
    li.append(label);
    li.append(button);
    fragment.append(li);

  });

  todoList.insertBefore(fragment, todoListItemLast);
}

// Add new Todo item
function add(value) {

  var todos = get();
  var id = new Date().getTime();

  var li = document.createElement('li');
  li.id = id;
  li.className = 'todo__list-item';

  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo__list-item-check';
  checkbox.addEventListener('click', complete);

  var label = document.createElement('label');
  label.className = 'todo__list-item-label';
  label.textContent = value;

  var button = document.createElement('button');
  button.className = 'todo__list-item-delete';
  button.addEventListener('click', remove);

  li.append(checkbox);
  li.append(label);
  li.append(button);

  todoList.insertBefore(li, todoListItemLast);

  todos.push({id: id, value: value, completed: false});
  save(todos);
}

// Save Todo in localStorage
function save(todos) {
  localStorage.todos = JSON.stringify(todos);
}

// Complete a Todo item
function complete() {

  var parent = this.parentNode;
  var id = parseInt(parent.id);
  var todos = get();

  parent.classList.toggle('completed');

  for (var i = 0, len = todos.length; i < len; i++) {
    if (id === todos[i].id) {
      todos[i].completed = parent.classList.contains('completed');
      break;
    }
  }
  save(todos);
}

// Remove a Todo item
function remove() {

  var parent = this.parentNode;
  var id = parseInt(parent.id);
  var todos = get();

  parent.remove();

  for (var i = 0, len = todos.length; i < len; i++) {
    if (id === todos[i].id) {
      todos.splice(i, 1);
      break;
    }
  }
  save(todos);
}

// Edit a Todo item
function edit() {

  var parent = this.parentNode;
  var value = this.textContent;
  this.style.display = 'none';

  var input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo__list-item-input';
  input.value = value;
  input.addEventListener('blur', afterEdit);

  parent.append(input);
  input.focus();
}

// Replace input with label after editing a Todo item
function afterEdit() {

  var parent = this.parentNode;
  var id = parseInt(parent.id);
  var label = parent.querySelector('.todo__list-item-label');
  var value = this.value;
  var todos = get();

  this.remove();

  label.style.display = 'inline-block';
  label.textContent = value;

  for (var i = 0, len = todos.length; i < len; i++) {
    if (id === todos[i].id) {
      todos[i].value = value;
      break;
    }
  }
  save(todos);
}

window.addEventListener('DOMContentLoaded', render);

document.getElementById('js-todo__add').addEventListener('keydown', function(e) {

  var value = this.value.trim();

  if (13 === e.keyCode && value.length) {
    add(value);
    this.value = ''; 
  }
});
