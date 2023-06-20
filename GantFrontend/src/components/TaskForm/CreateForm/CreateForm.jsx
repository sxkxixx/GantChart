import React, {useState} from 'react';
import s from './CreateForm.module.css'
import {useRecoilState} from "recoil";
import {projectsList, teamsList} from "../../../store/atom";
import {createTask} from "../../../services/task";
import Text from "../UI/Text";
import Select from "../UI/Select";
import {ReactComponent as Project} from  '../../../assets/img/projects.svg'

const CreateForm = ({parentId}) => {
    const [projectId, setProjectId] = useRecoilState(projectsList)
    const [teamId, setTeamId] = useRecoilState(teamsList)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [finalDate, setFinalDate] = useState('')
    const [deadline, setDeadline] = useState('')
    const [executorId, setExecutorId] = useState(0)
    const [stages, setStages] = useState([])

    const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        const parent = parentId || null
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
                    <Text width={"606px"} height={"36px"}/>
                    <span>Базовая задача:{parentId !== null? parentId.name : "Отсувствует"}</span>
                </div>
                <div className={s.project}>
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options}
                        selectedValue={'1'}
                        onChange={(e) => console.log(e.target.value)}
                    />
                </div>
                <div className={s.elements}>
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options}
                        selectedValue={'1'}
                        onChange={(e) => console.log(e.target.value)}
                    />
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options}
                        selectedValue={'1'}
                        onChange={(e) => console.log(e.target.value)}
                    />
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options}
                        selectedValue={'1'}
                        onChange={(e) => console.log(e.target.value)}
                    />
                </div>
                <div className={s.description}>
                    <Text width={"606px"} height={"128px"}/>
                </div>
                <div className={s.important}>
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options}
                        selectedValue={'1'}
                        onChange={(e) => console.log(e.target.value)}
                    />
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options}
                        selectedValue={'1'}
                        onChange={(e) => console.log(e.target.value)}
                    />
                </div>
            </form>
        </div>
    );
};

export default CreateForm;
