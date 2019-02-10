// @format
(function() {
  'use strict';

  const todoList = document.getElementById('js-todo__list');

  /**
   * Get todos from the localStorage
   */
  function getTodos() {
    return undefined !== localStorage.todos
      ? JSON.parse(localStorage.todos)
      : [];
  }

  /**
   * Save todos in the localStorage
   * @param {object} todos
   */
  function saveTodos(todos) {
    localStorage.todos = JSON.stringify(todos);
  }

  /**
   * Add a todo to the localStorage
   * @param {object} todo
   */
  function addTodo(todo) {
    const todos = getTodos();
    todos.push(todo);
    saveTodos(todos);
  }

  /**
   * Update a todo in the localStorage
   * @param {number} id - The ID of the todo
   * @param {object} data - The data of the todo to update
   */
  function updateTodo(id, data) {
    const todos = getTodos();
    const index = todos.findIndex(todo => id === todo.id);

    for (let prop in data) {
      todos[index][prop] = data[prop];
    }

    // Save todos to the localStorage
    saveTodos(todos);
  }

  /**
   * Remove a todo in the localStorage
   * @param {string} id - The ID of the todo
   */
  function removeTodo(id) {
    const todos = getTodos();
    const index = todos.findIndex(todo => id === todo.id);
    todos.splice(index, 1);
    saveTodos(todos);
  }

  /**
   * Render todos
   * @param {array} todos
   */
  function render(todos) {
    const fragment = document.createDocumentFragment();

    todos.forEach(todo => {
      const li = createTodoHTML(todo);
      fragment.appendChild(li);
    });

    todoList.appendChild(fragment);
  }

  /**
   * Create a todo HTML
   * @param {object} todo
   * @return {Element} li
   */
  function createTodoHTML(todo) {
    const li = document.createElement('li');
    li.id = todo.id;
    li.className = todo.completed
      ? 'todo__list-item completed'
      : 'todo__list-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__list-item-check';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('click', toggleComplete);

    const label = document.createElement('label');
    label.className = 'todo__list-item-label';
    label.textContent = todo.value;
    label.addEventListener('click', edit);

    const button = document.createElement('button');
    button.className = 'todo__list-item-delete';
    button.addEventListener('click', remove);

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(button);

    return li;
  }

  /**
   * Change a todo's status of completed
   * @param {object} e - The event object
   */
  function toggleComplete(e) {
    const li = e.target.parentNode;
    const id = parseInt(li.id, 10);

    li.classList.toggle('completed');

    // Update the todo in the localStorage
    updateTodo(id, {completed: li.classList.contains('completed')});
  }

  /**
   * Remove a todo
   * @param {object} e - The event object
   */
  function remove(e) {
    const li = e.target.parentNode;
    const id = parseInt(li.id, 10);

    // Remove the todo in the DOM
    li.remove();

    // Remove the todo in the localStorage
    removeTodo(id);
  }

  /**
   * Edit a todo
   * @param {e} - The event object
   */
  function edit(e) {
    const li = e.target.parentNode;
    const value = this.textContent;
    this.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo__list-item-input';
    input.value = value;
    input.addEventListener('blur', afterEdit);

    li.appendChild(input);
    input.focus();
  }

  /**
   * Replace input with label after editing a todo
   * @param {object} e - The event object
   */
  function afterEdit(e) {
    const li = e.target.parentNode;
    const id = parseInt(li.id, 10);
    const label = li.querySelector('.todo__list-item-label');
    const value = this.value;

    if (0 === value.length) {
      // Remove the todo
      li.remove();
      removeTodo(id);
    } else {
      // Update the todo
      this.remove();
      label.style.display = 'inline-block';
      label.textContent = value;

      // Update the todo in the localStorage
      updateTodo(id, {value: value});
    }
  }

  function init() {
    const todos = getTodos();
    render(todos);
  }

  /**
   * Handle keydown
   * @param {object} e
   */
  function handleKeyDown(e) {
    const value = this.value.trim();

    if (13 === e.keyCode && value.length) {
      const todo = {
        id: new Date().getTime(),
        value: value,
        completed: false,
      };

      // Add to the localStorage
      addTodo(todo);

      // Add to the DOM
      const li = createTodoHTML(todo);
      todoList.appendChild(li);

      // Empty the input value
      this.value = '';
    }
  }

  // Add event listeners
  window.addEventListener('DOMContentLoaded', init);
  document
    .getElementById('js-todo__add')
    .addEventListener('keydown', handleKeyDown);
})();
