"use strict";


// ============================================================
// SIGN UP
// ============================================================

const signupForm = document.querySelector("#signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const usernameInput =
            document.querySelector("#signupUsername");

        const emailInput =
            document.querySelector("#signupEmail");

        const passwordInput =
            document.querySelector("#signupPassword");

        const genderInput =
            document.querySelector("#gender");

        const signupMessage =
            document.querySelector("#signupMessage");


        const username =
            usernameInput.value.trim();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value.trim();

        const gender =
            genderInput ? genderInput.value : "";


        if (
            username === "" ||
            email === "" ||
            password === ""
        ) {

            if (signupMessage) {
                signupMessage.textContent =
                    "Please complete all required fields.";
            }

            return;
        }


        const user = {

            username: username,

            email: email,

            password: password,

            gender: gender

        };


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        if (signupMessage) {

            signupMessage.textContent =
                "Account created successfully!";
        }


        setTimeout(function () {

            window.location.href =
                "./authentication.html";

        }, 1000);

    });

}



// ============================================================
// LOGIN
// ============================================================

const loginForm =
    document.querySelector("#loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const usernameInput =
            document.querySelector("#loginUsername");

        const passwordInput =
            document.querySelector("#loginPassword");

        const loginMessage =
            document.querySelector("#loginMessage");


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value.trim();


        const savedUser =
            JSON.parse(
                localStorage.getItem("user")
            );


        if (!savedUser) {

            if (loginMessage) {

                loginMessage.textContent =
                    "No account found. Please sign up first.";
            }

            return;
        }


        if (
            username !== savedUser.username ||
            password !== savedUser.password
        ) {

            if (loginMessage) {

                loginMessage.textContent =
                    "Incorrect username or password.";
            }

            return;
        }


        localStorage.setItem(
            "currentUser",
            savedUser.username
        );


        window.location.href =
            "./dash.html";

    });

}



// ============================================================
// DASHBOARD ELEMENTS
// ============================================================

const currentUsername =
    document.querySelector("#currentUsername");

const logoutBtn =
    document.querySelector("#logoutBtn");

const todoForm =
    document.querySelector("#todoForm");

const todoInput =
    document.querySelector("#todoInput");


// IMPORTANT
// Your HTML uses id="appt"

const durationInput =
    document.querySelector("#appt");


const alarmInput =
    document.querySelector("#alarm");

const todoList =
    document.querySelector("#todoList");



// ============================================================
// DASHBOARD LOGIN PROTECTION
// ============================================================

if (
    currentUsername ||
    logoutBtn ||
    todoForm ||
    todoList
) {

    const loggedInUser =
        localStorage.getItem("currentUser");


    if (!loggedInUser) {

        window.location.href =
            "./authentication.html";

    } else {

        if (currentUsername) {

            currentUsername.textContent =
                loggedInUser;
        }

    }

}



// ============================================================
// LOGOUT
// ============================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "currentUser"
            );


            window.location.href =
                "./authentication.html";

        }
    );

}



// ============================================================
// TODO STORAGE
// ============================================================

let todos =
    JSON.parse(
        localStorage.getItem("todos")
    ) || [];



// ============================================================
// SAVE TODOS
// ============================================================

function saveTodos() {

    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );

}



// ============================================================
// TIMER INTERVALS
// ============================================================

const timers = {};



// ============================================================
// CONVERT TIME INPUT TO SECONDS
// ============================================================
//
// The HTML uses:
//
// <input type="time" id="appt">
//
// Examples:
//
// 01:00 = 1 hour
// 02:30 = 2 hours 30 minutes
// 00:30 = 30 minutes
//
// ============================================================

function durationToSeconds(duration) {

    if (!duration) {

        return 0;
    }


    const parts =
        duration.split(":");


    const hours =
        Number(parts[0]);

    const minutes =
        Number(parts[1]);


    if (
        isNaN(hours) ||
        isNaN(minutes)
    ) {

        return 0;
    }


    return (
        (hours * 3600) +
        (minutes * 60)
    );

}



// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(totalSeconds) {

    totalSeconds =
        Math.max(
            0,
            Math.floor(totalSeconds)
        );


    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    return (

        String(hours).padStart(2, "0") +

        ":" +

        String(minutes).padStart(2, "0") +

        ":" +

        String(seconds).padStart(2, "0")

    );

}



// ============================================================
// GET ALARM MINUTES
// ============================================================

function getAlarmMinutes(alarm) {

    if (
        alarm === "5 minutes before"
    ) {

        return 5;
    }


    if (
        alarm === "10 minutes before"
    ) {

        return 10;
    }


    if (
        alarm === "30 minutes before"
    ) {

        return 30;
    }


    return 0;

}



// ============================================================
// CREATE TODO
// ============================================================

if (todoForm) {

    todoForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const task =
                todoInput.value.trim();


            // Get HH:MM from time input

            const duration =
                durationInput.value;


            const alarm =
                alarmInput
                    ? alarmInput.value
                    : "No Alarm";


            // Convert HH:MM to seconds

            const durationSeconds =
                durationToSeconds(
                    duration
                );



            // ====================================================
            // CHECK TODO
            // ====================================================

            if (task === "") {

                alert(
                    "Please enter a Todo."
                );

                return;
            }



            // ====================================================
            // CHECK DURATION
            // ====================================================

            if (
                duration === "" ||
                durationSeconds <= 0
            ) {

                alert(
                    "Please select a valid duration."
                );

                return;
            }



            // ====================================================
            // CREATE TODO OBJECT
            // ====================================================

            const newTodo = {

                id: Date.now(),

                task: task,

                // Store original HH:MM

                duration: duration,

                alarm: alarm,

                status: "Not Started",

                totalSeconds:
                    durationSeconds,

                remainingSeconds:
                    durationSeconds,

                isWorking: false,

                startTime: null,

                alarmTriggered: false,

                editing: false

            };



            todos.push(newTodo);


            saveTodos();


            displayTodos();


            todoForm.reset();

        }
    );

}



// ============================================================
// GET REMAINING TIME
// ============================================================

function getRemainingTime(todo) {

    let remaining =
        todo.remainingSeconds;


    if (
        todo.isWorking &&
        todo.startTime
    ) {

        const now =
            Date.now();


        const elapsed =
            Math.floor(
                (now - todo.startTime) / 1000
            );


        remaining =
            todo.remainingSeconds -
            elapsed;

    }


    return Math.max(
        0,
        remaining
    );

}



// ============================================================
// DISPLAY TODOS
// ============================================================

