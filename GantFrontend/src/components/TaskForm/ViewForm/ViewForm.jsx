import React, {useEffect, useState} from 'react';
import s from './ViewForm.module.css'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectsList, taskIdState, teamsList} from "../../../store/atom";
import {createTask, getIdTask} from "../../../services/task";
import Text from "../UI/Text";
import Select from "../UI/Select";
import {ReactComponent as Project} from '../../../assets/img/projects.svg'
import {ReactComponent as Add} from '../../../assets/img/addButtForm.svg'
import {ReactComponent as Del} from '../../../assets/img/delButtForm.svg'
import InputDate1 from "../UI/InputDate1";
import ButtonForm from "../UI/Button";

const ViewForm = ({id, parentId, setShowModal}) => {
    const taskId = useRecoilValue(taskIdState)
    const setTaskId = useSetRecoilState(taskIdState)

    const options = [
        {id: 1, label: 'Option 1'},
        {id: 2, label: 'Option 2'},
        {id: 3, label: 'Option 3'},
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


    return (
        <div className={s.container}>
            <form className={s.form}>
                <div className={s.title}>
                    <Text width={"606px"} height={"36px"} value={taskId.task && taskId.task.name}/>
                    <span>Базовая задача: {taskId.task && taskId.task.parent_id ? parentId.name : "Отсутствует"}</span>
                </div>
                <div className={s.project}>
                    <Select
                        label="Проекты"
                        icon={<Project/>}
                        options={options}
                        selectedValue={taskId.task &&  taskId.task.project_id}
                    />
                </div>
                <div className={s.elements}>
                    <InputDate1
                        value={taskId.task &&  taskId.task.deadline}
                    />
                    <Select
                        label="Тег Команды"
                        icon={<Project/>}
                        options={options}
                        selectedValue={taskId.task && taskId.task.team_id}
                    />
                    <div className={s.dates}>
                        <span>Планируемые сроки выполнения</span>
                        <div className={s.date}>
                            <input type="date" value={taskId.task &&  taskId.task.planned_start_date}/>
                            <span> - </span>
                            <input type="date" value={taskId.task &&  taskId.task.planned_start_date}/>
                        </div>
                    </div>
                </div>
                <div className={s.description}>
                    <Text
                        value={taskId.task && taskId.task.description}
                        width={"606px"}
                        height={"128px"}
                    />
                </div>
                <div className={s.important}>
                    <Select
                        label="Постановщик"
                        icon={<Project/>}
                        options={options}
                    />
                    <Select
                        label="Ответственный"
                        icon={<Project/>}
                        options={options}
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
                            <input type="checkbox"/>
                            <Text width={"60%"} height={"21px"} value={taskId.stages && taskId.stages.description}/>
                        </div>
                    ))}
                </div>
                <div className={s.buttons}>
                    <ButtonForm type="submit">Сохранить</ButtonForm>
                    <ButtonForm status='notActive' onClick={() => setShowModal(false)}>Отменить</ButtonForm>
                </div>
            </form>
        </div>
    );
};

export default ViewForm;
