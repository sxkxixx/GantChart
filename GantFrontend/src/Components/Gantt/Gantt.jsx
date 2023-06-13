import React, {Component} from 'react';
import axios from 'axios';
import './Gantt.css'
import {gantt} from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import s from "../Main/Main.module.css";
import {ReactComponent as Exit} from "../../Assets/img/exitmodal.svg"
import {ReactComponent as Play} from "../../Assets/img/playWhite.svg"
import {ReactComponent as Stop} from "../../Assets/img/stop.svg"
import {ReactComponent as TrashWhite} from "../../Assets/img/trashWhite.svg"
import {ReactComponent as Add} from "../../Assets/img/addButton.svg"
import {ReactComponent as Del} from "../../Assets/img/deleteButton.svg"
import deleteButton from "../../Assets/img/deleteButton.svg";
import {ReactComponent as Clock} from "../../Assets/img/clock.svg"
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {onKanbanViewChange} from './onKanban';

window.onKanbanViewChange = onKanbanViewChange;
let taskId = null;

export default class Gantt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stagesID: [],
            isRunning: false,
            elapsedTime: 0,
            comments: [],
            currentComment: '',
            selectedProjectId: null,
            selectedProjectIdFilter: 1,
            currentEvent: 1,
            selectedTeamId: null,
            usersLocal: [
                {id: 1, first_name: 'Игорь'},
                {id: 2, first_name: 'Олег'},
                {id: 3, first_name: 'Ольга'},
            ],
            users: [],
            projects: [],
            teams: [],
            divs: []
        };
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.timerIntervalId = null;
        this.handlePlayClick = this.handlePlayClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleChange = (event) => {
        this.setState({currentComment: event.target.value});
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.currentComment.trim()) {
            const newComment = {
                name: 'Фамилия Имя Отчество',
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                text: this.state.currentComment,
            };
            this.setState({
                comments: [...this.state.comments, newComment],
                currentComment: '',
            });
        }
    };
    addItem = () => {
        const newItems = [...this.state.stagesID, ""];
        this.setState({stagesID: newItems});
    };
    removeItem = (index) => {
        const newItems = [...this.state.stagesID];
        newItems.splice(index, 1);
        this.setState({stagesID: newItems});
    };
    handleItemChange = (event, index) => {
        const newItems = [...this.state.stagesID];
        newItems[index] = event.target.value;
        this.setState({stagesID: newItems});
    }

    handleAdd() {
        const newData = [...this.state.divs, this.state.divs];
        this.setState({divs: newData});
    }

    handleDelete(index) {
        const newData = [...this.state.divs];
        newData.splice(index, 1);
        this.setState({divs: newData});
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    startTimer() {
        const startTime = Date.now() - this.state.elapsedTime;
        this.timerIntervalId = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            this.setState({elapsedTime});
        }, 10);
    }

    stopTimer() {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
    }

    handlePlayClick() {
        if (this.state.isRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
        this.setState({isRunning: !this.state.isRunning});
    }

    handleSaveClick() {
        this.props.onSave(this.state.elapsedTime);
    }

    handleRemoveClick() {
        this.stopTimer();
        this.setState({isRunning: false, elapsedTime: 0});
    }

    formatTime(time) {
        const s = Math.floor(time / 1000 % 60);
        const m = Math.floor(time / 1000 / 60 % 60);
        const h = Math.floor(time / 1000 / 60 / 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }


    componentDidMount() {
        gantt.config.date_format = "%Y-%m-%d";
        gantt.config.container_resize_method = "timeout";
        gantt.config.show_tasks_outside_timescale = true;

        // Подзадачи
        gantt.templates.grid_indent = function(item) {
            return "<div class='gantt_tree_indent' style='width:" + (item.$level * 4) + "px;'></div>";
        };


        gantt.templates.parse_date = function (date) {
            return new Date(date);
        };
        gantt.templates.format_date = function (date) {
            let formatFunc = gantt.date.date_to_str(gantt.config.date_format);
            return formatFunc(date);
        };

        // Календарь
        gantt.config.scale_height = 80;
        gantt.config.show_tasks_outside_timescale = true;
        gantt.config.start_date = new Date(2023, 1, 1);
        gantt.config.end_date = new Date(2024, 1, 1);
        gantt.config.fit_tasks = true;
        gantt.config.scales = [
            {unit: "month", step: 1, format: "%F, %Y"},
            {unit: "day", step: 1, format: "%j"}
        ];

        gantt.config.show_progress = false;
        gantt.config.show_links = false;
        gantt.i18n.setLocale("ru"); // Руссификация
        gantt.config.show_errors = false; // отключаем баннер ошибок
        gantt.init(this.ganttContainer)

        //scroll
        gantt.config.scrollable = true;
        gantt.config.grid_width = 400;
        gantt.config.scroll_size = 20;
        gantt.config.layout = {
            css: "gantt_container",
            cols: [
                {
                    width: 430,
                    min_width: 300,
                    rows: [
                        {view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer"},
                        {view: "scrollbar", id: "gridScroll"}
                    ]
                },
                {resizer: true, width: 1},
                {
                    min_width: 1000,
                    rows: [
                        {view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
                        {view: "scrollbar", id: "scrollHor"}
                    ]
                },
                {view: "scrollbar", id: "scrollVer"}
            ],
        };

        // Dropdown
        gantt.templates.grid_open = function (item) {
            if (item.$open) {
                return "<div class='my_open_icon'></div>";
            } else {
                return "<div class='my_close_icon'></div>";
            }
        };
        gantt.attachEvent("onTaskClick", function (id, e) {
            let target = e.target || e.srcElement;
            if (target.classList.contains("my_open_icon")) {
                gantt.close(id);
            } else if (target.classList.contains("my_close_icon")) {
                gantt.open(id);
            }
            return true;
        });

        // Add
        gantt.templates.grid_row_class = function (start, end, task) {
            if (task.$level >= 0) {
                return "nested_task"
            }
            return "";
        };

        // Колоны
        gantt.config.columns = [
            {
                name: "text", label: "ЗАДАЧИ", width: "*", tree: true, grid: true,
                template: function (task) {
                    if (task.is_completed === true) {
                        return "<span class='completed_text'>" + task.text + "</span>";
                    } else {
                        return task.text;
                    }
                }
            },
            {
                name: "checked", label: "", width: "26", template: function (task) {
                    if (task.children === 0) {
                        let banner = "";
                        if (!task.is_on_kanban) {
                            banner = "<div class='kanban-banner'>Отображать на канбане</div>";
                        }
                        return `<div class='kanban-container'>
              <input type='checkbox' ${task.is_on_kanban ? "checked" : ""} onchange='onKanbanViewChange(${task.id}, !${task.is_on_kanban})'>
              ${banner}
            </div>`;
                    }
                }
            },
            {
                name: "add", label: "", width: 44
            },
        ]

        function getForm(formName) {
            return document.getElementById(formName);
        }

        // get ID
        gantt.showLightbox = function (id) {
            taskId = id;
            let task = gantt.getTask(id)
            let taskUrl = "http://127.0.0.1:8000/api/v1/gant/task/" + taskId;

            let form;
            let $new = task.$new;

            let parentTask = "";
            if (task.parent) {
                parentTask = "Базовая задача: <span style='text-decoration: underline;'>" + gantt.getTask(task.parent).text + "</span>";
            } else {
                parentTask = "Базовая задача: <span style='text-decoration: underline;'>Отсутствует</span>";
            }

            if ($new) {
                form = getForm("create_task");

                // Display task data in form
                let text = form.querySelector("[name='text']");
                let description = form.querySelector("[name='description']");
                let deadline = form.querySelector("[name='deadline']");
                let startDate = form.querySelector("[name='start_date']");
                let endDate = form.querySelector("[name='end_date']");
                let projectId = form.querySelector("[id='project-op']");
                let teamId = form.querySelector("[id='team-op']");
                let responsible = form.querySelector("[id='responsible-op']");

                form.querySelector("[id='parent_task']").value = task.parent || '';
                form.querySelector("#parent_task").innerHTML = parentTask;

                if (task.$new && task.parent) {
                    let parentTask = gantt.getTask(task.parent);
                    description.value = "";
                    text.value = "";
                    deadline.value = parentTask.deadline ? new Date(parentTask.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    startDate.value = parentTask.start_date ? new Date(parentTask.start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    endDate.value = parentTask.end_date ? new Date(parentTask.end_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    projectId.value = task.project_id
                    teamId.value = task.team_id
                    responsible.value = task.executor_id
                } else {
                    description.value = task.description || "";
                    text.value = task.text || "";
                    deadline.value = task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    startDate.value = task.start_date ? new Date(task.start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    endDate.value = task.end_date ? new Date(task.end_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                    projectId.value = task.project_id
                    teamId.value = task.team_id
                    responsible.value = task.executor_id
                }

                if (task.$new && !task.parent) {
                    text.value = "";
                    deadline.value = "";
                    startDate.value = "";
                    endDate.value = "";
                    projectId.value = task.project_id
                    teamId.value = task.team_id
                    responsible.value = task.executor_id
                }

                let stagesInputs = form.querySelectorAll('.check_list_text');
                let stagesArr = Array.from(stagesInputs).map(input => ({description: input.value}));
                task.stages = stagesArr;

                form.style.display = "flex";

                form.querySelector('button[type="closemodal"]').onclick = cancel;
                form.querySelector("[name='save']").onclick = save;
                form.querySelector("[name='close']").onclick = cancel;
            }

            axios.get(taskUrl)
                .then(response => {
                    let taskData = response.data;
                    console.log(taskData)

                    if (!$new) {
                        // Show the task details form
                        form = getForm("display_task");

                        // вывод данных
                        let textView = form.querySelector("[name='text1']");
                        let descriptionView = form.querySelector("[name='description1']");
                        let deadlineView = form.querySelector("[name='deadline1']");
                        let startDateView = form.querySelector("[name='start_date1']");
                        let endDateView = form.querySelector("[name='end_date1']");
                        let projectId = form.querySelector("[id='project-op1']");
                        let teamId = form.querySelector("[id='team-op1']");
                        let responsible = form.querySelector("[id='responsible-op1']");

                        form.querySelector("[id='parent_task']").value = task.parent || '';
                        form.querySelector("#parent_task").innerHTML = parentTask;

                        descriptionView.value = taskData.task.description || "";
                        textView.value = taskData.task.name || "";
                        deadlineView.value = taskData.task.deadline ? new Date(taskData.task.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                        startDateView.value = taskData.task.planned_start_date ? new Date(taskData.task.planned_start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                        endDateView.value = taskData.task.planned_final_date ? new Date(taskData.task.planned_final_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                        projectId.value = taskData.task.project_id
                        teamId.value = taskData.task.team_id
                        responsible.value = taskData.executor[0].user_id

                        let stagesArr = taskData.stages;
                        let stagesInputs = Array.from(form.querySelectorAll('.check_list_text'));
                        for (let i = 0; i < stagesInputs.length; i++) {
                            stagesInputs[i].value = stagesArr[i].description || '';
                        }
                        let stagesContainer = form.querySelector("#stages-container");
                        stagesContainer.innerHTML = "";
                        for (let i = 0; i < stagesArr.length; i++) {
                            let stageInput = document.createElement("div");
                            stageInput.classList.add("check_list_elements");
                            stageInput.innerHTML = `
<input type="checkbox" ${stagesArr[i].is_ready ? "checked" : ""} />
<p class='check_list_text2'>${stagesArr[i].description}</p>
`;
                            stagesContainer.appendChild(stageInput);
                        }

                        form.style.display = "flex";

                        //name="create_task"
                        form.querySelector('.main_view_list').scrollTop = 0;
                        form.querySelector('button[type="closemodal1"]').onclick = cancel;
                        form.querySelector("[name='create_task']").onclick = function () {
                            taskId = id;
                            let displayForm = getForm("display_task");
                            displayForm.style.display = "none";
                            let parentTaskId = gantt.getSelectedId();
                            gantt.createTask(this.createTask, parentTaskId);
                        }
                        form.querySelector("[name='edit']").onclick = function () {
                            taskId = id;
                            let editForm = getForm("edit_task");
                            let displayForm = getForm("display_task");
                            displayForm.style.display = "none";
                            editForm.style.display = "flex";
                            let task = gantt.getTask(id);
                            editForm.querySelector('.main_view_list').scrollTop = 0;
                            editForm.querySelector("[name='text_edit']").value = taskData.task.name || "";
                            editForm.querySelector("[name='description_edit']").value = taskData.task.description || "";
                            editForm.querySelector("[id='project-op-edit']").value = taskData.task.project_id
                            editForm.querySelector("[id='team-op-edit']").value = taskData.task.team_id
                            editForm.querySelector("[id='responsible-op-edit']").value = taskData.executor[0].user_id
                            editForm.querySelector("[name='deadline_edit']").value = taskData.task.deadline ? new Date(taskData.task.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                            editForm.querySelector("[name='start_date_edit']").value = taskData.task.planned_start_date ? new Date(taskData.task.planned_start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                            editForm.querySelector("[name='end_date_edit']").value = taskData.task.planned_final_date ? new Date(taskData.task.planned_final_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

                            let stagesContainerEdit = editForm.querySelector("#stages-container-edit");
                            const newStagesArr = [...taskData.stages];
                            function addStage() {
                                newStagesArr.push({
                                    is_ready: false,
                                    description: "",
                                });
                                renderStages();
                            }

                            function renderStages() {
                                stagesContainerEdit.innerHTML = "";
                                for (let i = 0; i < newStagesArr.length; i++) {
                                    let stageInput = document.createElement("div");
                                    stageInput.classList.add("check_list_elements");
                                    stageInput.innerHTML = `
      <input type="checkbox" ${newStagesArr[i].is_ready ? "checked" : ""} />
      <input type="text" class='check_list_text' value="${newStagesArr[i].description}">
      <button class="delete-btn">
        <img src="${deleteButton}" alt="Delete">
      </button>
    `;
                                    stagesContainerEdit.appendChild(stageInput);

                                    // Add event listener to delete button
                                    const deleteBtn = stageInput.querySelector(".delete-btn");
                                    deleteBtn.addEventListener("click", () => {
                                        newStagesArr.splice(i, 1);
                                        renderStages();
                                    });
                                }
                            }
                            renderStages();
                            document.querySelector("#add-stage-btn").addEventListener("click", addStage);

                            let parentTask = "";
                            if (task.parent) {
                                parentTask = "Базовая задача: <span style='text-decoration: underline;'>" + gantt.getTask(task.parent).text + "</span>";
                            } else {
                                parentTask = "Базовая задача: <span style='text-decoration: underline;'>Отсутствует</span>";
                            }
                            editForm.querySelector("[id='parent_task']").value = task.parent || '';
                            editForm.querySelector("#parent_task").innerHTML = parentTask;
                            editForm.querySelector("#parent_task").innerHTML = parentTask;
                            editForm.querySelector('button[type="closemodal3"]').onclick = function () {
                                gantt.hideLightbox();
                                editForm.style.display = "none";
                            };
                            editForm.querySelector("[name='save_edit']").onclick = edit
                            editForm.querySelector("[name='create_task_edit']").onclick = function () {
                                taskId = id;
                                let editForm = getForm("edit_task");
                                editForm.style.display = "none";
                                let parentTaskId = gantt.getSelectedId();
                                gantt.createTask(this.createTask, parentTaskId);
                            }
                            editForm.querySelector("[name='delete_edit']").onclick = remove;
                        };
                        form.querySelector("[name='delete']").onclick = remove;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };

        gantt.hideLightbox = function () {
            getForm("create_task").style.display = "none";
            getForm("display_task").style.display = "none";
            getForm("edit_task").style.display = "none";
            taskId = null;
        }

        gantt.config.open_tree_initially = true;

        // Изменение отображения элементов на Диаграмме
        gantt.templates.grid_file = function (obj) {
            if (obj.$level === 0)
                return "<div class='gantt_tree_icon gantt_first'><i class='fas fa-plus'></i></div>";
            else
                return "<div class='gantt_tree_icon'></div>";
        };

        gantt.templates.grid_file = function (item) {
            return "<div class='gantt_tree_icon gantt_file' style='display: none'></div>";
        };

        gantt.templates.grid_folder = function (item) {
            return `<div 
   class='gantt_tree_icon gantt_folder_${(item.$open ? "open" : "closed")}' style='display: none'>
   </div>`;
        };

        gantt.templates.task_text = function (start, end, task) {
            if (task.text) {
                return ''
            }
        };

        gantt.templates.task_class = function (start, end, task) {
            if (task.$level === 0 || task.$level === 1) {
                if (task.is_completed === true) {
                    return "parent-task-complete";
                } else {
                    return "parent-task";
                }
            } else {
                if (task.is_completed === true) {
                    return "child-task-complete";
                } else {
                    return "child-task";
                }
            }
        };

        // Get запрос задач
        axios.get(`http://127.0.0.1:8000/api/v1/gant/tasks`,)
            .then(response => {
                const transformedData = this.transformData(response.data);
                console.log(response)
                gantt.parse(transformedData);
                gantt.refreshData();
            })
            .catch(error => {
                console.error(error);
            });


        // Получение списка пользователей
        axios.get(`http://127.0.0.1:8000/api/v1/gant/users`)
            .then(response => {
                this.setState({users: response.data});
            })
            .catch(error => {
                console.log(error);
            });

        // Получение списка проектов
        axios.get(`http://127.0.0.1:8000/api/v1/gant/projects`)
            .then(response => {
                this.setState({projects: response.data});
            })
            .catch(error => {
                console.log(error);
            });

        // Получение списка команд
        axios.get(`http://127.0.0.1:8000/api/v1/gant/teams`)
            .then(response => {
                this.setState({teams: response.data});
            })
            .catch(error => {
                console.log(error);
            });


        gantt.config.drag_move = true;

        gantt.attachEvent("onBeforeTaskDrag", function (id, mode, e) {
            return true;
        });

        gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
            let task = gantt.getTask(id);
            let parentTask = gantt.getTask(task.parent);
            if (parentTask !== undefined) {
                if (task.start_date < parentTask.start_date || task.end_date > parentTask.end_date) {
                    toast.warn('Даты начала и конца задачи не могут превышать даты начала и конца родительской задачи', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    return
                }
                if (new Date(task.end_date).getTime() < new Date(task.start_date).getTime()) {
                    gantt.changeTaskDates(id, task.start_date, task.end_date);
                    return;
                }
            }
            axios.post(`http://127.0.0.1:8000/api/v1/gant/task/${id}/edit_dates`, {
                planned_start_date: new Date(task.start_date).toISOString().slice(0, 10),
                planned_final_date: new Date(task.end_date).toISOString().slice(0, 10),
                deadline: task.deadline
            })
                .then(response => {
                    console.log(response.data);
                    gantt.refreshData();
                    toast.success('Дата успешно изменена', {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
                .catch(error => {
                    console.error(error);
                    toast.warn('Дата не изменена', {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                });
        });

        gantt.attachEvent("onBeforeGanttRender", function () {
            let range = gantt.getSubtaskDates();
            let scaleUnit = gantt.getState().scale_unit;
            if (range.start_date && range.end_date) {
                gantt.config.start_date = gantt.calculateEndDate(range.start_date, -10, scaleUnit);
                gantt.config.end_date = gantt.calculateEndDate(range.end_date, 20, scaleUnit);
            }
        });

        gantt.attachEvent("onTaskDrag", function (id, mode, task, original) {
            let state = gantt.getState();
            let minDate = state.min_date,
                maxDate = state.max_date;

            let scaleStep = gantt.date.add(new Date(), state.scale_step, state.scale_unit) - new Date();

            let showDate,
                repaint = false;
            if (mode === "resize" || mode === "move") {
                if (Math.abs(task.start_date - minDate) < scaleStep) {
                    showDate = task.start_date;
                    repaint = true;

                } else if (Math.abs(task.end_date - maxDate) < scaleStep) {
                    showDate = task.end_date;
                    repaint = true;
                }

                if (repaint) {
                    gantt.render();
                    gantt.showDate(showDate);
                }
            }
        });

        function save() {
            const form = getForm("create_task");
            // Получаем значения полей формы
            const parentId = document.getElementById("parent_task").value;
            const text = document.getElementsByName("text")[0].value;
            const description = form.querySelector("[name='description']").value.trim();
            const deadline = document.getElementsByName("deadline")[0].value;
            const start_date = document.getElementsByName("start_date")[0].value;
            const end_date = document.getElementsByName("end_date")[0].value;
            let parentTask = document.getElementById("parent_task").value;
            let projectId = form.querySelector("[id='project-op']").value;
            let teamId = form.querySelector("[id='team-op']").value;
            let responsible = form.querySelector("[id='responsible-op']").value

            let stagesInputs = form.querySelectorAll('.check_list_text');
            let stagesArr = Array.from(stagesInputs).map(input => ({description: input.value}));

            // Валидация полей формы
            if (!teamId) {
                toast.error("Выберите команду", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }

            if (!responsible) {
                toast.error("Выберите ответственного", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }

            if (!text) {
                toast.error("Введите название задачи", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }

            if (start_date < parentTask.start_date || end_date > parentTask.end_date) {
                toast.error("Дата начала или конца задачи не может быть раньше начала или позже конца родительской задачи", {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }

            if (!start_date || !end_date) {
                toast.warn("Введите даты начала и конца задачи", {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

            if (new Date(start_date).getTime() > new Date(end_date).getTime()) {
                toast.warn("Дата начала не может быть позже даты окончания задачи", {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

            // Форматируем даты в формат "%Y-%m-%d"
            const formatter = gantt.date.date_to_str("%Y-%m-%d");
            const start_date_formatted = formatter(new Date(start_date));
            const end_date_formatted = formatter(new Date(end_date));

            // Отправляем POST запрос на сервер для создания новой задачи
            axios.post(`http://127.0.0.1:8000/api/v1/gant/task/create`, {
                task: {
                    parent_id: parentId ? parentId : null,
                    project_id: projectId ? projectId : null,
                    team_id: teamId,
                    name: text,
                    description: description,
                    deadline: deadline ? formatter(new Date(deadline)) : formatter(new Date(end_date_formatted)),
                    planned_start_date: start_date_formatted,
                    planned_final_date: end_date_formatted,
                    executor_id: responsible,
                },
                stages: stagesArr
            }).then(response => {
                form.style.display = "none";
                console.log(response.data);
                toast.success("Задача создана", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            }).catch(error => {
                console.error(error);
                toast.warning("Задача не создана", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
        }

        function edit() {
            let task = gantt.getTask(taskId);

            const form = getForm("edit_task");
            // Получаем значения полей формы
            const parentId = document.getElementById("parent_task").value;
            const text = document.getElementsByName("text_edit")[0].value;
            const description = form.querySelector("[name='description_edit']").value.trim();
            const deadline = document.getElementsByName("deadline_edit")[0].value;
            const start_date = document.getElementsByName("start_date_edit")[0].value;
            const end_date = document.getElementsByName("end_date_edit")[0].value;
            const projectId = form.querySelector("[id='project-op-edit']").value;
            const teamId = form.querySelector("[id='team-op-edit']").value;

            // Форматируем даты в формат "%Y-%m-%d"
            const formatter = gantt.date.date_to_str("%Y-%m-%d");
            const start_date_formatted = formatter(new Date(start_date));
            const end_date_formatted = formatter(new Date(end_date));


            // Собираем информацию о стадиях задачи
            const stagesContainerEdit = form.querySelector("#stages-container-edit");
            const stageInputs = stagesContainerEdit.querySelectorAll(".check_list_elements");
            const updatedStages = Array.from(stageInputs).map((input) => {
                const checkbox = input.querySelector("input[type='checkbox']");
                const textInput = input.querySelector("input[type='text']");
                return { description: textInput.value, is_ready: checkbox.checked };
            });


            // Отправляем POST запрос на сервер для создания новой задачи
            axios.post(`http://127.0.0.1:8000/api/v1/gant/task/${task.id}/edit`, {
                task: {
                    parent_id: parentId ? parentId : null,
                    project_id: projectId,
                    team_id: teamId,
                    name: text,
                    description: description,
                    deadline: deadline ? formatter(new Date(deadline)) : formatter(new Date()),
                    planned_start_date: start_date_formatted,
                    planned_final_date: end_date_formatted,
                },
                stages: updatedStages,
            }).then(response => {
                gantt.updateTask(taskId);
                form.style.display = "none";
                console.log(response.data);
                toast.success("Задача Редактирована", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            }).catch(error => {
                console.error(error);
                toast.warning("Задача не Редактирована", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
        }

        function cancel() {
            let task = gantt.getTask(taskId);

            if (task.$new)
                gantt.deleteTask(task.id);
            gantt.hideLightbox();
        }

        function cascadeDeleteTask(taskId) {
            const childTasks = gantt.getChildren(taskId);
            childTasks.forEach(childTask => {
                cascadeDeleteTask(childTask);
            });
            axios.delete(`http://127.0.0.1:8000/api/v1/gant/task/${taskId}/del`)
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
            gantt.deleteTask(taskId);
        }

        function remove() {
            const task = gantt.getTask(taskId);
            cascadeDeleteTask(task.id);
            gantt.hideLightbox();
            window.location.reload()
        }

        const divs = this.state.usersLocal.map((performer, index) => ({
            selectedUserId: performer.id,
            handleSelectChange: (e) => this.handleSelectChange(e, index)
        }));
        this.setState({ divs });

        gantt.render();
    }

    handleSelectChange = (event, index) => {
        const { value } = event.target;
        this.setState(prevState => {
            const divs = [...prevState.divs];
            divs[index].selectedUserId = value;
            return { divs };
        });
    };

    transformData(data) {
        const taskMap = new Map();

        function transformTask(task, parentId = 0) {
            const taskId = task.id;

            const startDate = new Date(task.planned_start_date);
            startDate.setHours(23, 59, 0);

            const endDate = new Date(task.planned_final_date);
            endDate.setHours(23, 59, 0);

            taskMap.set(taskId, {
                id: taskId,
                text: task.name,
                description: task.description,
                is_on_kanban: task.is_on_kanban,
                is_completed: task.is_completed,
                start_date: startDate,
                end_date: endDate,
                deadline: task.deadline,
                open: true,
                parent: parentId,
                children: task.children.length,
                project_id: task.project_id,
                team_id: null,
                executor_id: null,
                user_id: null,
                stages: [],
                executor: []
            });

            if (task.children) {
                task.children.forEach((child) => {
                    // Рекурсивно вызываем функцию transformTask для каждого дочернего элемента
                    transformTask(child, taskId);
                });
            }
        }

        data.forEach((task) => {
            transformTask(task);
        });

        const transformedData = {
            data: Array.from(taskMap.values()),
        };

        return transformedData;
    }


    handleProjectChange = (projectId) => {
        this.setState({
            selectedProjectIdFilter: projectId
        });

        console.log(projectId);
        setTimeout(() => {

            axios.get(`http://127.0.0.1:8000/api/v1/gant/tasks`, {
                params: {
                    project_id: this.state.selectedProjectIdFilter
                }
            }).then(response => {
                const updatedTasks = {};
                const transformedData = this.transformData(response.data);

                // Обойти все задачи и обновить/удалить соответствующие элементы
                transformedData.data.forEach((task) => {
                    const existingTask = gantt.getTask(task.id);
                    if (existingTask) {
                        // Задача уже существует, обновляем ее данные
                        gantt.updateTask(task.id, task);
                        updatedTasks[task.id] = true;
                    } else {
                        // Задачи не существует, добавляем ее
                        gantt.addTask(task);
                        updatedTasks[task.id] = true;
                    }
                });

                // Удалить все задачи, которых нет в updatedTasks
                gantt.eachTask((task) => {
                    if (!updatedTasks[task.id]) {
                        gantt.deleteTask(task.id);
                    }
                });

                // Перерисовать gantt
                gantt.render();
            })
                .catch(error => {
                    console.error(error);
                });
        }, 1000);
    }



    render() {
        const {isRunning, elapsedTime} = this.state;
        return (
            <>
                <div className={s.elements}>
                    <div className={s.dropdown}>
                        <select name="tasks" id="tasks">
                            <option>Мои Задачи</option>
                        </select>
                        <select name="projects" id="projects"
                                onChange={(event) => this.handleProjectChange(event.target.value)}>
                            <option value="">Проект</option>
                            {this.state.projects.map(project => (
                                <option key={project.id} value={project.id}>{project.title}</option>
                            ))}
                        </select>
                        <select name="teams" id="teams">
                            <option>Команда</option>
                        </select>
                    </div>
                    <div className={s.button}>
                        <button onClick={() => gantt.createTask(this.createTask)}>Создать Задачу</button>
                    </div>
                </div>
                {/*===================Форма при создании задачи===============================*/}
                <div id="create_task" className="modal" style={{display: "none"}}>
                    <div className="create-form">
                        <div className='main'>
                            <div className="title_create">
                                <input
                                    placeholder='Введите название'
                                    type="text"
                                    name="text"
                                    className='create_title'
                                />
                                <p id='parent_task'></p>
                            </div>
                            <div className='main_view_list'>
                                <div className="project">
                                    <span>Проект</span>
                                    <select id='project-op'>
                                        {this.state.projects.map(option => (
                                            <option key={option.id} value={option.id}>{option.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='elements'>
                                    <div className="element">
                                        <span>Дедлайн</span>
                                        <input type="date" name='deadline'/>
                                    </div>
                                    <div className="element">
                                        <span>Тег команды</span>
                                        <select id='team-op'>
                                            {this.state.teams.map(option => (
                                                <option key={option.id} value={option.id}>{option.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="date">
                                        <span>Планируемые сроки выполнения</span>
                                        <div className='dateList'>
                                            <input type="date" name='start_date'/>
                                            -
                                            <input type="date" name='end_date'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="description">
                                    <p><textarea name="description" placeholder='Введите описание задачи...'></textarea>
                                    </p>
                                </div>
                                <div className="name">
                                    <div className='nameList'>
                                        <span>Постановщик</span>
                                        <select id='user-op'>
                                            {this.state.usersLocal.map(option => (
                                                <option key={option.id} value={option.id}>{option.first_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='nameList'>
                                        <span>Ответственный</span>
                                        <select id='responsible-op'>
                                            {this.state.users.map(option => (
                                                <option key={option.id} value={option.id}>{option.first_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="performers">
                                    <div className="performers_title">
                                        <span>Исполнители</span>
                                        <button onClick={this.handleAdd}><Add/></button>
                                    </div>
                                    {this.state.divs.map((div, index) => (
                                        <div key={index}>
                                            <select value={div.selectedUserId} onChange={div.handleSelectChange}>
                                                {this.state.usersLocal.map((user) => (
                                                    <option key={user.id} value={user.id}>{user.first_name}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => this.handleDelete(index)}><Del/></button>
                                        </div>
                                    ))}
                                </div>
                                <div className='check_list'>
                                    <div className='check_list_title'>
                                        <span>Чек-лист</span>
                                        <button onClick={this.addItem}><Add/></button>
                                    </div>
                                    <div className='list'>
                                        {this.state.stagesID.map((item, index) => (
                                            <div className='check_list_elements' key={index} id={`item-${index}`}>
                                                <input type="checkbox"/>
                                                <input type="text"
                                                       className='check_list_text'
                                                       value={item}
                                                       onChange={(event) => this.handleItemChange(event, index)}
                                                />
                                                <button onClick={() => this.removeItem(index)}><Del/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='buttons'>
                                    <input className='save' type="button" name="save" value="Сохранить"/>
                                    <input className='cancel' type="button" name="close" value="Отменить"/>
                                </div>
                            </div>
                        </div>
                        <div className='closeButton'>
                            <button type='closemodal' className='closemodal'><Exit/></button>
                        </div>
                    </div>
                </div>
                {/*===================Форма при просмотре задачи==============================*/}
                <div id="display_task" className="modal" style={{display: "none"}}>
                    <div className="view-form">
                        <div className='main_view'>
                            <div className="title">
                                <input
                                    placeholder='Введите название'
                                    type="text"
                                    name="text1"
                                    className='view_title'
                                    readOnly={true}
                                />
                                <p id='parent_task'></p>
                            </div>
                            <div className='main_view_list'>
                                <div className="project">
                                    <span>Проект</span>
                                    <select id='project-op1' disabled>
                                        {this.state.projects.map(option => (
                                            <option key={option.id} value={option.id}>{option.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='elements'>
                                    <div className="element">
                                        <span>Дедлайн</span>
                                        <input type="date" name='deadline1' readOnly={true}/>
                                    </div>
                                    <div className="element">
                                        <span>Тег команды</span>
                                        <select id='team-op1' disabled>
                                            {this.state.teams.map(option => (
                                                <option key={option.id} value={option.id}>{option.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="date">
                                        <span>Планируемые сроки выполнения</span>
                                        <div className='dateList'>
                                            <input type="date" name='start_date1' readOnly={true}/>
                                            <p>-</p>
                                            <input type="date" name='end_date1' readOnly={true}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="description">
                                    <p><textarea name="description1"
                                                 placeholder='Описание задачи' readOnly={true} disabled></textarea>
                                    </p>
                                </div>
                                <div className="name">
                                    <div className='nameList'>
                                        <span>Постановщик</span>
                                        <select id='user-op1' disabled>
                                            {this.state.usersLocal.map(option => (
                                                <option key={option.id} value={option.id}>{option.first_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='nameList'>
                                        <span>Ответственный</span>
                                        <select id='responsible-op1' disabled>
                                            {this.state.users.map(option => (
                                                <option key={option.id} value={option.id}>{option.first_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='performers'>
                                    <span>Исполнители</span>
                                    {this.state.divs.map((div, index) => (
                                        <div key={index}>
                                            <select disabled value={div.selectedUserId} onChange={div.handleSelectChange}>
                                                {this.state.usersLocal.map((user) => (
                                                    <option key={user.id} value={user.id}>{user.first_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                                <div className='check_list'>
                                    <div className='check_list_title'>
                                        <span>Чек-лист</span>
                                    </div>
                                    <div className='list_view' id="stages-container"></div>
                                </div>
                                <div className='timer'>
                                    <div className='timer_top'>
                                        <span>Таймер</span>
                                        <div className='timer_top_elements'>
                                            <p><Clock/>{this.formatTime(elapsedTime)}</p>
                                            <div className='timer_button'>
                                                <button className='play_time' name="play"
                                                        onClick={this.handlePlayClick}>
                                                    {isRunning ? <Stop/> : <Play/>}
                                                </button>
                                                <button className='save_time' name="save_time"
                                                        onClick={this.handleSaveClick}>Сохранить
                                                </button>
                                                <button className='remove_time' name="remove_time"
                                                        onClick={this.handleRemoveClick}><TrashWhite/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='timer_bottom'>
                                        <span>Затраченное время</span>
                                        <div className='timer_bottom_elements'>
                                            <p>00:00:00</p>
                                            <input type="text" placeholder='ФИО' readOnly={true}/>
                                        </div>
                                    </div>
                                </div>
                                <div className='buttons'>
                                    <input className='edit_view' type="button" name="edit" value="Редактировать"/>
                                    <input className='create_view' type="button" name="create_task"
                                           value="Создать подзадачу"/>
                                    <input className='remove_view' type="button" name="delete" value="Удалить задачу"/>
                                </div>
                                <div className="comments">
                                    <div className="comments_input">
                                        <span>Комментарии</span>
                                        <form onSubmit={this.handleSubmit}>
                                            <input type="text" placeholder="Введите комментарий..."
                                                   value={this.state.currentComment} onChange={this.handleChange}/>
                                            <button type="submit">Добавить</button>
                                        </form>
                                    </div>
                                    <div className="comments_output">
                                        {this.state.comments.map((comment, index) => (
                                            <div className="comments_output_item" key={index}>
                                                <div className="comments_output_title">
                                                    <p className="comments_output_name">{comment.name}</p>
                                                    <p className="comments_output_time">{comment.time}</p>
                                                </div>
                                                <p className="comments_output_text">{comment.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='closeButton'>
                            <button type='closemodal1' className='closemodal'><Exit/></button>
                        </div>
                    </div>
                </div>
                {/*===================Редактирование задачи===================================*/}
                <div id="edit_task" className="modal" style={{display: "none"}}>
                    <div className="create-form">
                        <div className='main_view'>
                            <div className="title_edit">
                                <input
                                    placeholder='Введите название'
                                    type="text"
                                    name="text_edit"
                                    className='create_title'
                                />
                                <p id='parent_task'></p>
                            </div>
                            <div className='main_view_list'>
                                <div className="project">
                                    <span>Проект</span>
                                    <select id='project-op-edit'>
                                        {this.state.projects.map(option => (
                                            <option key={option.id} value={option.id}>{option.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='elements'>
                                    <div className="element">
                                        <span>Дедлайн</span>
                                        <input type="date" name='deadline_edit'/>
                                    </div>
                                    <div className="element">
                                        <span>Тег команды</span>
                                        <select id='team-op-edit'>
                                            {this.state.teams.map(option => (
                                                <option key={option.id} value={option.id}>{option.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="date">
                                        <span>Планируемые сроки выполнения</span>
                                        <div className='dateList'>
                                            <input type="date" name='start_date_edit'/>
                                            -
                                            <input type="date" name='end_date_edit'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="description">
                                    <p><textarea name="description_edit"
                                                 placeholder='Введите описание задачи...'></textarea>
                                    </p>
                                </div>
                                <div className="name">
                                    <div className='nameList'>
                                        <span>Постановщик</span>
                                        <select id='user-op-edit'>
                                            {this.state.usersLocal.map(option => (
                                                <option key={option.id} value={option.id}>{option.first_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='nameList'>
                                        <span>Ответственный</span>
                                        <select id='responsible-op-edit' disabled>
                                            {this.state.users.map(option => (
                                                <option key={option.id} value={option.id}>{option.first_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="performers">
                                    <div className="performers_title">
                                        <span>Исполнители</span>
                                        <button onClick={this.handleAdd}><Add/></button>
                                    </div>
                                    {this.state.divs.map((div, index) => (
                                        <div key={index}>
                                            <select value={div.selectedUserId} onChange={div.handleSelectChange}>
                                                {this.state.usersLocal.map((user) => (
                                                    <option key={user.id} value={user.id}>{user.first_name}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => this.handleDelete(index)}><Del/></button>
                                        </div>
                                    ))}
                                </div>
                                <div className='check_list_edit'>
                                    <div className='check_list_title'>
                                        <span>Чек-лист</span>
                                        <button id="add-stage-btn"><Add/></button>
                                    </div>
                                    <div className='list_view' id="stages-container-edit"></div>
                                    <div className='timer_bottom'>
                                        <span>Затраченное время</span>
                                        <div className='timer_bottom_elements'>
                                            <p>00:00:00</p>
                                            <select>
                                                <option>Выберите</option>
                                                <option>Игорь</option>
                                                <option>Саша</option>
                                                <option>Вера</option>
                                                <option>Юля</option>
                                                <option>Артем</option>
                                            </select>
                                            <Del/>
                                        </div>
                                    </div>
                                </div>
                                <div className='buttons'>
                                    <input className='edit_view' type="button" name="save_edit" value="Сохранить"/>
                                    <input className='create_view' type="button" name="create_task_edit"
                                           value="Создать подзадачу"/>
                                    <input className='remove_view' type="button" name="delete_edit"
                                           value="Удалить задачу"/>
                                </div>
                            </div>
                        </div>
                        <div className='closeButton'>
                            <button type='closemodal3' className='closemodal'><Exit/></button>
                        </div>
                    </div>
                </div>
                {/*===========================================================================*/}
                <div
                    ref={(input) => {
                        this.ganttContainer = input
                    }}
                    style={{width: '90%', height: '85%', overflow: 'auto'}}
                ></div>
            </>
        );
    }
}