function displayTodos() {

    if (!todoList) {

        return;
    }


    todoList.innerHTML = "";


    if (todos.length === 0) {

        todoList.innerHTML =
            "<p>No todos yet.</p>";

        return;
    }



    todos.forEach(
        function (todo, index) {

            const todoItem =
                document.createElement(
                    "div"
                );


            todoItem.classList.add(
                "todo-item"
            );



            // ====================================================
            // NORMAL VIEW
            // ====================================================

            if (!todo.editing) {

                const remaining =
                    getRemainingTime(todo);


                const alarmMinutes =
                    getAlarmMinutes(
                        todo.alarm
                    );


                let alarmText =
                    "No Alarm";


                if (
                    alarmMinutes > 0
                ) {

                    const alarmSeconds =
                        Math.max(
                            0,
                            remaining -
                            (alarmMinutes * 60)
                        );


                    alarmText =
                        formatTime(
                            alarmSeconds
                        );

                }



                todoItem.innerHTML = `

                    <div>
                        <strong>Todo</strong>
                        <p>
                            ${escapeHTML(todo.task)}
                        </p>
                    </div>


                    <div>
                        <strong>Duration</strong>

                        <p>
                            ${formatTime(
                                todo.totalSeconds
                            )}
                        </p>
                    </div>


                    <div>
                        <strong>Alarm</strong>

                        <p>
                            <span class="alarm-time-${index}">
                                ${alarmText}
                            </span>
                        </p>
                    </div>


                    <div>
                        <strong>Status</strong>

                        <p>
                            ${todo.status}
                        </p>
                    </div>


                    <div>
                        <strong>Time Left</strong>

                        <p id="timer-${index}">
                            ${formatTime(remaining)}
                        </p>
                    </div>


                    <div class="todo-actions">

                        <button
                            type="button"
                            class="edit-btn"
                            data-index="${index}">
                            ✎
                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            data-index="${index}">
                            🗑
                        </button>


                        <button
                            type="button"
                            class="start-btn work-btn"
                            data-index="${index}">
                            ${
                                todo.isWorking
                                ? "Stop Working"
                                : "Start Working"
                            }
                        </button>

                    </div>

                `;

            }



            // ====================================================
            // EDIT VIEW
            // ====================================================

            else {

                todoItem.innerHTML = `

                    <div>
                        <strong>Todo</strong>

                        <input
                            type="text"
                            class="edit-task"
                            value="${escapeHTML(todo.task)}"
                            maxlength="30"
                        >
                    </div>


                    <div>
                        <strong>Duration</strong>

                        <input
                            type="time"
                            class="edit-duration"
                            value="${todo.duration}"
                        >
                    </div>


                    <div>
                        <strong>Alarm</strong>

                        <select class="edit-alarm">

                            <option
                                value="No Alarm"
                                ${
                                    todo.alarm === "No Alarm"
                                    ? "selected"
                                    : ""
                                }>
                                No Alarm
                            </option>


                            <option
                                value="5 minutes before"
                                ${
                                    todo.alarm === "5 minutes before"
                                    ? "selected"
                                    : ""
                                }>
                                5 minutes before
                            </option>


                            <option
                                value="10 minutes before"
                                ${
                                    todo.alarm === "10 minutes before"
                                    ? "selected"
                                    : ""
                                }>
                                10 minutes before
                            </option>


                            <option
                                value="30 minutes before"
                                ${
                                    todo.alarm === "30 minutes before"
                                    ? "selected"
                                    : ""
                                }>
                                30 minutes before
                            </option>

                        </select>
                    </div>


                    <div>
                        <strong>Status</strong>

                        <select class="edit-status">

                            <option
                                value="Not Started"
                                ${
                                    todo.status === "Not Started"
                                    ? "selected"
                                    : ""
                                }>
                                Not Started
                            </option>


                            <option
                                value="In Progress"
                                ${
                                    todo.status === "In Progress"
                                    ? "selected"
                                    : ""
                                }>
                                In Progress
                            </option>


                            <option
                                value="Completed"
                                ${
                                    todo.status === "Completed"
                                    ? "selected"
                                    : ""
                                }>
                                Completed
                            </option>

                        </select>
                    </div>


                    <div>
                        <strong>Time Left</strong>

                        <p>
                            ${formatTime(
                                getRemainingTime(todo)
                            )}
                        </p>
                    </div>


                    <div class="todo-actions">

                        <button
                            type="button"
                            class="save-edit-btn"
                            data-index="${index}">
                            Save
                        </button>


                        <button
                            type="button"
                            class="cancel-edit-btn"
                            data-index="${index}">
                            Cancel
                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            data-index="${index}">
                            🗑
                        </button>

                    </div>

                `;

            }


            todoList.appendChild(
                todoItem
            );

        }
    );


    attachTodoEvents();

}



// ============================================================
// ATTACH TODO EVENTS
// ============================================================

