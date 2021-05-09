import { useContext } from 'react';
import { SidebarContext } from '../../../context/SidebarContext';
import styles from '../Sidebar.module.scss';
import Link from "next/link";
import { GlobalContext } from '../../../context/GlobalContext';
import axios from 'axios';
import { useRouter } from 'next/router';

function SidebarItem ({ title, links, seeAllOption, chevron, fullStoreDirectory }) {
  const Router = useRouter();
  const { sidebarSettings, setSidebarSettings } = useContext(SidebarContext);

  const { setState } = useContext(GlobalContext);
  const stateChange = async (link) => {
    // for links with submenu
    if (chevron) return setSidebarSettings({ ...sidebarSettings, showSubmenu: true, currentSubmenu: link.submenus })

    // for links without submenu
    if (!link.logOut) return setSidebarSettings({...sidebarSettings, show: false});
    
    // For logout button
    try {
      setSidebarSettings({...sidebarSettings, loading: true});
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/v1/users/logout`, { withCredentials: true });
      setSidebarSettings({ ...sidebarSettings, loading: false });
      setState(prevState => ({ ...prevState, loggedIn: false, user: null, alert: { type: 'success', message: res.data.message, timeOut: 2000 } }));
      
    } catch (error) {
      const message = error.response
        ? error.response.status === 500
          ? 'Server Error'
          : error.response.data.message
        : 'Network Error';
      setState(prevState => ({...prevState, alert:{type: 'danger', message}}))
    }

  }

  return (
      <div className="pb-4">
        <h4 className="pl-5 font-weight-bold">{title}</h4>
        {links?.length > 0 &&
          links.map((link) => (
            <Link href={link.link === '#' ? Router.asPath : link.link || Router.asPath} key={link._id}>
              <a
              className={styles.menuItem}
              onClick={() => stateChange(link)}
              >
                <p>{link.text}</p>
                {chevron && <div className={`${styles.chevronRight} mr-4`}></div>}
              </a>
            </Link>
          ))}
        {seeAllOption && (
          <Link href={Router.asPath}><a className={styles.menuItem}>
            <div className="d-flex align-items-center">
              <span className="mr-2">See All</span>
              <div className={styles.chevronDown}></div>
            </div>
          </a></Link>
        )}
        {fullStoreDirectory && (
          <Link href={Router.asPath}><a className={styles.menuItem} >
            <h4>Full Store Directory</h4>
          </a></Link>
        )}
        <div className="border-bottom pt-2"></div>
      </div>
    );
}

export default SidebarItem
