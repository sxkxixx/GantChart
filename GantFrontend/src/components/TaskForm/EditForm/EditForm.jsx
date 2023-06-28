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

const EditForm = ({id ,parentId, setFormType, setShowModal}) => {
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
    const [stages, setStages] = useState([])
    const [performers, setPerformers] = useState([]);
    const taskId = useRecoilValue(taskIdState)
    const setTaskId = useSetRecoilState(taskIdState)
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
            id: stages.length + 1,
            checked: false,
            description: description
        };
        const updatedStages = [...stages, newStage];
        setStages(updatedStages);
    };


    const handleDeleteStages = (index) => {
        const newData = [...stages];
        newData.splice(index, 1);
        setStages(newData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const parent = parentId ? parentId.id : null;
        const taskList = {
            parent,
            projectId,
            teamId,
            name,
            description,
            startDate,
            finalDate,
            deadline: deadline ? deadline : finalDate,
            executorId
        }
        const stagesList = stages.map((stage) => (stage.description));
        try {
            await updateIdTask(id.id, taskList, stagesList)
            setShowModal(false)
            const updatedTasks = await getAllTask();
            setTasks(updatedTasks);
        } catch (e) {
            console.log(e);
        }
    };

    const Delete = async () => {
        try {
            await deleteIdTask(taskId.task.id)
            setShowModal(false)
            const updatedTasks = await getAllTask();
            setTasks(updatedTasks);
        } catch (e) {
            console.log(e);
        }
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
                            tasks.find(task => task.id === taskId.task.parent_id)?.name : "Отсутствует"}
                        </span>
                    </span>
                </div>
                <div className={s.project}>
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        selectedValue={taskId.task && taskId.task.project_id}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        onChange={(event) => setProjectId(event.target.value)}
                    />
                </div>
                <div className={s.elements}>
                    <InputDate1
                        selectedValue={taskId.task && taskId.task.deadline}
                        onChange={(event) => setDeadline(event.target.value)}
                    />
                    <Select
                        label="Тег Команды"
                        icon={<Project/>}
                        selectedValue={taskId.task && taskId.task.team_id}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        onChange={(event) => setTeamId(event.target.value)}
                    />
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
                </div>
                <div className={s.description}>
                    <TextArea
                        width={"606px"}
                        height={"128px"}
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
                        selectedValue={taskId.executor && taskId.executor[0].user_id}
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
                    {performers.map((performer, index) => (
                        <div className={s.unimportantList} key={index}>
                            <Select  options={options.map(opt => ({value: opt.id, name: opt.name}))}/>
                            <button type="button" onClick={() => handleDeletePerformer(index)}>
                                <Del />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={s.checklist}>
                    <div className={s.checklistTop}>
                        <span>Чек-лист</span>
                        <button type="button"  onClick={handleAddStages}>
                            <Add />
                        </button>
                    </div>
                    {taskId.stages && taskId.stages.map((stage, index) => (
                        <div className={s.checkList} key={index}>
                            <input type="checkbox" checked={stage.is_ready}/>
                            <Text
                                width={"60%"}
                                height={"21px"}
                                defaultValue={stage.description}
                                onChange={(event) => {
                                    const newData = [...stages];
                                    newData[index].description = event.target.value;
                                    setStages(newData);
                                }}
                            />
                            <button type="button" onClick={() => handleDeleteStages(index, stage.description)}>
                                <Del />
                            </button>
                        </div>
                    ))}
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
