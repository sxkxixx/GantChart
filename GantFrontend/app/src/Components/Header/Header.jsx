import React from 'react'
import s from './Header.module.css'
import {ReactComponent as Logo} from "../../Assets/img/logo.svg"
import {ReactComponent as Profile} from "../../Assets/img/profile.svg"
import {ReactComponent as Canban} from "../../Assets/img/canban.svg"
import {ReactComponent as Gantt} from "../../Assets/img/gantt.svg"
import {ReactComponent as Clock} from "../../Assets/img/clock.svg"
import {ReactComponent as Exit} from "../../Assets/img/exit.svg"


const Header = () => {
    return (
        <div className={s.container}>
            <div className={s.left}>
                <p className={s.logo}><Logo/><h1>Л.К. Стажера</h1></p>
                <button className={s.profile}><Profile/> Личный кабинет</button>
                <div className={s.category}>
                    <button className={s.disableCategory}><Canban/>Канбан</button>
                    <button className={s.disableCategory}><Gantt/>Гант</button>
                </div>
            </div>
            <div className={s.right}>
                <div className={s.time}>
                    <span>Название задачи</span>
                    <span><Clock/><p>00:00</p></span>
                </div>
                <button className={s.exit}><Exit/>Выход</button>
            </div>
        </div>
    )
}

export default Header
