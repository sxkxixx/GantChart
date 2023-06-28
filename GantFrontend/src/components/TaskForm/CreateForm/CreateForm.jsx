import React, {useState} from 'react';
import s from './CreateForm.module.css'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectsList, tasksState, teamsList} from "../../../store/atom";
import {createTask, getAllTask} from "../../../services/task";
import Text from "../UI/Text";
import Select from "../UI/Select";
import {ReactComponent as Project} from  '../../../assets/img/projects.svg'
import {ReactComponent as Add} from  '../../../assets/img/addButtForm.svg'
import {ReactComponent as Del} from  '../../../assets/img/delButtForm.svg'
import InputDate1 from "../UI/InputDate1";
import ButtonForm from "../UI/Button";
import TextArea from "../UI/TextArea";
import {toast} from "react-toastify";

const CreateForm = ({parentId, setShowModal}) => {
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
    const setTasks = useSetRecoilState(tasksState);

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
        const missingData = [];

        if (!name) {
            missingData.push('Название задачи');
        }
        if (!projectId) {
            missingData.push('Проект');
        }
        if (!teamId) {
            missingData.push('Тег Команды');
        }
        if (!startDate) {
            missingData.push('Дата начала');
        }
        if (!finalDate) {
            missingData.push('Дата окончания');
        }
        if (!executorId) {
            missingData.push('Ответственный');
        }

        if (missingData.length > 0) {
            const message = `Вы не ввели следующие обязательные данные:\n${missingData.join('\n')}`;
            alert(message);
            return;
        }
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
            await createTask(taskList, stagesList)
            setShowModal(false)
            const updatedTasks = await getAllTask();
            setTasks(updatedTasks);
            toast.success('Задача создана!', {
                position: "top-right",
                autoClose: 2000,
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

    return (
        <div className={s.container}>
            <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.title}>
                    <Text optional={true} width={"606px"} height={"36px"} onChange={(event) => setName(event.target.value)}/>
                    <span>
                        Базовая задача:
                        <span style={{textDecoration:'underline'}}>
                            {parentId !== null ? parentId.name : "Отсутствует"}
                        </span>
                    </span>
                </div>
                <div className={s.project}>
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        onChange={(event) => setProjectId(event.target.value)}
                    />
                </div>
                <div className={s.elements}>
                    <InputDate1
                        onChange={(event) => setDeadline(event.target.value)}
                    />
                    <Select
                        label="Тег Команды"
                        icon={<Project/>}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        onChange={(event) => setTeamId(event.target.value)}
                    />
                    <div className={s.dates}>
                        <span>Планируемые сроки выполнения</span>
                        <div className={s.date}>
                            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                            <span> - </span>
                            <input type="date" value={finalDate} onChange={(event) => setFinalDate(event.target.value)} />
                        </div>
                    </div>
                </div>
                <div className={s.description}>
                    <TextArea
                        width={"606px"}
                        height={"128px"}
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
                        <button type="button"  onClick={handleAddStages}>
                            <Add />
                        </button>
                    </div>
                    <div className={s.checkLists}>
                        {stages.map((stage, index) => (
                            <div className={s.checkList} key={index}>
                                <input type="checkbox"/>
                                <Text
                                    width={"60%"}
                                    height={"21px"}
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
                </div>
                <div className={s.buttons}>
                    <ButtonForm type="submit">Сохранить</ButtonForm>
                    <ButtonForm status='notActive' onClick={() => setShowModal(false)}>Отменить</ButtonForm>
                </div>
            </form>
        </div>
    );
};

export default CreateForm;
