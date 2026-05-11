import { useState } from "react";

const priorityDetails = {
    top: {
        label: "Top Priority",
        className: "priority-top",
    },
    middle: {
        label: "Middle Priority",
        className: "priority-middle",
    },
    low: {
        label: "Low Priority",
        className: "priority-low",
    },
};

const formatDateInputValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(`${dateValue}T00:00:00`));
};

const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return formatDateInputValue(tomorrow);
};

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("top");
    const [deadline, setDeadline] = useState("");

    const handleTaskChange = (e) => {
        setTask(e.target.value);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleDeadlineChange = (e) => {
        setDeadline(e.target.value);
    };

    const addTask = () => {
        const trimmedTask = task.trim();

        if (trimmedTask === "" || deadline === "") {
            alert("Please enter a task and select a valid deadline.");
            return;
        }

        const selectedDate = new Date(`${deadline}T00:00:00`);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate <= currentDate) {
            alert("Please select a future date for the deadline.");
            return;
        }

        const newTask = {
            id: Date.now(),
            task: trimmedTask,
            priority,
            deadline,
            done: false,
        };

        setTasks([...tasks, newTask]);
        setTask("");
        setPriority("top");
        setDeadline("");
    };

    const markDone = (id) => {
        const completedTask = tasks.find((t) => t.id === id);

        if (!completedTask) {
            return;
        }

        setTasks(
            tasks.map((t) => (t.id === id ? { ...t, done: true } : t))
        );
        setCompletedTasks([
            ...completedTasks,
            { ...completedTask, done: true },
        ]);
    };

    const upcomingTasks = tasks.filter((t) => !t.done);
    const minDeadline = getTomorrow();
    const todayLabel = new Intl.DateTimeFormat("en", {
        weekday: "long",
        month: "short",
        day: "numeric",
    }).format(new Date());

    return (
        <div className="app-shell">
            <header className="app-header">
                <div>
                    <p className="eyebrow">Plan your day</p>
                    <h1>Task Scheduler</h1>
                </div>
                <div className="date-pill">{todayLabel}</div>
            </header>

            <main className="dashboard">
                <section className="stats-grid" aria-label="Task summary">
                    <article className="stat-card stat-total">
                        <span>Total Tasks</span>
                        <strong>{tasks.length}</strong>
                    </article>
                    <article className="stat-card stat-pending">
                        <span>Pending</span>
                        <strong>{upcomingTasks.length}</strong>
                    </article>
                    <article className="stat-card stat-completed">
                        <span>Completed</span>
                        <strong>{completedTasks.length}</strong>
                    </article>
                </section>

                <section className="panel form-panel">
                    <div className="section-title">
                        <h2>Create Task</h2>
                    </div>

                    <div className="task-form">
                        <input
                            type="text"
                            id="task"
                            placeholder="Enter task..."
                            value={task}
                            onChange={handleTaskChange}
                        />
                        <select
                            id="priority"
                            value={priority}
                            onChange={handlePriorityChange}
                        >
                            <option value="top">Top Priority</option>
                            <option value="middle">Middle Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                        <input
                            type="date"
                            id="deadline"
                            min={minDeadline}
                            value={deadline}
                            onChange={handleDeadlineChange}
                        />
                        <button id="add-task" onClick={addTask}>
                            Add Task
                        </button>
                    </div>
                </section>

                <section className="panel">
                    <div className="section-title">
                        <h2>Upcoming Tasks</h2>
                        <span className="count-badge">
                            {upcomingTasks.length}
                        </span>
                    </div>

                    {upcomingTasks.length > 0 ? (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Task Name</th>
                                        <th>Priority</th>
                                        <th>Deadline</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingTasks.map((t) => (
                                        <tr key={t.id}>
                                            <td
                                                className="task-name"
                                                data-label="Task"
                                            >
                                                {t.task}
                                            </td>
                                            <td data-label="Priority">
                                                <span
                                                    className={`priority-badge ${
                                                        priorityDetails[
                                                            t.priority
                                                        ].className
                                                    }`}
                                                >
                                                    {
                                                        priorityDetails[
                                                            t.priority
                                                        ].label
                                                    }
                                                </span>
                                            </td>
                                            <td data-label="Deadline">
                                                {formatDisplayDate(t.deadline)}
                                            </td>
                                            <td
                                                className="action-cell"
                                                data-label="Action"
                                            >
                                                <button
                                                    className="mark-done"
                                                    onClick={() =>
                                                        markDone(t.id)
                                                    }
                                                >
                                                    Done
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            No upcoming tasks yet.
                        </div>
                    )}
                </section>

                <section className="panel completed-panel">
                    <div className="section-title">
                        <h2>Completed Tasks</h2>
                        <span className="count-badge">
                            {completedTasks.length}
                        </span>
                    </div>

                    {completedTasks.length > 0 ? (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Task Name</th>
                                        <th>Priority</th>
                                        <th>Deadline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {completedTasks.map((ct) => (
                                        <tr key={ct.id}>
                                            <td
                                                className="task-name completed-name"
                                                data-label="Task"
                                            >
                                                {ct.task}
                                            </td>
                                            <td data-label="Priority">
                                                <span
                                                    className={`priority-badge ${
                                                        priorityDetails[
                                                            ct.priority
                                                        ].className
                                                    }`}
                                                >
                                                    {
                                                        priorityDetails[
                                                            ct.priority
                                                        ].label
                                                    }
                                                </span>
                                            </td>
                                            <td data-label="Deadline">
                                                {formatDisplayDate(
                                                    ct.deadline
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            Nothing completed yet.
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default App;
