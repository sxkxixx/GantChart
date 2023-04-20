import React from 'react'
import s from './Main.module.css'
import Gantt from '../Gantt/Gantt'
import axios from "axios";

const Main = () => {
    const handleClick = () => {
        console.log('Кнопка нажата')
    }


    return (
        <div className={s.container}>
            <div className={s.gant}>
                <Gantt/>
            </div>
        </div>
    )
}

export default Main
