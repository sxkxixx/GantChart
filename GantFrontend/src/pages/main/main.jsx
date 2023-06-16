import React from 'react'
import s from './main.module.css'
import GanttChart from "../../components/GanttChart/GanttChart";

const Main = () => {
    return (
        <div className={s.container}>
            <div className={s.gant}>
                <GanttChart />
            </div>
        </div>
    )
}

export default Main
