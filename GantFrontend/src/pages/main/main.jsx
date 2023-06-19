import React from 'react'
import s from './main.module.css'
import GanttChart from "../../components/GanttChart/GanttChart";
import GanttHeader from "../../components/GanttHeader/GanttHeader";

const Main = () => {
    return (
        <div className={s.container}>
            <GanttHeader/>
            <div className={s.gant}>
                <GanttChart />
            </div>
        </div>
    )
}

export default Main
