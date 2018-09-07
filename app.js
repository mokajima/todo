(function() {

  'use strict';

  const todoList = document.getElementById('js-todo__list');

  /**
   * Get todos from the localStorage
   */
  function get() {
    return undefined !== localStorage.todos ? JSON.parse(localStorage.todos) : [];
  }

  /**
   * Add a todo to the localStorage
   * @param {object} todo
   */
  function add(todo) {
    const todos = get();
    todos.push(todo);
    save(todos);
  }

  /**
   * Save todos
   * @param {object} todos
   */
  function save(todos) {
    localStorage.todos = JSON.stringify(todos);
  }

  /**
   * Render todos
   * @param {array} todos
   */
  function render(todos) {
    const fragment = document.createDocumentFragment();

    todos.forEach((todo) => {
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
    li.className = todo.completed ? 'todo__list-item completed' : 'todo__list-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__list-item-check';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('click', complete);

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
   * Complete a todo
   */
  function complete() {
    const li = this.parentNode;
    const id = parseInt(li.id, 10);
    const todos = get();

    li.classList.toggle('completed');

    const index = todos.findIndex((todo) => id === todo.id);
    todos[index].completed = li.classList.contains('completed');
    save(todos);
  }

  /**
   * Remove a todo
   */
  function remove() {
    const li = this.parentNode;
    const id = parseInt(li.id, 10);
    const todos = get();

    li.remove();

    const index = todos.findIndex((todo) => id === todo.id);
    todos.splice(index, 1);
    save(todos);
  }

  /**
   * Edit a todo
   */
  function edit() {
    const li = this.parentNode;
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
   */
  function afterEdit() {
    const li = this.parentNode;
    const id = parseInt(li.id, 10);
    const label = li.querySelector('.todo__list-item-label');
    const value = this.value;
    const todos = get();

    this.remove();
    label.style.display = 'inline-block';
    label.textContent = value;

    const index = todos.findIndex((todo) => id === todo.id);
    todos[index].value = value;
    save(todos);
  }

  function init() {
    const todos = get();
    render(todos);
  }

  /**
   * Handle keydown
   * @param {object} e
   */
  function handleKeyDown(e) {
    const value = this.value.trim();

    if (13 === e.keyCode && value.length) { // Enter

      const todo = {
        id: new Date().getTime(),
        value: value,
        completed: false
      };

      // Add to the localStorage
      add(todo);

      // Add to the DOM
      const li = createTodoHTML(todo);
      todoList.appendChild(li);

      // Empty the input value
      this.value = '';
    }
  }

  // Add event listeners
  window.addEventListener('DOMContentLoaded', init);
  document.getElementById('js-todo__add').addEventListener('keydown', handleKeyDown);

})();
