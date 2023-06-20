import React, {useEffect, useState} from 'react';
import s from './GanttHeader.module.css'
import Select from "../UI/Select";
import Button from "../UI/Button";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {projectsList, teamsList} from "../../store/atom";
import {getAllProjects, getAllTeams} from "../../services/list";
import Modal from "../TaskForm/Modal/Modal";

const GanttHeader = () => {
    const [formType, setFormType] = useState('')
    const [showModal, setShowModal] = useState(false)
    const parentId = null

    const projectList = useRecoilValue(projectsList)
    const setProjectList = useSetRecoilState(projectsList)

    const teamList = useRecoilValue(teamsList)
    const setTeamsList = useSetRecoilState(teamsList)

    const openForm = (type) => {
        setFormType(type);
        setShowModal(true);
    };

    useEffect(()=>{
        getAllProjects()
            .then((response) => {
                setProjectList(response);
            })
            .catch((error) => {
                console.log(error);
            });

        getAllTeams ()
            .then((response) => {
                setTeamsList(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [setProjectList])

    return (
        <div className={s.container}>
            <div className={s.elements}>
                <div className={s.selects}>
                    <Select options={projectList}/>
                    <Select options={projectList}/>
                    <Select options={teamList}/>
                </div>
                <div className={s.buttons}>
                    <Button children={"создать задачу"} onClick={()=>openForm('create')}/>
                </div>
            </div>
            <Modal parentId={parentId} showModal={showModal} setShowModal={setShowModal} formType={formType} setFormType={setFormType}/>
        </div>
    );
};

export default GanttHeader;
