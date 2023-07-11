import ButtonForm from '../GanttTaskForm/UI/Button';
import TableRow from '../GanttTaskForm/UI/TableRow';
import s from './StartPage.module.css'


const StartPage = () => {
   
    return (
        <div className={s.container}>
            <div className={s.elements}>
                <p className={s.title}>Мои проекты</p>
                <div className={s.searchContainer} >
                    <input className={s.searchForm}></input>
                    <ButtonForm>Поиск</ButtonForm>
                </div>

            </div>

            <div className={s.projectsContainer}>
            <ul className={s.table}>
                <li className={s.tableHeader}>
                    <div className={s.col1}>Название</div>
                    <div className={s.col2}>Руководитель</div>
                    <div className={s.col3}>Дата начала</div>
                    <div className={s.col4}>Дата окончания</div>
                </li>
                <TableRow
                    project={'Личный кабинет стажера. Летняя практика 2023'}
                    director={'Смирнов Д.С.'}
                    startDate={'03.07.2023'}
                    endDate={'14.07.2023'}/>
                <TableRow
                    project={'Личный кабинет стажера. Летняя практика 2023'}
                    director={'Смирнов Д.С.'}
                    startDate={'03.07.2023'}
                    endDate={'14.07.2023'}/>
                <TableRow
                    project={'Личный кабинет стажера. Летняя практика 2023'}
                    director={'Смирнов Д.С.'}
                    startDate={'03.07.2023'}
                    endDate={'14.07.2023'}/>
            </ul>
            </div>
        </div>
    );
};

export default StartPage;
