import { createContext, useEffect, useState } from "react"
import axios from 'axios';
export const SidebarContext = createContext();

const SidebarContextProvider = ({ children }) => {

    const [sidebarSettings, setSidebarSettings] = useState({
      show: null,
      sidebarMenu: null,
      loading: true,
      showSubmenu: null,
      currentSubmenu: null
    });
  
    useEffect(async () => {
        try {
            const sidebarMenu = (await axios.get(`${process.env.NEXT_PUBLIC_API || '/api'}/v1/menus/menu/sidebar-menu`)).data.data.menu;
            setSidebarSettings({ ...sidebarSettings, loading: false, sidebarMenu });
        
        } catch (error) {
            setSidebarSettings(prevState => ({ ...prevState, loading: false }));
        }
    }, []);
  
    return (
        <SidebarContext.Provider value={{sidebarSettings, setSidebarSettings}}>
            {children}
        </SidebarContext.Provider>
    )
}

export default SidebarContextProvider;