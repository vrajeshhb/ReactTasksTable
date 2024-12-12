import React, { useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import Tabulator CSS
import "react-tabulator/lib/styles.css"; // Default Tabulator styles
import "react-tabulator/css/tabulator.min.css"; // Tabulator main CSS
// import Pagination from "./Pagination"; // for future data growth
const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  //const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const colors = {
    Pending: "#FFFDD0", // Yellow
    "In Progress": "#B9D9EB", // Blue
    Completed: "#D0F0C0", // Green
  };

  const columns = [
    { title: "Task ID", field: "id", width: 90 },
    { title: "Task Title", field: "name", editor: "input" },
    {
      title: "Status",
      field: "status",
      editor: "select",
      editorParams: { values: ["Pending", "In Progress", "Completed"] },
      width: 100,
    },
    {
      title: "Action",
      field: "delete",
      width: 50,
      formatter: "buttonCross",
      cellClick: (e, cell) => handleDelete(cell), // Call delete function on click
    },
  ];

  const rowFormatter = (row) => {
    const status = row.getData().status;
    row.getElement().style.backgroundColor = colors[status] || "#ffffff";
  };
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      const transformedTasks = data.slice(0, 20).map((task) => ({
        id: task.id,
        name: task.title,
        status: task.completed ? "Completed" : "Pending",
      }));
      setTasks(transformedTasks);
      setFilteredTasks(transformedTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    //if (!filtered) {
    setFilteredTasks(filtered);
    //}
  }, [searchQuery, tasks]);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const AddRow = () => {
    const number = Math.floor(Math.random() * 100) + 20;
    const stat = Math.floor(Math.random() * 2) + 1;
    setTasks((pre) => [
      {
        id: number,
        name: `new task ${number}`,
        status: stat === 1 ? "Completed" : "Pending",
      },
      ...pre,
    ]);
    toast.success(`Task with id ${number} added successfully!`);
  };
  const handleDelete = (cell) => {
    const rowData = cell.getRow().getData();
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== rowData.id));
    toast.success(`Task with id ${rowData.id} is Removed!`);
  };
  const sortOp = () => {
    const transformedTasks = tasks
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((task) => ({
        id: task.id,
        name: task.name,
        status: task.status,
      }));
    if (searchQuery) {
      setFilteredTasks(transformedTasks);
    } else {
      setTasks(transformedTasks);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Task Table</h1>
      {/* action buttons */}
      <div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="row mb-4">
          <div className="col">
            <button className="btn btn-primary w-100" onClick={AddRow}>
              New Task
            </button>
          </div>
          <div className="col">
            <button className="btn btn-secondary w-100" onClick={sortOp}>
              Sort Task
            </button>
          </div>
        </div>
      </div>
      {/* Insite Text */}
      <div>
        <div className="row mb-4">
          <div className="col">
            <h5>Total Task : {tasks.length}</h5>
          </div>
          <div className="col">
            <h5>
              Pending :{" "}
              {tasks.filter((task) => task.status === "Pending").length}
            </h5>
          </div>
          <div className="col">
            <h5>
              Completed :{" "}
              {tasks.filter((task) => task.status === "Completed").length}
            </h5>
          </div>
        </div>
      </div>
      {/* Show Fetched Data in Table */}
      {tasks.length ? (
        <ReactTabulator
          data={searchQuery ? filteredTasks : tasks}
          columns={columns}
          layout="fitColumns"
          cellEdited={(e, cell) => setTasks(cell.getTable().getData())}
          rowFormatter={rowFormatter}
          className="table-responsive"
        />
      ) : (
        <h5>empty data set!!</h5>
      )}
      {searchQuery.length && !filteredTasks.length ? (
        <h5>No results found!</h5>
      ) : (
        <h5>
          {/* {filteredTasks.length}
          {searchQuery.length} */}
          END OF RESULTS...
        </h5>
      )}
      {/* <Pagination
        currentPage={currentPage}
        totalPages={tasks.length / 20}
        onPageChange={handlePageChange}
      /> */}
      {/* messages displayed with this */}
      <ToastContainer />
    </div>
  );
};

export default TaskTable;
