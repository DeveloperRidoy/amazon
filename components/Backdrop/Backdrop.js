import { useContext } from "react"
import { SidebarContext } from "../../context/SidebarContext"
import styles from './Backdrop.module.scss';

function Backdrop () {
    const { sidebarSettings, setSidebarSettings } = useContext(SidebarContext);
    const { show } = sidebarSettings;
    return (
        <div className={`${styles.backdrop} ${show && styles.showBackdrop}`} onClick={() => setSidebarSettings({...sidebarSettings, show: false})}>
        </div>
    )
}

export default Backdrop
