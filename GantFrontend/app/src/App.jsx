import s from './App.module.css'
import Header from './Components/Header/Header'
import Main from './Components/Main/Main'
import {useEffect} from "react";
import axios from "axios";

function App() {

    // useEffect(()=>{
    //     axios
    //         .get('http://localhost:8000/api/v1/gant/tasks')
    //         .then( res => {
    //             console.log(res)
    //         })
    // })

  return (
      <div className={s.container}>
        <Header/>
        <Main/>
      </div>
  )
}

export default App
