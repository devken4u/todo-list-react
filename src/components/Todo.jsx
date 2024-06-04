import "./todo.css";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { BiEditAlt } from "react-icons/bi";
import { IoTrash } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";

function TaskItem({ data, index, onTaskDone, onDeleteTask, saveEditedTask }) {
  const todoItemContainer = useRef(null);
  const body = useRef(null);

  function onEditClick() {
    body.current.contentEditable = true;
    body.current.focus();
    // Create a range and set it to the end of the content
    const range = document.createRange();
    range.selectNodeContents(body.current);
    range.collapse(false);

    // Create a selection and set it to the range
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function bodyBlur() {
    body.current.contentEditable = false;
    saveEditedTask(body.current.textContent, index);
  }

  useEffect(() => {
    todoItemContainer.current.classList.remove("task-done");
    if (data.done) todoItemContainer.current.classList.add("task-done");
  });

  return (
    <li className="todo-item-container" ref={todoItemContainer}>
      <FaRegCheckCircle
        className="checked-icon icon-button"
        onClick={() => onTaskDone(index)}
      />
      <span className="todo-body" ref={body} onBlur={bodyBlur}>
        {data.body}
      </span>
      <div className="todo-settings">
        <BiEditAlt className="edit-icon icon-button" onClick={onEditClick} />
        <IoTrash
          className="delete-icon icon-button"
          onClick={() => onDeleteTask(index)}
        />
      </div>
    </li>
  );
}

function AddNewTask({ hidden, closePanel, addNewTask }) {
  const panel = useRef(null);
  const [value, setValue] = useState("");

  function onTaskInputChange(event) {
    setValue(event.target.value);
  }

  function createNewTask() {
    if (value) {
      const task = {
        body: value,
        done: false,
      };
      addNewTask(task);
      setValue("");
      closePanel();
    }
  }

  useEffect(() => {
    panel.current.style.display = "flex";
    if (hidden) panel.current.style.display = "none";
  });

  return (
    <div className="new-task-panel" ref={panel}>
      <div className="new-task-container">
        <FaRegCircleXmark
          className="close-new-panel-icon"
          onClick={closePanel}
        />
        <p className="new-task-title">Add a new task</p>
        <input
          type="text"
          placeholder="Enter new task"
          className="new-task-input"
          value={value}
          onChange={onTaskInputChange}
        />
        <button className="add-task" onClick={createNewTask}>
          Add Task
        </button>
      </div>
    </div>
  );
}

function Todo() {
  let savedCookie = getCookie();

  const [taskList, setTaskList] = useState(savedCookie);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    updateCookie();
  });

  function onTaskDone(index) {
    taskList[index].done = !taskList[index].done;
    setTaskList([...taskList]);
  }

  function onDeleteTask(indexToDelete) {
    const temp = taskList.filter((element, index) => {
      return index !== indexToDelete;
    });
    setTaskList([...temp]);
  }

  function showAddTask() {
    setHidden(false);
  }

  function closePanel() {
    setHidden(true);
  }

  function addNewTask(task) {
    setTaskList([...taskList, task]);
  }

  function saveEditedTask(body, index) {
    taskList[index].body = body;
    setTaskList([...taskList]);
  }

  function updateCookie() {
    let cookieData = taskList;
    const expireDate = new Date();
    expireDate.setFullYear(expireDate.getFullYear() + 100);
    document.cookie = `data="${JSON.stringify(
      cookieData
    )}"; expires=${expireDate.toUTCString()}`;
  }

  function getCookie() {
    if (!document.cookie.includes("data")) document.cookie = `data="[]";`;
    let cookieData = document.cookie;
    cookieData = cookieData.substring(
      cookieData.indexOf('"'),
      cookieData.length
    );
    cookieData = cookieData.replace(/^["]+|["]+$/g, "");
    return JSON.parse(cookieData);
  }

  return (
    <div className="body">
      <AddNewTask
        hidden={hidden}
        closePanel={closePanel}
        addNewTask={addNewTask}
      />
      <div className="todo-container">
        <p className="todo-title">Todo List</p>
        {!taskList.length && <div className="no-task">NO NEW TASKS</div>}
        <ul className="todo-items">
          {taskList.map((element, index) => {
            return (
              <TaskItem
                data={element}
                key={index}
                index={index}
                onTaskDone={onTaskDone}
                onDeleteTask={onDeleteTask}
                saveEditedTask={saveEditedTask}
              />
            );
          })}
        </ul>
        <button className="new-task" onClick={showAddTask}>
          ADD NEW TASK
        </button>
      </div>
    </div>
  );
}

export default Todo;
