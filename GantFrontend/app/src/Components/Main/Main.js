import React from 'react'
import s from './Main.module.css'
import Gantt from '../Gantt/Gantt'

const Main = () => {
    return (
        <div className={s.container}>
            <div className={s.elements}>
                <div className={s.dropdown}>
                    <select name="tasks" id="tasks">
                        <option>Мои Задачи</option>
                    </select>
                    <select name="projects" id="projects">
                        <option>Проект 123</option>
                    </select>
                    <select name="teams" id="teams">
                        <option>Команда</option>
                    </select>
                </div>
                <div className={s.button}>
                    <button>Создать Задачу</button>
                </div>
            </div>
            <div className={s.gant}>
                <Gantt/>
            </div>
        </div>
    )
}

export default Main
