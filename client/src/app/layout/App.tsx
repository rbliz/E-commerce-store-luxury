import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import { useStoreContext } from "../context/StoreContext";
import { useCallback, useEffect, useState } from "react";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import Footer from "./Footer";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  // using a callback hook from react to avoid re-render the app. This way the dependency in the useEffect is not gonna change, thus the function there is not called.
  const initApp = useCallback(async () => {
    try{
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    }catch(error: any){
      console.log(error);
    }
  }, [dispatch])


  // here I am using effect to get the cookie so then if there is a cookie we'll get the basket right when the app loads
  useEffect(()=>{
    initApp().then(() => setLoading(false));
  }, [initApp])

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
      <Footer />
    </ThemeProvider>
  )
}

export default App
