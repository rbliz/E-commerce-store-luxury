// import { ShoppingBagRounded } from "@mui/icons-material";
// import { AppBar, Badge, Box, IconButton, List, ListItem, Toolbar, Typography } from "@mui/material";
// import { Link, NavLink } from "react-router-dom";
// // import { useStoreContext } from "../context/StoreContext";
// import { useAppSelector } from "../store/configureStore";
// import SignedInMenu from "./SignedInMenu";
import DesktopToolbar from "../components/DesktopToolbar";
import MediaQuery from 'react-responsive'
import MobileToolbar from "../components/MobileToolbar";
                
export default function Header(){
    return(
    <>
        <MediaQuery minWidth={600}>
            <DesktopToolbar />
        </MediaQuery>
        <MediaQuery maxWidth={599}>
            <MobileToolbar />
        </MediaQuery>
    </>
)
}
