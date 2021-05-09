import { motion } from "framer-motion";
import { useRouter } from 'next/router'
import styled from "styled-components";
import {  createContext, createRef, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { FaUserCog, FaBoxOpen, FaUser, FaDollarSign } from "react-icons/fa";
import { BsSearch, BsArrowsFullscreen, BsFullscreenExit, BsBellFill, BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';
import Image from "next/image";
import Link from "next/link";
import ProductSettings from "../components/admin/ProductSettings";
import { ORDER_SETTINGS, PRODUCT_SETTINGS, USER_SETTINGS } from "../utils/variables";
import UserSettings from "../components/admin/UserSettings";
import OrderSettings from "../components/admin/OrderSettings";
import axios from 'axios';

export const AdminContext = createContext();

export const LayoutRef = createRef(null)

function Admin () {
  const Router = useRouter();
  const { state, setState } = useContext(GlobalContext);
  const [fullScreen, setFullScreen] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSettings, setShowSettings] = useState({ show: true, setting: PRODUCT_SETTINGS });
  const [adminBar, setAdminBar] = useState({
    collapse: null,
    width: 300,
    collapseWidth: 50,
    window: window.innerWidth
  });

  useEffect(() => {
    window.addEventListener('resize', () => setAdminBar({ ...adminBar, width: window.innerWidth < 576 ? window.innerWidth : 300, window: window.innerWidth }));
  }, [])

  useEffect(() => {
    !state.loggedIn && Router.replace('/login');
    state.user?.role !== 'ADMIN' && Router.back();
  }, [state.loggedIn, state.user])

  useEffect(async () => {
    const el = document.documentElement;
    fullScreen !== null && document
      ? fullScreen === true
        ? el.requestFullscreen
          ? await el.requestFullscreen()
          : el.webkitRequestFullscreen
          ? await el.webkitRequestFullscreen()
          : el.msRequestFullscreen
          ? await el.msRequestFullscreen()
          : ""
        : document.fullscreenElement !== null && document.exitFullscreen
          ? await document.exitFullscreen()
          : document.webkitExitFullscreen
          ? await document.webkitExitFullscreen
          : document.msExitFullscreen
          ? await document.msExitFullscreen()
          : ""
      : "";
  }, [fullScreen]);

  const logout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/users/logout`, {withCredentials: true});
      setState({ ...state, loggedIn: false, user: null, alert: {type: 'success', message: 'Logged out'} });
    } catch (error) {
      setState({...state, alert: {type: 'danger', message: error.response?.data?.message || error.message || 'Network Error'}})
    }
  }  

  return (
    <div>
      {state.user && state.user?.role === 'ADMIN'
        ? (
          <AdminContext.Provider value={{ LayoutRef }}>
      <AdminBar
        initial={{ width: adminBar.width }}
        animate={{ width: adminBar.width, transition: { duration: 0.5 } }}
      >
        <div
          className={`d-flex align-items-center pb-3 border-bottom px-2`}
        >
          {!adminBar.collapse && (
            <>
              <div style={{ width: 15 }} className="mr-4">
                <FaUserCog
                  style={{
                    background: "white",
                    fontSize: "30px",
                    padding: "5px",
                    borderRadius: "5px",
                    boxShadow: "0 0 15px rgba(0, 0, 0, .3)",
                  }}
                />
              </div>
              <h3 className="ml-3 mb-0">Dashboard</h3>
            </>
          )}
          {adminBar.collapse ? (
            <BsArrowBarRight
              style={{
                background: "white",
                fontSize: "30px",
                padding: "5px",
                borderRadius: "5px",
                boxShadow: "0 0 15px rgba(0, 0, 0, .3)",
                marginLeft: adminBar.collapse ? 0 : "auto",
                cursor: "pointer",
              }}
              onClick={() =>
                setAdminBar({
                  ...adminBar,
                  collapse: false,
                  width: adminBar.window > 576 ? 300 : adminBar.window,
                })
              }
            />
          ) : (
            <BsArrowBarLeft
              style={{
                background: "white",
                fontSize: "30px",
                padding: "5px",
                borderRadius: "5px",
                boxShadow: "0 0 15px rgba(0, 0, 0, .3)",
                marginLeft: adminBar.collapse ? 0 : "auto",
                cursor: "pointer",
              }}
              onClick={() =>
                setAdminBar({
                  ...adminBar,
                  collapse: true,
                  width: adminBar.collapseWidth,
                })
              }
            />
          )}
        </div>
        <div className={`mt-3 h-100 px-2`}>
          <div
            className="menu-item"
            onClick={() =>
              setShowSettings({
                ...showSettings,
                show: true,
                setting: PRODUCT_SETTINGS,
              })
            }
          >
            <div style={{ width: 15 }} className="mr-4">
              <FaBoxOpen
                style={{
                  background: "white",
                  fontSize: "30px",
                  padding: "5px",
                  borderRadius: "5px",
                  boxShadow: "0 0 15px rgba(0, 0, 0, .3)",
                }}
              />
            </div>
            {!adminBar.collapse && <h4 className="mb-0 ml-3">Products</h4>}
          </div>
          <div
            className="menu-item"
            onClick={() =>
              setShowSettings({
                ...showSettings,
                show: true,
                setting: USER_SETTINGS,
              })
            }
          >
            <div style={{ width: 15 }} className="mr-4">
              <FaUser
                style={{
                  background: "white",
                  fontSize: "30px",
                  padding: "5px",
                  borderRadius: "5px",
                  boxShadow: "0 0 15px rgba(0, 0, 0, .3)",
                }}
              />
            </div>
            {!adminBar.collapse && <h4 className="mb-0 ml-3">Users</h4>}
          </div>
          <div
            className="menu-item"
            onClick={() =>
              setShowSettings({
                ...showSettings,
                show: true,
                setting: ORDER_SETTINGS,
              })
            }
          >
            <div style={{ width: 15 }} className="mr-4">
              <FaDollarSign
                style={{
                  background: "white",
                  fontSize: "30px",
                  padding: "5px",
                  borderRadius: "5px",
                  boxShadow: "0 0 15px rgba(0, 0, 0, .3)",
                }}
              />
            </div>
            {!adminBar.collapse && <h4 className="mb-0 ml-3">Orders</h4>}
          </div>
        </div>
      </AdminBar>
      <Layout
        ref={LayoutRef}
        initial={{ marginLeft: adminBar.width }}
        animate={{ marginLeft: adminBar.width, transition: { duration: 0.5 } }}
        onClick={() => {
          showSearchBar && setShowSearchBar(!showSearchBar);
          showAccountOptions && setShowAccountOptions(false);
          showNotification && setShowNotification(false);
        }}
      >
        <motion.div
          className="menu"
          initial={{ left: adminBar.width }}
          animate={{ left: adminBar.width, transition: { duration: 0.5 } }}
        >
          <div
            className="d-flex align-items-center"
            style={{ position: "relative" }}
          >
            {fullScreen ? (
              <BsFullscreenExit
                style={{ fontSize: 20, cursor: "pointer" }}
                onClick={() => setFullScreen(false)}
              />
            ) : (
              <BsArrowsFullscreen
                style={{ fontSize: 20, cursor: "pointer" }}
                onClick={() => setFullScreen(true)}
              />
            )}
            <BsSearch
              style={{ fontSize: 20, marginLeft: "50px", cursor: "pointer" }}
              onClick={() => setShowSearchBar(!showSearchBar)}
            />
            <SearchBar
              initial={{ scale: 0 }}
              animate={showSearchBar ? { scale: 1 } : { scale: 0 }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search Here.."
                onClick={(e) => e.stopPropagation()}
              />
            </SearchBar>
          </div>
          <div className="d-flex align-items-center">
            <Bell>
              <BsBellFill
                style={{ marginRight: "20px", fontSize: 20, cursor: "pointer" }}
                onClick={() => setShowNotification(!showNotification)}
              />
              <motion.div
                className="popup"
                initial={{ scale: 0 }}
                animate={showNotification ? { scale: 1 } : { scale: 0 }}
              >
                <Link href="/my-account">
                  <a className="mb-3">Notification</a>
                </Link>
              </motion.div>
            </Bell>
            <Account
              onClick={() => {
                setShowAccountOptions(!showAccountOptions);
              }}
            >
              <Image
                src={`/img/users/${
                  state.user?.photo ? state.user.photo : "user.jpg"
                }`}
                alt={state.user ? state.user.name : "user"}
                width="40"
                height="40"
                className="rounded-circle"
              />
              <motion.div
                className="popup"
                initial={{ scale: 0 }}
                animate={showAccountOptions ? { scale: 1 } : { scale: 0 }}
              >
                <Link href="/">
                  <a className="mb-3">Home</a>
                </Link>
                <Link href="/my-account">
                  <a className="mb-3">Account</a>
                </Link>
                <button
                  className="logout"
                  onClick={logout}
                >
                  Logout
                </button>
              </motion.div>
            </Account>
          </div>
        </motion.div>
        <div className="p-3" style={{ marginTop: 65 }}>
          {showSettings.show && showSettings.setting === PRODUCT_SETTINGS && (
            <ProductSettings />
          )}
          {showSettings.show && showSettings.setting === USER_SETTINGS && (
            <UserSettings />
          )}
          {showSettings.show && showSettings.setting === ORDER_SETTINGS && (
            <OrderSettings />
          )}
        </div>
      </Layout>
    </AdminContext.Provider>
        ) : ''}
    </div>
  );
}  

export default Admin;


const AdminBar = styled(motion.div)`
  position: fixed;
  overflow: hidden;
  top: 0;
  bottom: 0;
  left: 0;
  box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
  padding: 10px 0;
  z-index: 2;
  width: 100%;
  background: white; 
  .menu-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0 0 10px 0;
    :hover {
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    }
  }
`;

const Layout = styled(motion.div)`
  scroll-behavior: smooth;
  scroll-padding-top: 100px;
  position: relative;
  height: 100vh;
  overflow-y: auto;
  .menu {
    z-index: 4;
    color: white;
    background: #2c3e50;
    padding: 10px 15px;
    display: flex;
    position: fixed;
    right: 0;
    top: 0;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchBar = styled(motion.div)`
  padding: 15px 15px;
  border-radius: 5px;
  background: white;
  input {
    font-size: 15px;
  }
  position: absolute;
  top: 34px;
  left: 53px;
  width: 225px;
  box-shadow: 0 0 15px rgb(0, 0, 0, 0.3);
  ::before {
    position: absolute;
    content: "";
    border-top: 10px solid transparent;
    border-left: 10px solid transparent;
    border-bottom: 10px solid white;
    border-right: 10px solid transparent;
    top: -19px;
    left: 17px;
  }
`;
const Account = styled.div`
  position: relative;
  cursor: pointer;
  ::before {
    position: absolute;
    content: "";
    top: 30px;
    left: 26px;
    z-index: 1;
    border-radius: 50%;
    border: 6px solid #2ed573;
  }
  .popup {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    font-size: 15px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 52px;
    right: 0;
    background: white;
    color: black;
    min-width: 132px;
    padding: 10px;
    .logout {
      background: white;
      border: none;
      border-radius: 5px;
      padding: 5px 15px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
      width: max-content;
      :active {
        transform: scale(0.9);
      }
    }
    ::before {
      position: absolute;
      content: "";
      border-top: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: 10px solid white;
      border-right: 10px solid transparent;
      top: -19px;
      right: 10px;
    }
  }
`;

const Bell = styled.div`
  position: relative;
  ::before {
    position: absolute;
    content: "";
    top: -2px;
    left: 11px;
    z-index: 1;
    border-radius: 50%;
    border: 4px solid #2ed573;
  }
  .popup {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    font-size: 15px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 40px;
    right: 0;
    background: white;
    color: black;
    min-width: 246px;
    padding: 10px;
    ::before {
      position: absolute;
      content: "";
      border-top: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: 10px solid white;
      border-right: 10px solid transparent;
      top: -19px;
      right: 19px;
    }
  }
`;