function attachTodoEvents() {


    // ==========================================================
    // EDIT BUTTON
    // ==========================================================

    const editButtons =
        document.querySelectorAll(
            ".edit-btn"
        );


    editButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    todos[index].editing =
                        true;


                    displayTodos();

                }
            );

        }
    );



    // ==========================================================
    // SAVE EDIT
    // ==========================================================

    const saveEditButtons =
        document.querySelectorAll(
            ".save-edit-btn"
        );


    saveEditButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    saveEdit(index);

                }
            );

        }
    );



    // ==========================================================
    // CANCEL EDIT
    // ==========================================================

    const cancelButtons =
        document.querySelectorAll(
            ".cancel-edit-btn"
        );


    cancelButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    todos[index].editing =
                        false;


                    displayTodos();

                }
            );

        }
    );



    // ==========================================================
    // DELETE BUTTON
    // ==========================================================

    const deleteButtons =
        document.querySelectorAll(
            ".delete-btn"
        );


    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    deleteTodo(index);

                }
            );

        }
    );



    // ==========================================================
    // START / STOP WORKING
    // ==========================================================

    const workButtons =
        document.querySelectorAll(
            ".work-btn"
        );


    workButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    if (
                        todos[index].isWorking
                    ) {

                        stopWorking(index);

                    } else {

                        startWorking(index);

                    }

                }
            );

        }
    );



    // ==========================================================
    // STATUS SELECT
    // ==========================================================

    const statusSelects =
        document.querySelectorAll(
            ".status-select"
        );


    statusSelects.forEach(
        function (select) {

            select.addEventListener(
                "change",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    todos[index].status =
                        this.value;


                    saveTodos();

                }
            );

        }
    );

}



// ============================================================
// SAVE EDIT
// ============================================================

function saveEdit(index) {

    const todoItem =
        document.querySelectorAll(
            ".todo-item"
        )[index];


    if (!todoItem) {

        return;
    }



    const taskInput =
        todoItem.querySelector(
            ".edit-task"
        );


    const durationInput =
        todoItem.querySelector(
            ".edit-duration"
        );


    const alarmInput =
        todoItem.querySelector(
            ".edit-alarm"
        );


    const statusInput =
        todoItem.querySelector(
            ".edit-status"
        );


    const newTask =
        taskInput.value.trim();


    const newDuration =
        durationInput.value;


    const newAlarm =
        alarmInput.value;


    const newStatus =
        statusInput.value;


    const newDurationSeconds =
        durationToSeconds(
            newDuration
        );



    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (
        newTask === "" ||
        newDuration === "" ||
        newDurationSeconds <= 0
    ) {

        alert(
            "Please enter a valid Todo and duration."
        );

        return;
    }



    // ==========================================================
    // DON'T CHANGE DURATION WHILE WORKING
    // ==========================================================

    if (
        todos[index].isWorking
    ) {

        alert(
            "Stop the timer before changing the duration."
        );

        return;
    }



    // ==========================================================
    // UPDATE TODO
    // ==========================================================

    todos[index].task =
        newTask;


    todos[index].duration =
        newDuration;


    todos[index].alarm =
        newAlarm;


    todos[index].status =
        newStatus;


    todos[index].totalSeconds =
        newDurationSeconds;


    todos[index].remainingSeconds =
        newDurationSeconds;


    todos[index].editing =
        false;


    todos[index].alarmTriggered =
        false;


    saveTodos();


    displayTodos();

}



// ============================================================
// START WORKING
// ============================================================

function startWorking(index) {

    const todo =
        todos[index];


    if (!todo) {

        return;
    }


    if (
        todo.isWorking
    ) {

        return;
    }



    // If timer reached zero,
    // start again from original duration

    if (
        todo.remainingSeconds <= 0
    ) {

        todo.remainingSeconds =
            todo.totalSeconds;

    }



    todo.isWorking =
        true;


    todo.status =
        "In Progress";


    todo.startTime =
        Date.now();


    todo.alarmTriggered =
        false;


    saveTodos();


    displayTodos();



    // Clear old timer first

    if (timers[index]) {

        clearInterval(
            timers[index]
        );

    }



    timers[index] =
        setInterval(
            function () {

                updateTimer(index);

            },
            1000
        );

}



