import "./todo.css";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { BiEditAlt } from "react-icons/bi";
import { IoTrash } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";

function TaskItem({ data, index, onTaskDone, onDeleteTask }) {
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
    const task = {
      body: value,
      done: false,
    };
    addNewTask(task);
    setValue("");
    closePanel();
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
  const [taskList, setTaskList] = useState([]);
  const [hidden, setHidden] = useState(true);

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
