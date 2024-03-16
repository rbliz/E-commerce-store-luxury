import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./styles.css"
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useStoreContext } from "../context/StoreContext";
import { useEffect, useState } from "react";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const {setBasket} = useStoreContext();
  const [loading, setLoading] = useState(true);

  // here I am using effect to get the cookie so then if there is a cookie we'll get the basket right when the app loads
  useEffect(()=>{
    const buyerId = getCookie('buyerId');
    if(buyerId){
      agent.Basket.get()
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(()=> setLoading(false))
    }else{
      setLoading(false)
    }
  }, [setBasket]);

  const theme= createTheme({
   palette:{
    background: {
      default: '#0b090a'
    }
   }
  })

  if(loading) return <LoadingComponent message="Initializing app..."/>

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
