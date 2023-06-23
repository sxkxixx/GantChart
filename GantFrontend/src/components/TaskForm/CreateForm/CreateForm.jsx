import React, {useState} from 'react';
import s from './CreateForm.module.css'
import {useRecoilState} from "recoil";
import {projectsList, teamsList} from "../../../store/atom";
import {createTask} from "../../../services/task";
import Text from "../UI/Text";
import Select from "../UI/Select";
import {ReactComponent as Project} from  '../../../assets/img/projects.svg'
import {ReactComponent as Add} from  '../../../assets/img/addButtForm.svg'
import {ReactComponent as Del} from  '../../../assets/img/delButtForm.svg'
import InputDate1 from "../UI/InputDate1";

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

    const options = [
        { id: 1, label: 'Option 1' },
        { id: 2, label: 'Option 2' },
        { id: 3, label: 'Option 3' },
    ];

    const handleAddPerformer = () => {
        setPerformers([...performers, options])
    };

    const handleDeletePerformer = (index) => {
        const newData = [...performers];
        newData.splice(index, 1);
        setPerformers(newData);
    };

    const handleAddStages = () => {
        setStages([...stages, {id: stages.length + 1, checked: false, name: ""}]);
    };


    const handleDeleteStages = (index) => {
        const newData = [...stages];
        newData.splice(index, 1);
        setStages(newData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const parent = parentId.id || null
        const taskList = {
            parent,
            projectId,
            teamId,
            name,
            description,
            startDate,
            finalDate,
            deadline,
            executorId
        }
        const stagesList = {
            stages
        }
        try {
            await createTask(taskList, stagesList);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className={s.container}>
            <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.title}>
                    <Text width={"606px"} height={"36px"} onChange={(event) => setName(event.target.value)}/>
                    <span>Базовая задача:{parentId !== null? parentId.name : "Отсувствует"}</span>
                </div>
                <div className={s.project}>
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options.map(opt => ({value: opt.id, label: opt.label}))}
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
                        options={options.map(opt => ({value: opt.id, label: opt.label}))}
                        onChange={(event) => setTeamId(event.target.value)}
                    />
                    <div>
                        <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                        <span> - </span>
                        <input type="date" value={finalDate} onChange={(event) => setFinalDate(event.target.value)} />
                    </div>
                </div>
                <div className={s.description}>
                    <Text
                        width={"606px"}
                        height={"128px"}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <div className={s.important}>
                    <Select
                        label="Постановщик"
                        icon={<Project/>}
                        options={options}
                        selectedValue={'1'}
                        onChange={(e) => console.log(e.target.value)}
                    />
                    <Select
                        label="Ответственный"
                        icon={<Project/>}
                        options={options.map(opt => ({value: opt.id, label: opt.label}))}
                        onChange={(event) => setExecutorId(event.target.value)}
                    />
                </div>
                <div className={s.unimportant}>
                    <div>
                        <span>Исполнители</span>
                        <button type="button"  onClick={handleAddPerformer}>
                            <Add />
                        </button>
                    </div>
                    {performers.map((performer, index) => (
                        <div key={index}>
                            <Select options={performer} selectedValue={'1'} onChange={() => {}} />
                            <button type="button" onClick={() => handleDeletePerformer(index)}>
                                <Del />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={s.checklist}>
                    <div>
                        <span>Чек-лист</span>
                        <button type="button"  onClick={handleAddStages}>
                            <Add />
                        </button>
                    </div>
                    {stages.map((stages, index) => (
                        <div key={index}>
                            <input type="checkbox"/>
                            <Text width={"60%"} height={"21px"}/>
                            <button type="button" onClick={() => handleDeleteStages(index)}>
                                <Del />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={s.buttons}>
                    <button type="submit">Сохранить</button>
                    <button onClick={() => setShowModal(false)}>Отменить</button>
                </div>
            </form>
        </div>
    );
};

export default CreateForm;
