import React, {useState} from 'react';
import s from './KanbanChart.module.css'
import Column from "./Column/Column";

const KanbanChart = () => {
    const [boards, setBoards] = useState([
        {id: 1, title:'В РАБОТУ', items: [{id: 1, name: 'пойти'}, {id: 6, name: 'не знаю'}]},
        {id: 2, title:'ВЫПОЛНЯЮТСЯ', items: [{id: 2, name: 'уйти'}]},
        {id: 3, title:'ТЕСТИРОВАНИЕ', items: [{id: 3, name: 'присесть'}]},
        {id: 4, title:'ПРОВЕРКА', items: [{id: 4, name: 'нюхнуть'}]},
        {id: 5, title:'ЗАВЕРШЕННЫЕ', items: [{id: 5, name: 'поржать'}]},
    ])

    return (
        <div className={s.container}>
            <Column boards={boards} setBoards={setBoards}/>
        </div>
    );
};

export default KanbanChart;
