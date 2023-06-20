import React, {useState} from 'react';
import s from './CreateForm.module.css'
import {useRecoilState, useRecoilValue} from "recoil";
import {projectsList, tasksState, teamsList} from "../../../store/atom";
import {createTask} from "../../../services/task";

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
            <form onSubmit={handleSubmit}>

            </form>
        </div>
    );
};

export default CreateForm;
