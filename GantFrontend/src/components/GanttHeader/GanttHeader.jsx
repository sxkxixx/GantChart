import React, {useEffect} from 'react';
import s from './GanttHeader.module.css'
import Select from "../UI/Select";
import Button from "../UI/Button";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {projectsList, teamsList} from "../../store/atom";
import {getAllProjects, getAllTeams} from "../../services/list";

const GanttHeader = () => {
    const projectList = useRecoilValue(projectsList)
    const setProjectList = useSetRecoilState(projectsList)

    const teamList = useRecoilValue(teamsList)
    const setTeamsList = useSetRecoilState(teamsList)

    useEffect(()=>{
        getAllProjects()
            .then((response) => {
                setProjectList(response);
                console.log(response)
            })
            .catch((error) => {
                console.log(error);
            });

        getAllTeams ()
            .then((response) => {
                setTeamsList(response);
                console.log(response)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [setProjectList])

    return (
        <div className={s.container}>
            <div className={s.selects}>
                <Select options={projectList}/>
                <Select options={projectList}/>
                <Select options={teamList}/>
            </div>
            <div className={s.buttons}>
                <Button children={"создать задачу"}/>
            </div>
        </div>
    );
};

export default GanttHeader;
