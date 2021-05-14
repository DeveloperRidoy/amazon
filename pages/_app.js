import Backdrop from '../components/Backdrop/Backdrop';
import Footer from '../components/Footer/Footer'
import Nav from '../components/nav/Nav'
import Sidebar from '../components/Sidebar/Sidebar';
import GlobalContextProvider from '../context/GlobalContext';
import SidebarContextProvider from '../context/SidebarContext';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
        <SidebarContextProvider>
          <Nav />
          <Sidebar />
          <Backdrop />
        </SidebarContextProvider>
        <div className="mx-auto" style={{ maxWidth: "1350px", position: 'relative' }}>
          <Component {...pageProps} />
        </div>
        <Footer />
    </GlobalContextProvider>
  );
}

export default MyApp
