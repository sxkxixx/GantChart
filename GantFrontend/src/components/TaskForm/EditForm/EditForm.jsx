import React, {useState} from 'react';
import s from './EditForm.module.css'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectsList, taskIdState, tasksState, teamsList} from "../../../store/atom";
import {createTask, deleteIdTask, getAllTask, updateIdTask} from "../../../services/task";
import Text from "../UI/Text";
import Select from "../UI/Select";
import {ReactComponent as Project} from  '../../../assets/img/projects.svg'
import {ReactComponent as Add} from  '../../../assets/img/addButtForm.svg'
import {ReactComponent as Del} from  '../../../assets/img/delButtForm.svg'
import InputDate1 from "../UI/InputDate1";
import ButtonForm from "../UI/Button";
import TextArea from "../UI/TextArea";
import {toast} from "react-toastify";

const EditForm = ({id, setFormType, setShowModal}) => {
    // const [projectId, setProjectId] = useRecoilState(projectsList)
    const [projectId, setProjectId] = useState(0)
    // const [teamId, setTeamId] = useRecoilState(teamsList)
    const [teamId, setTeamId] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [finalDate, setFinalDate] = useState('')
    const [deadline, setDeadline] = useState('')
    const [executorId, setExecutorId] = useState(0)
    // const [stages, setStages] = useState([])
    const [performers, setPerformers] = useState([]);
    const [taskId, setTaskId] = useRecoilState(taskIdState)
    const setTasks = useSetRecoilState(tasksState)
    const tasks = useRecoilValue(tasksState)

    const options = [
        { id: 1, name: 'Название проекта' },
        { id: 21, name: 'ЛК оценка' },
        { id: 22, name: 'ЛК Гант' },
        { id: 23, name: 'ЛК Канбан' }
    ];

    const handleAddPerformer = () => {
        setPerformers([...performers, options])
    };

    const handleDeletePerformer = (index) => {
        const newData = [...performers];
        newData.splice(index, 1);
        setPerformers(newData);
    };

    const handleAddStages = (description) => {
        const newStage = {
            id: (taskId.stages?.length ?? 0) + 1,
            checked: false,
            description: description
        };
        const updatedStages = [...(taskId.stages ?? []), newStage];
        setTaskId({ ...taskId, stages: updatedStages });
    };

    const handleDeleteStages = (index) => {
        const newData = [...taskId.stages];
        newData.splice(index, 1);
        setTaskId({ ...taskId, stages: newData });
    };

    const handleStageDescriptionChange = (index, description) => {
        const updatedStages = [...taskId.stages];
        if (updatedStages[index]) {
            const updatedStage = { ...updatedStages[index], description };
            updatedStages[index] = updatedStage;
            setTaskId({ ...taskId, stages: updatedStages });
        }
    };

    const validateDates = () => {
        if (!taskId.task.parent_id) {
            return true;
        }

        const parentStartDate = Date.parse(findTaskById(tasks, taskId.task.parent_id)?.planned_start_date);
        const parentFinalDate = Date.parse(findTaskById(tasks, taskId.task.parent_id)?.planned_final_date);

        if (Date.parse(startDate) === parentStartDate || Date.parse(finalDate) === parentFinalDate) {
            return true;
        } else if (Date.parse(startDate) < parentStartDate || Date.parse(finalDate) > parentFinalDate) {
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateDates()) {
            alert("Подзадача не может выходить за отрезок времени базовой задачи.");
            return
        }

        const taskList = {
            parent: taskId.task.parent_id !== null ? taskId.task.parent_id : null,
            projectId: projectId !== 0 ? projectId : taskId.task.project_id,
            teamId: teamId !== 0 ? teamId : taskId.task.team_id,
            name: name !== '' ? name : taskId.task.name,
            description: description !== '' ? description : taskId.task.description,
            startDate: startDate !== '' ? startDate : taskId.task.planned_start_date,
            finalDate: finalDate !== '' ? finalDate : taskId.task.planned_final_date,
            deadline: deadline !== '' ? deadline : taskId.task.deadline,
            // executorId: executorId !== 0 ? executorId : taskId.executor && taskId.executor[0].user_id,
        };

        const stagesList = taskId.stages.map((stage) => stage.description);

        try {
            await updateIdTask(id.id, taskList, stagesList);
            setShowModal(false);
            const updatedTasks = await getAllTask();
            setTasks(updatedTasks);
            toast.success('Задача изменена!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (e) {
            console.log(e);
        }
    };

    const Delete = async () => {
        try {

            const taskChild = findTaskById(tasks, taskId.task.id);

            if (taskChild.children.length !== 0 && taskChild.children.length > 0) {
                toast.error('Невозможно удалить задачу с подзадачами!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return
            }

            await deleteIdTask(taskId.task.id);
            setShowModal(false);
            const updatedTasks = await getAllTask();
            setTasks(updatedTasks);
            toast.success('Задача удалена!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (e) {
            console.log(e);
        }
    }

    const findTaskById = (tasks, taskId) =>{
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (task.id === taskId) {
                return task;
            }
            if (task.children && task.children.length > 0) {
                const foundTask = findTaskById(task.children, taskId);
                if (foundTask) {
                    return foundTask;
                }
            }
        }
        return null;
    }

    return (
        <div className={s.container}>
            <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.title}>
                    <Text defaultValue={taskId.task && taskId.task.name}  optional={true} width={"606px"} height={"36px"} onChange={(event) => setName(event.target.value)}/>
                    <span>
                        Базовая задача:
                        <span style={{textDecoration:'underline'}}>
                        {taskId.task && taskId.task.parent_id !== null ?
                            findTaskById(tasks, taskId.task.parent_id)?.name : "Отсутствует"}
                        </span>
                    </span>
                </div>
                <div className={s.project}>
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        defaultValue={taskId.task && taskId.task.project_id}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        onChange={(event) => setProjectId(event.target.value)}
                    />
                </div>
                <div className={s.elements}>
                    <div className={s.dates}>
                        <span>Планируемые сроки выполнения</span>
                        <div className={s.date}>
                            <input
                                type="date"
                                defaultValue={taskId.task && taskId.task.planned_start_date}
                                onChange={(event) => setStartDate(event.target.value)}
                            />
                            <span> - </span>
                            <input
                                type="date"
                                defaultValue={taskId.task && taskId.task.planned_final_date}
                                onChange={(event) => setFinalDate(event.target.value)}
                            />
                        </div>
                    </div>
                    <Select
                        label="Тег Команды"
                        icon={<Project/>}
                        defaultValue={taskId.task && taskId.task.team_id}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        onChange={(event) => setTeamId(event.target.value)}
                    />
                    <InputDate1
                        defaultValue={taskId.task && taskId.task.deadline}
                        onChange={(event) => setDeadline(event.target.value)}
                    />
                </div>
                <div className={s.description}>
                    <TextArea
                        width={"606px"}
                        height={"128px"}
                        placeholder="Введите комментарий..."
                        defaultValue={taskId.task && taskId.task.description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <div className={s.important}>
                    <Select
                        label="Постановщик"
                        icon={<Project/>}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        onChange={(e) => console.log(e.target.value)}
                    />
                    <Select
                        label="Ответственный"
                        icon={<Project/>}
                        disabled
                        defaultValue={taskId.executor && taskId.executor[0].user_id}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        onChange={(event) => setExecutorId(event.target.value)}
                    />
                </div>
                <div className={s.unimportant}>
                    <div className={s.unimportantTop}>
                        <span>Исполнители</span>
                        <button type="button"  onClick={handleAddPerformer}>
                            <Add />
                        </button>
                    </div>
                    <div className={s.unimportantLists}>
                        {performers.map((performer, index) => (
                            <div className={s.unimportantList} key={index}>
                                <Select  options={options.map(opt => ({value: opt.id, name: opt.name}))}/>
                                <button type="button" onClick={() => handleDeletePerformer(index)}>
                                    <Del />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={s.checklist}>
                    <div className={s.checklistTop}>
                        <span>Чек-лист</span>
                        <button type="button"  onClick={() => handleAddStages('')}>
                            <Add />
                        </button>
                    </div>
                    <div className={s.checkLists}>
                        {taskId.stages && taskId.stages.map((stage, index) => (
                            <div className={s.checkList} key={index}>
                                <input type="checkbox" defaultChecked={stage.is_ready}/>
                                <Text
                                    width={"60%"}
                                    height={"21px"}
                                    defaultValue={stage.description}
                                    onChange={(event) =>
                                        handleStageDescriptionChange(
                                            index,
                                            event.target.value
                                        )
                                    }
                                />
                                <button type="button" onClick={() => handleDeleteStages(index)}>
                                    <Del />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={s.buttons}>
                    <ButtonForm type="submit">Сохранить</ButtonForm>
                    <ButtonForm width={179} height={32}  onClick={() => setFormType('create')}>Создать подзадачу</ButtonForm>
                    <ButtonForm width={170} height={32}  status='notActive' onClick={Delete}>Удалить задачу</ButtonForm>
                </div>
            </form>
        </div>
    );
};

export default EditForm;
