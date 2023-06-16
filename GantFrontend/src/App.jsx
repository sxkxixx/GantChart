import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from "./pages/main/main";
import {ThemeProvider} from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Main/>
            <ToastContainer/>
        </ThemeProvider>
    )
}

export default App
