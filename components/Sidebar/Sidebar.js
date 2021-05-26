import { motion } from "framer-motion";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { SidebarContext } from "../../context/SidebarContext";
import Spinner from "../Spinners/Spinner";
import styles from "./Sidebar.module.scss";
import SidebarItem from "./SidebarItem/SidebarItem";
import { useRouter } from "next/router";

function Sidebar() {
  const Router = useRouter();
  const { sidebarSettings, setSidebarSettings } = useContext(SidebarContext);
  const { show, showSubmenu, currentSubmenu, loading, sidebarMenu } =
    sidebarSettings;
  const { state } = useContext(GlobalContext);

  useEffect(() => {
    // disable scrolling when sidebar is open
    document.body.style.cssText = `overflow: ${show ? "hidden" : "auto"}`;
  }, [show]);

  return (
    <motion.div
      className={`${styles.sidebar} col px-0`}
      initial={{ position: "absolute", top: 0, left: "-100%" }}
      animate={
        show ? { left: 0, transition: { duration: 0.4 } } : { left: "-100%" }
      }
    >
      <div
        className="pl-5 pr-2 py-3 d-flex align-items-center justify-content-between"
        style={{ background: "#232F3E" }}
      >
        <Link href={state.loggedIn ? "/my-account" : "/login"}>
          <div
            className="d-flex align-items-center"
            onClick={() =>
              setSidebarSettings((prevState) => ({ ...prevState, show: false }))
            }
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                state.loggedIn
                  ? `/img/users/${state.user.photo || "user.jpg"}`
                  : "/img/users/user.jpg"
              }
              alt={state.loggedIn ? state.user.firstName : "user"}
              className={styles.user}
            />
            <h3 className="text-white mb-0 ml-2">
              Hello, {state.loggedIn ? state.user.firstName : "Sign in"}
            </h3>
          </div>
        </Link>
        <motion.div
          whileHover={{ rotate: 90, cursor: "pointer" }}
          className={`${styles.cross}`}
          onClick={() =>
            setSidebarSettings({ ...sidebarSettings, show: false })
          }
        ></motion.div>
      </div>
      <div
        className="py-4"
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          height: "100%",
          position: "relative",
        }}
      >
        {loading ? (
          <Spinner
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : (
          <>
            <motion.div //main menu
              initial={{
                position: "absolute",
                top: 0,
                left: 0,
                padding: "15px 0 0 0",
                width: "100%",
              }}
              animate={showSubmenu ? { left: "-100%" } : { left: 0 }}
            >
              {sidebarMenu &&
                sidebarMenu.menus.map((menu) => (
                  <SidebarItem
                    key={menu._id}
                    title={menu.title}
                    chevron
                    links={menu.options}
                  />
                ))}
              <SidebarItem
                title="Help & Features"
                links={[
                  { text: "Your Account", link: "/my-account", _id: "1" },
                  { text: "Language Options", _id: "2" },
                  { text: "Change Region", _id: "3" },
                  state.loggedIn
                    ? { text: "Log out", logOut: true, _id: "4" }
                    : { text: "Log in", link: "/login", _id: "4" },
                ]}
              />
            </motion.div>

            <motion.div //submenu
              initial={{
                position: "absolute",
                left: "100%",
                top: 0,
                width: "100%",
              }}
              animate={showSubmenu ? { left: 0 } : { left: "100%" }}
            >
              <Link href={Router.asPath}>
                <a
                  className={`${styles.menuItem} border-bottom py-3 mb-3`}
                  onClick={() => {
                    setSidebarSettings({
                      ...sidebarSettings,
                      showSubmenu: false,
                    });
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className={styles.chevronArrowLeft}></div>
                    <h5 className="font-weight-bold mb-0 ml-3">MAIN MENU</h5>
                  </div>
                </a>
              </Link>
              {showSubmenu &&
                currentSubmenu &&
                currentSubmenu.length > 0 &&
                currentSubmenu.map((menu) => (
                  <SidebarItem
                    key={menu._id}
                    title={menu.title}
                    links={menu.options}
                  />
                ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Sidebar;
