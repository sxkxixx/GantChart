import React, {useEffect, useState} from 'react';
import s from './ViewForm.module.css'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectsList, taskIdState, tasksState, teamsList} from "../../../store/atom";
import {createTask, deleteIdTask, getAllTask, getIdTask} from "../../../services/task";
import Text from "../UI/Text";
import Select from "../UI/Select";
import {ReactComponent as Project} from '../../../assets/img/projects.svg'
import {ReactComponent as Add} from '../../../assets/img/addButtForm.svg'
import {ReactComponent as Del} from '../../../assets/img/delButtForm.svg'
import InputDate1 from "../UI/InputDate1";
import ButtonForm from "../UI/Button";

const ViewForm = ({id, setFormType, setShowModal}) => {
    const taskId = useRecoilValue(taskIdState)
    const setTaskId = useSetRecoilState(taskIdState)
    const setTasks = useSetRecoilState(tasksState)
    const tasks = useRecoilValue(tasksState)

    const options = [
        {id: 1, name: 'Название проекта'},
        {id: 21, name: 'ЛК оценка'},
        {id: 22, name: 'ЛК Гант'},
        {id: 23, name: 'ЛК Канбан'}
    ];

    useEffect(() => {
        getIdTask(id.id)
            .then((response) => {
                setTaskId(response)
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [setTaskId])


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
            <form className={s.form}>
                <div className={s.title}>
                    <Text width={"606px"} height={"36px"} value={taskId.task && taskId.task.name} disabled/>
                    <span>
                        Базовая задача: {
                        taskId.task &&
                        taskId.task.parent_id !== null ?
                            tasks.find(task => task.id === taskId.task.parent_id)?.name : "Отсутствует"
                    }
                    </span>
                </div>
                <div className={s.project}>
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        selectedValue={taskId.task && taskId.task.project_id}
                        disabled
                    />
                </div>
                <div className={s.elements}>
                    <InputDate1
                        disabled
                        value={taskId.task && taskId.task.deadline}
                    />
                    <Select
                        label="Тег Команды"
                        icon={<Project/>}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        selectedValue={taskId.task && taskId.task.team_id}
                        disabled
                    />
                    <div className={s.dates}>
                        <span>Планируемые сроки выполнения</span>
                        <div className={s.date}>
                            <input disabled type="date" value={taskId.task && taskId.task.planned_start_date}/>
                            <span> - </span>
                            <input disabled type="date" value={taskId.task && taskId.task.planned_final_date}/>
                        </div>
                    </div>
                </div>
                <div className={s.description}>
                    <Text
                        value={taskId.task && taskId.task.description}
                        width={"606px"}
                        height={"128px"}
                        disabled
                    />
                </div>
                <div className={s.important}>
                    <Select
                        label="Постановщик"
                        icon={<Project/>}
                        options={options}
                        disabled
                    />
                    <Select
                        label="Ответственный"
                        icon={<Project/>}
                        options={options.map(opt => ({value: opt.id, name: opt.name}))}
                        disabled
                    />
                </div>
                <div className={s.unimportant}>
                    <div className={s.unimportantTop}>
                        <span>Исполнители</span>
                    </div>
                    {/*{taskId.executor.map((performer, index) => (*/}
                    {/*    <div className={s.unimportantList} key={index}>*/}
                    {/*        <Select options={options} selectedValue={'1'} onChange={() => {*/}
                    {/*        }}/>*/}
                    {/*    </div>*/}
                    {/*))}*/}
                </div>
                <div className={s.checklist}>
                    <div className={s.checklistTop}>
                        <span>Чек-лист</span>
                    </div>
                    {taskId.stages && taskId.stages.map((stage, index) => (
                        <div className={s.checkList} key={index}>
                            <input type="checkbox" checked={stage.is_ready}/>
                            <Text width={"60%"} height={"21px"} value={stage.description} disabled/>
                        </div>
                    ))}
                </div>
                {/*<div className={s.time}>*/}
                {/*    <div className={s.timer}>*/}
                {/*        <span>Таймер</span>*/}
                {/*        <div className={s.timeElements}>*/}
                {/*            <div>*/}
                {/*                <span>00:00:00</span>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <ButtonForm>Play</ButtonForm>*/}
                {/*            <ButtonForm>Сохранить</ButtonForm>*/}
                {/*            <ButtonForm status='notActive'>Delete</ButtonForm>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className={s.timeSpent}>*/}
                {/*        <span>Затраченное время</span>*/}
                {/*        <div className={s.timeSpentElements}>*/}
                {/*            <span>00:00:00</span>*/}
                {/*            <div>*/}
                {/*                <span>ФИО</span>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className={s.buttons}>
                    <ButtonForm width={147} height={32} onClick={() => setFormType('edit')}>Редактировать</ButtonForm>
                    <ButtonForm width={179} height={32}  onClick={() => setFormType('create')}>Создать подзадачу</ButtonForm>
                    <ButtonForm width={170} height={32}  status='notActive' onClick={Delete}>Удалить задачу</ButtonForm>
                </div>
            </form>
        </div>
    );
};

export default ViewForm;
