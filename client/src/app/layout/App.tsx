import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./styles.css"
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
 
  const theme= createTheme({
   palette:{
    background: {
      default: '#0b090a'
    }
   }
  })

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" theme="colored" hideProgressBar />
      <CssBaseline />
      <Header />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
