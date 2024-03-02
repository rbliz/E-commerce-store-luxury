import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./styles.css"

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
      <CssBaseline />
      <Header />
      <Container>
        <Catalog />
      </Container>
    </ThemeProvider>
  )
}

export default App
