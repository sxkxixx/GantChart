import React from 'react'
import s from './Main.module.css'
import Gantt from '../Gantt/Gantt'

const Main = () => {
    return (
        <div className={s.container}>
            <div className={s.elements}>
                <div>
                    <select name="cars" id="cars">
                        <option value="volvo">Мои Задачи</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                    </select>
                    <select name="cars" id="cars">
                        <option value="volvo">Проект 123</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                    </select>
                    <select name="cars" id="cars">
                        <option value="volvo">Команда</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                    </select>
                </div>
                <button>Создать Задачу</button>
            </div>
            <div className={s.gant}>
                <Gantt/>
            </div>
        </div>
    )
}

export default Main
