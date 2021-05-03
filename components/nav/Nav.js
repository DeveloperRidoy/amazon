import styles from "./Nav.module.scss";
import { BsCaretDownFill } from "react-icons/bs";
import { useContext } from "react";
import { SidebarContext } from "../../context/SidebarContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { GlobalContext } from "../../context/GlobalContext";

const Nav = () => {
  const Router = useRouter();
  const { sidebarSettings, setSidebarSettings } = useContext(SidebarContext);
  const { state } = useContext(GlobalContext);

  return (
    <div
      className={`${
        Router.route === "/login"
          ? "d-none"
          : Router.route === "/signup"
          ? "d-none"
          : Router.route === "/admin"
          ? "d-none"
          : styles.nav
      }`}
    >
      {/* desktop topbar*/}
      <section
        className={`d-none d-md-flex py-2  justify-content-between align-items-center ${styles.topbarBackground}`}
        style={{ background: "#131921" }}
      >
        <div
          className="col d-flex justify-content-around align-items-center"
          style={{ maxWidth: "250px" }}
        >
          <Link href="/">
            <a className={styles.logoContainer}>
              <div className={styles.logo}></div>
            </a>
          </Link>
          <Link href="#">
            <a className="col d-flex align-items-end">
              <div className={styles.location}></div>
              <div>
                Deliver to
                <div>
                  <strong>Bangladesh</strong>
                </div>
              </div>
            </a>
          </Link>
        </div>
        <div className="col">
          <form className={styles.searchBar}>
            <select
              name="select-category"
              onChange={(e) => (e.target.style.width = "auto")}
            >
              <option value="All">All </option>
              <option value="Toys">ToysToy</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronic">Electronic</option>
              <option value="Automotive">Automotive</option>
              <option value="Smartphone">Smartphone</option>
            </select>
            <input type="text" name="search" className={styles.searchText} />
            <div className={styles.submitContainer}>
              <input type="submit" value="" className={styles.search} />
            </div>
          </form>
        </div>
        <div
          className="col d-flex justify-content-around align-items-center"
          style={{ maxWidth: "400px" }}
        >
          <div className={`${styles.lngChange} col`}>
            <div className={styles.lngChangeTitle}>EN</div>
            <div className={styles.lngChangeOptions}>
              <p>
                Change Language
                <Link href="#">
                  <a style={{ color: "#1aa8d6" }}>learn more</a>
                </Link>
              </p>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="#">
                    <a>english</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="#">
                    <a>bangla</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="#">
                    <a>arabic</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="#">
                    <a>australian</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="#">
                    <a>spanish</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="#">
                    <a>chinese</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link href={`${state.loggedIn ? "/my-account" : "/login"}`}>
            <a className="col">
              <div style={{ whiteSpace: "nowrap" }}>
                Hello, {state.loggedIn ? state.user.firstName : "Sign in"}
              </div>
              <div className="d-flex">
                <div style={{ whiteSpace: "nowrap", position: "relative" }}>
                  <strong>
                    Account
                    <span className="d-none d-lg-inline">& Lists</span>
                  </strong>
                  <div className=""></div>
                </div>
                <div>
                  <BsCaretDownFill />
                </div>
              </div>
            </a>
          </Link>
          <Link href="#">
            <a className="col">
              <div>Returns</div>
              <div>
                <strong style={{ whiteSpace: "nowrap" }}>& Orders</strong>
              </div>
            </a>
          </Link>
          <Link href="/cart">
            <a className="col mr-4 d-flex align-items-end">
              <div className={styles.cart}>
                <div className={styles.cartCount}>{state.user.cart.length}</div>
              </div>
              <div className="d-none d-lg-block">
                <strong>Cart</strong>
              </div>
            </a>
          </Link>
        </div>
      </section>

      {/* mobile topbar */}
      <section className={`d-md-none ${styles.topbarBackground}`}>
        <div className="d-flex py-2 px-4 justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div
              className={styles.hamBurger}
              onClick={() =>
                setSidebarSettings({ ...sidebarSettings, show: true })
              }
            ></div>
            <Link href="/">
              <a className={styles.logoContainer}>
                <div className={styles.logo}></div>
              </a>
            </Link>
          </div>
          <div className="d-flex align-items-center">
            {!state.loggedIn && (
              <Link href="/login">
                <a>
                  <h5>Sign in</h5>
                </a>
              </Link>
            )}
            <Link href="#">
              <a className={styles.cart}>
                <div className={styles.cartCount}>{state.user.cart.length}</div>
              </a>
            </Link>
          </div>
        </div>
        <div className="px-3">
          <form className={styles.searchBar}>
            <input type="text" name="search" className={styles.searchText} />
            <div className={styles.submitContainer}>
              <input type="submit" value="" className={styles.search} />
            </div>
          </form>
        </div>
      </section>
      <section
        className="d-none p-2 d-md-flex justify-content-between align-items-center "
        style={{
          background: "#232F3E",
          fontWeight: 500,
          fontSize: "14px",
        }}
      >
        <div
          className="col-lg-7 col-md-9 d-flex justify-content-between align-items-center"
          style={{ maxWidth: "660px" }}
        >
          <Link href="#">
            <a
              className="d-flex align-items-center"
              onClick={() =>
                setSidebarSettings({ ...sidebarSettings, show: true })
              }
            >
              <div className={styles.hamBurger}></div>
              <div className="ml-1">All</div>
            </a>
          </Link>
          <Link href="/shop">
            <a> Shop</a>
          </Link>
          <Link href="#">
            <a> Todays Deals</a>
          </Link>
          <Link href="#">
            <a> Customer Service</a>
          </Link>
          <Link href="#">
            <a> Gift Cards</a>
          </Link>
          <Link href="#">
            <a> Sell</a>
          </Link>
          <Link href="#">
            <a> Registry</a>
          </Link>
        </div>
        <Link href="#">
          <a>Amazon's response to COVID-19</a>
        </Link>
      </section>
      <section
        className="d-md-none p-3 d-flex align-items-center justify-content-between"
        style={{
          background: "#232F3E",
          fontWeight: "bold",
          fontSize: "14px",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <Link href="/shop">
          <a> Shop</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Todays Deals</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Customer Service</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Gift Cards</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Sell</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Registry</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Todays Deals</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Customer Service</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Gift Cards</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Sell</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Registry</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Todays Deals</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Customer Service</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Gift Cards</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Sell</a>
        </Link>
        <Link href="#">
          <a className="mx-3"> Registry</a>
        </Link>
      </section>
    </div>
  );
};

export default Nav;
