(function() {

  'use strict';

  var todoList = document.getElementById('js-todo__list');

  // Get Todo from localStorage
  function get() {
    return undefined !== localStorage.todos ? JSON.parse(localStorage.todos) : [];
  }

  /**
   * Render the todo list
   * @param {array} todos
   */
  function render(todos) {

    var fragment = document.createDocumentFragment();

    todos.forEach(function(todo) {
      var li = createTodoListItemHTML(todo);
      fragment.append(li);
    });

    todoList.appendChild(fragment);
  }

  /**
   * Add a todo to the localStorage
   * @param {object} todo
   */
  function add(todo) {
    var todos = get();
    todos.push(todo);
    save(todos);
  }

  /**
   * Create a todo list item HTML
   * @param {object} todo
   * @return {Element} li
   */
  function createTodoListItemHTML(todo) {
    var li = document.createElement('li');
    li.id = todo.id;
    li.className = todo.completed ? 'todo__list-item completed' : 'todo__list-item';

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__list-item-check';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('click', complete);

    var label = document.createElement('label');
    label.className = 'todo__list-item-label';
    label.textContent = todo.value;
    label.addEventListener('click', edit);

    var button = document.createElement('button');
    button.className = 'todo__list-item-delete';
    button.addEventListener('click', remove);

    li.append(checkbox);
    li.append(label);
    li.append(button);

    return li;
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

  function handleKeyDown(e) {
    var value = this.value.trim();

    if (13 === e.keyCode && value.length) { // Enter

      var todo = {
        id: new Date().getTime(),
        value: value,
        completed: false
      };

      // Add to the localStorage
      add(todo);

      // Add to the DOM
      var li = createTodoListItemHTML(todo);
      todoList.appendChild(li);

      // Empty the input value
      this.value = '';
    }
  }

  window.addEventListener('DOMContentLoaded', function() {
    var todos = get();
    render(todos);
  });

  document.getElementById('js-todo__add').addEventListener('keydown', handleKeyDown);

})();
