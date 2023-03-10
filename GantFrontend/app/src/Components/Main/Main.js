import React from 'react'
import s from './Main.module.css'
import Gantt from '../Gantt/Gantt'

const data = {
    data: [
        { id: 1, text: 'Task #1', start_date: '2019-04-15', duration: 3, progress: 0.6 },
        { id: 2, text: 'Task #2', start_date: '2019-04-18', duration: 3, progress: 0.4 }
    ],
    links: [
        { id: 1, source: 1, target: 2, type: '0' }
    ]
};

// потом убрать tasks из Gantt
const Main = () => {
    return (
        <div className={s.container}>
            <div className={s.title}>
                <h1>Список Задач:</h1>
            </div>
            <div className={s.gant}>
                {/*<Gantt/>*/}
                <Gantt tasks={data}/>
            </div>
        </div>
    )
}

export default Main