// ============================================================
// UPDATE TIMER
// ============================================================

function updateTimer(index) {

    const todo =
        todos[index];


    if (
        !todo ||
        !todo.isWorking
    ) {

        return;
    }



    const remaining =
        getRemainingTime(todo);



    // ==========================================================
    // UPDATE MAIN TIMER
    // ==========================================================

    const timerElement =
        document.querySelector(
            `#timer-${index}`
        );


    if (timerElement) {

        timerElement.textContent =
            formatTime(
                remaining
            );

    }



    // ==========================================================
    // ALARM COUNTDOWN
    // ==========================================================

    const alarmMinutes =
        getAlarmMinutes(
            todo.alarm
        );


    const alarmElement =
        document.querySelector(
            `.alarm-time-${index}`
        );


    if (
        alarmMinutes > 0
    ) {

        const alarmRemaining =
            Math.max(
                0,
                remaining -
                (alarmMinutes * 60)
            );


        if (alarmElement) {

            alarmElement.textContent =
                formatTime(
                    alarmRemaining
                );

        }



        // ======================================================
        // TRIGGER ALARM
        // ======================================================

        if (
            remaining <=
            alarmMinutes * 60
        ) {

            if (
                !todo.alarmTriggered
            ) {

                todo.alarmTriggered =
                    true;


                saveTodos();


                alert(
                    "⏰ Your alarm time has arrived!"
                );

            }

        }

    }



    // ==========================================================
    // TIMER FINISHED
    // ==========================================================

    if (
        remaining <= 0
    ) {

        finishWorking(index);

        return;
    }



    // Save current remaining time

    saveTodos();

}



// ============================================================
// STOP WORKING
// ============================================================

function stopWorking(index) {

    const todo =
        todos[index];


    if (!todo) {

        return;
    }


    const remaining =
        getRemainingTime(todo);


    todo.remainingSeconds =
        remaining;


    todo.isWorking =
        false;


    todo.startTime =
        null;


    todo.status =
        "Not Started";


    saveTodos();



    if (timers[index]) {

        clearInterval(
            timers[index]
        );


        delete timers[index];

    }


    displayTodos();

}



// ============================================================
// FINISH WORKING
// ============================================================

function finishWorking(index) {

    const todo =
        todos[index];


    if (!todo) {

        return;
    }


    todo.remainingSeconds =
        0;


    todo.isWorking =
        false;


    todo.startTime =
        null;


    todo.status =
        "Completed";


    saveTodos();



    if (timers[index]) {

        clearInterval(
            timers[index]
        );


        delete timers[index];

    }


    displayTodos();


    alert(
        `✅ Todo completed: ${todo.task}`
    );

}



// ============================================================
// DELETE TODO
// ============================================================

function deleteTodo(index) {

    const todo =
        todos[index];


    if (!todo) {

        return;
    }



    const confirmDelete =
        confirm(
            "Are you sure you want to delete this Todo?"
        );


    if (!confirmDelete) {

        return;
    }



    // Stop timer if running

    if (timers[index]) {

        clearInterval(
            timers[index]
        );

        delete timers[index];

    }



    todos.splice(
        index,
        1
    );


    saveTodos();


    displayTodos();

}



// ============================================================
// CONTINUE WORKING TIMERS AFTER REFRESH
// ============================================================

function continueWorkingTimers() {

    todos.forEach(
        function (todo, index) {

            if (
                todo.isWorking &&
                todo.startTime
            ) {

                const remaining =
                    getRemainingTime(todo);


                if (
                    remaining <= 0
                ) {

                    finishWorking(index);

                } else {

                    timers[index] =
                        setInterval(
                            function () {

                                updateTimer(index);

                            },
                            1000
                        );

                }

            }

        }
    );

}



// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}



// ============================================================
// DISPLAY TODOS WHEN DASHBOARD LOADS
// ============================================================

if (todoList) {

    displayTodos();

    continueWorkingTimers();

}