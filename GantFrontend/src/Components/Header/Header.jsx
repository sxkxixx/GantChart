import React, { useState } from 'react'
import s from './Header.module.css'
import {ReactComponent as Logo} from "../../Assets/img/logo.svg"
import {ReactComponent as Profile} from "../../Assets/img/profile.svg"
import {ReactComponent as Canban} from "../../Assets/img/canban.svg"
import {ReactComponent as Gantt} from "../../Assets/img/ganttWhite.svg"
import {ReactComponent as Clock} from "../../Assets/img/clock.svg"
import {ReactComponent as Exit} from "../../Assets/img/exit.svg"
import {ReactComponent as Play} from "../../Assets/img/playWhite.svg"
import {ReactComponent as Trash} from "../../Assets/img/trashWhite.svg"

const Header = () => {
    const [showTaskInfo, setShowTaskInfo] = useState(false);

    const handleTaskClick = () => {
        setShowTaskInfo(!showTaskInfo);
    };

    return (
        <div className={s.container}>
            <div className={s.left}>
                <p className={s.logo}><Logo/><h1 style={{fontSize: '24px', display: 'flex',flexDirection:'row'}}>Л.К. Стажера</h1></p>
                <button className={s.profile}><Profile/> Личный кабинет</button>
                <div className={s.category}>
                    <button className={s.disableCategory}><Canban/>Канбан</button>
                    <button className={s.activeCategory}><Gantt/>Гант</button>
                </div>
            </div>
            <div className={s.right}>
                <div className={s.time}>
                    <button onClick={handleTaskClick}>Название задачи</button>
                    {showTaskInfo &&
                        <div className={s.taskInfo}>
                            <div className={s.taskInfo_left}>
                                <span>Название задачи</span>
                                <button>Информация о задаче</button>
                            </div>
                            <div className={s.taskInfo_right}>
                                <span><Clock/><p>00:00:00</p></span>
                                <div className={s.taskInfo_time}>
                                    <button className={s.play}><Play/></button>
                                    <button className={s.save}>Сохранить</button>
                                    <button className={s.trash}><Trash/></button>
                                </div>
                            </div>
                        </div>
                    }
                    <span><Clock/><p>00:00:00</p></span>
                </div>
                <button className={s.exit}><Exit/>Выход</button>
            </div>
        </div>
    )
}

export default Header
