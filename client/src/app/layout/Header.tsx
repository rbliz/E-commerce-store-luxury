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
