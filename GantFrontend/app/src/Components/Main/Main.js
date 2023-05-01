import React from 'react'
import s from './Main.module.css'
import Gantt from '../Gantt/Gantt'

const Main = () => {
    return (
        <div className={s.container}>
            <div className={s.gant}>
                <Gantt/>
            </div>
        </div>
    )
}

export default Main
