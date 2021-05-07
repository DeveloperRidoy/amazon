import styles from "./Nav.module.scss";
import { BsCaretDownFill } from "react-icons/bs";
import { createRef, useContext, useEffect, useState } from "react";
import { SidebarContext } from "../../context/SidebarContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { GlobalContext } from "../../context/GlobalContext";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { cloneDeep } from "lodash";
import axios from "axios";
import SubmitButton from '../Button/SubmitButton/SubmitButton';

const Nav = () => {
  const Router = useRouter();
  const { sidebarSettings, setSidebarSettings } = useContext(SidebarContext);
  const { state, setState } = useContext(GlobalContext);
  const [removeCartLoading, setRemoveCartLoading] = useState({ loading: false, id: null });
  const searchWidthHelper = createRef(null);
  const searchWidthHelperOption = createRef(null);
  const searchTextRef = createRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchForm, setSearchForm] = useState({
    searchInput: '',
    searchCategory: 'All'
  });

  useEffect(() => {
    setSearchForm({ ...searchForm, searchInput: '' });
    setSuggestions([]);
  }, [Router.route])

  useEffect(() => {
    if (Router.query.alert && Router.query.type) {
      setState({
        ...state,
        alert: { type: Router.query.type, message: Router.query.alert },
      });
    }
  }, [Router.query])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflowY = suggestions.length > 0 ? 'hidden' : 'auto';
    }
  }, [suggestions.length])

  const inputChange = e => setSearchForm({ ...searchForm, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const cartTotal = () => {
    let total = 0;
    state.user.cart.forEach(
      (item) => (total += item.product.price * item.quantity)
    );
    return total.toFixed(2);
  };
  const removeFromCart = async (item, id) => {
    try {
      setRemoveCartLoading({loading: true, id});
      const updatedCart = cloneDeep(state.user.cart).filter(
        (cartItem) => cartItem._id !== item._id
      );

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API || "api"}/v1/users/update-me`,
        { cart: updatedCart },
        { withCredentials: true }
      );

      setRemoveCartLoading({loading: false, id: null});
      setState({ ...state, user: res.data.data.user });
    } catch (error) {
      setRemoveCartLoading({loading: false, id: null})
      setState({
        ...state,
        alert: {
          type: "danger",
          message: error.response?.message || error.message || "Network Error",
        },
      });
    }
  };

  const searchProduct = e => {
    e.preventDefault();
    Router.push(
      `/shop${
      searchForm.searchCategory !== "All"
        ? `?category=${searchForm.searchCategory}`
        : ''
      }${searchForm.searchInput !== ""
        ? searchForm.searchCategory === 'All'
          ? `?product=${searchForm.searchInput}`
          : `&product=${searchForm.searchInput}`
        : ''
      }`
    );
  }

  const suggestionsBySearchInput = e => {
    inputChange(e);
    if (e.target.value === "") {
      return setSuggestions([]);
    }
    setSuggestions(
      state.products.filter((product) =>
        searchForm.searchCategory === "All"
          ? product.name
              .split(" ")
              .join("")
              .toLowerCase()
              .includes(e.target.value.split(" ").join("").toLowerCase())
          : product.name
              .split(" ")
              .join("")
              .toLowerCase()
              .includes(e.target.value.split(" ").join("").toLowerCase()) &&
            product.category.name === searchForm.searchCategory
      )
    );
  }

  const logout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/users/logout`, {withCredentials: true});
      setState({ ...state, loggedIn: false, user: null, alert: {type: 'success', message: 'Logged out'} });
    } catch (error) {
      setState({...state, alert: {type: 'danger', message: error.response?.data?.message || error.message || 'Network Error'}})
    }
  }

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
      {/* desktop suggestions backdrop */}
      {suggestions.length > 0 && (
        <div
          className={`d-none d-md-block ${styles.suggestionsBackdrop}`}
          style={{ top: "60px" }}
          onClick={() => setSuggestions([])}
        ></div>
      )}

      {/* moblie suggestions backdrop */}
      {suggestions.length > 0 && (
        <div
          className={`d-md-none ${styles.suggestionsBackdrop}`}
          style={{ top: "90px" }}
          onClick={() => setSuggestions([])}
        ></div>
      )}

      {/* desktop topbar*/}
      <section
        className={`d-none d-md-flex py-2  justify-content-between align-items-center ${styles.topbarBackground}`}
        style={{ background: "#131921" }}
      >
        <div
          className="col d-flex justify-content-around align-items-center"
          style={{ maxWidth: "250px" }}
          onMouseOver={() => setSuggestions([])}
        >
          <Link href="/">
            <a className={styles.logoContainer}>
              <div className={styles.logo}></div>
            </a>
          </Link>
          <Link href={Router.asPath}>
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
          <form className={styles.searchBar} onSubmit={searchProduct}>
            <select
              name="searchCategory"
              value={searchForm.searchCategory}
              id="searchCategory"
              style={{ width: 50 }}
              onChange={(e) => {
                setSuggestions([]);
                searchTextRef.current.focus();
                inputChange(e);
                searchWidthHelper.current.classList.remove("d-none");
                searchWidthHelperOption.current.innerHTML = e.target.value;
                e.target.style.width =
                  searchWidthHelper.current.clientWidth + 7 + "px";
                searchWidthHelper.current.classList.add("d-none");
              }}
            >
              <option value="All">All </option>
              {state.categories.length > 0 &&
                state.categories.map((category) => (
                  <option value={category.name} key={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <select
              className="d-none"
              style={{ fontSize: "15px" }}
              ref={searchWidthHelper}
            >
              <option ref={searchWidthHelperOption}></option>
            </select>
            <input
              type="text"
              ref={searchTextRef}
              name="searchInput"
              autoComplete="off"
              value={searchForm.searchInput}
              className={styles.searchText}
              onChange={suggestionsBySearchInput}
            />
            {suggestions.length > 0 && (
              <div
                className={styles.suggestions}
                style={{ left: 50, width: "90%" }}
              >
                {suggestions.map((product) => (
                  <Link
                    href={`/shop/${product.category.name}/${product.slug}`}
                    key={product._id}
                  >
                    <a
                      onClick={() => {
                        setSuggestions([]);
                        setSearchForm({ ...searchForm, searchInput: "" });
                      }}
                    >
                      {product.name}
                    </a>
                  </Link>
                ))}
              </div>
            )}
            <div className={styles.submitContainer}>
              <input type="submit" value="" className={styles.search} />
            </div>
          </form>
        </div>
        <div
          className="col d-flex justify-content-around align-items-center"
          style={{ maxWidth: "400px" }}
          onMouseOver={() => setSuggestions([])}
        >
          <div className={`${styles.lngChange} col`}>
            <div className={styles.lngChangeTitle}>EN</div>
            <div className={styles.lngChangeOptions}>
              <p>
                Change Language
                <Link href={Router.asPath}>
                  <a style={{ color: "#1aa8d6" }}>learn more</a>
                </Link>
              </p>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href={Router.asPath}>
                    <a>english</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href={Router.asPath}>
                    <a>bangla</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href={Router.asPath}>
                    <a>arabic</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href={Router.asPath}>
                    <a>australian</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href={Router.asPath}>
                    <a>spanish</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href={Router.asPath}>
                    <a>chinese</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <button
            className={`col ${styles.account}`}
            onClick={() => Router.push(state.loggedIn ? "/my-account" : "/login")}
          >
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
            {state.loggedIn && state.user && (
              <div className={styles.accountOptions} onClick={e => e.stopPropagation()}>
                <ul className="list-group">
                  {state.user?.role === "ADMIN" && (
                    <li className="list-group-item">
                      <Link href="/admin">
                        <a>Admin</a>
                      </Link>
                    </li>
                  )}
                  <li className="list-group-item">
                    <Link href="/my-account">
                      <a>Your account</a>
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <Link href="/my-account/profile">
                      <a>Your profile</a>
                    </Link>
                  </li>
                  <li className="list-group-item" onClick={logout}>
                    <Link href={Router.asPath}>
                      <a>Logout</a>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </button>
          <Link href={Router.asPath}>
            <a className="col">
              <div>Returns</div>
              <div>
                <strong style={{ whiteSpace: "nowrap" }}>& Orders</strong>
              </div>
            </a>
          </Link>
          <Link href="/cart">
            <a className={styles.cart}>
              <div className={styles.cartIcon}>
                <div className={styles.cartCount}>
                  {state.user?.cart?.length || 0}
                </div>
              </div>
              <div className="d-none d-lg-block">
                <strong>Cart</strong>
              </div>
              {state.user?.cart?.length > 0 && (
                <div
                  className={styles.cartPreview}
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="border-bottom">
                    {state.user.cart.map((item) => (
                      <div className="d-flex border-bottom mb-2" key={item._id}>
                        <SubmitButton
                          className="p-0 bg-dark text-white mr-1 mt-1 d-flex align-items-center justify-content-center"
                          spinColor="white"
                          loading={
                            removeCartLoading.loading &&
                            removeCartLoading.id === item._id
                          }
                          style={{ height: 16, width: 16, borderRadius: "50%" }}
                          onClick={() => removeFromCart(item, item._id)}
                        >
                          {removeCartLoading.id !== item._id && <FaTimes />}
                        </SubmitButton>
                        <div>
                          <h5>{item.product.name}</h5>
                          <h6 className="d-flex align-items-center">
                            {item.quantity} <FaTimes /> ${item.product.price}
                          </h6>
                        </div>
                        <img
                          src={`/img/products/${
                            item.product?.coverPhoto || "product.png"
                          }`}
                          alt={item.product.name}
                          className="p-1 shadow ml-auto"
                          style={{ height: 50, width: 50 }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <h4 className="mb-3">Subtotal: ${cartTotal()}</h4>
                    <button
                      className="btn btn-dark col mb-2 py-3"
                      onClick={() => Router.push("/cart")}
                    >
                      View cart <FaArrowRight />
                    </button>
                    <button
                      className="btn btn-secondary col mb-2 py-3"
                      onClick={() => Router.push("/checkout")}
                    >
                      Checkout <FaArrowRight />
                    </button>
                  </div>
                </div>
              )}
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
            <Link href="/cart">
              <a className={styles.cartIcon}>
                <div className={styles.cartCount}>
                  {state.user?.cart?.length || 0}
                </div>
              </a>
            </Link>
          </div>
        </div>
        <div className="px-3">
          <form className={styles.searchBar}>
            <input
              type="text"
              name="searchInput"
              onChange={suggestionsBySearchInput}
              className={styles.searchText}
            />
            {suggestions.length > 0 && (
              <div
                className={styles.suggestions}
                style={{ left: 0, width: "100%" }}
              >
                {suggestions.map((product) => (
                  <Link
                    href={`/shop/${product.category.name}/${product.slug}`}
                    key={product._id}
                  >
                    <a
                      onClick={() => {
                        setSuggestions([]);
                        setSearchForm({ ...searchForm, searchInput: "" });
                      }}
                    >
                      {product.name}
                    </a>
                  </Link>
                ))}
              </div>
            )}
            <div className={styles.submitContainer}>
              <input
                type="submit"
                value=""
                className={styles.search}
                onClick={searchProduct}
              />
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
          <Link href={Router.asPath}>
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
          <Link href={Router.asPath}>
            <a> Todays Deals</a>
          </Link>
          <Link href={Router.asPath}>
            <a> Customer Service</a>
          </Link>
          <Link href={Router.asPath}>
            <a> Gift Cards</a>
          </Link>
          <Link href={Router.asPath}>
            <a> Sell</a>
          </Link>
          <Link href={Router.asPath}>
            <a> Registry</a>
          </Link>
        </div>
        <Link href={Router.asPath}>
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
        <Link href={Router.asPath}>
          <a className="mx-3"> Todays Deals</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Customer Service</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Gift Cards</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Sell</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Registry</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Todays Deals</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Customer Service</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Gift Cards</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Sell</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Registry</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Todays Deals</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Customer Service</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Gift Cards</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Sell</a>
        </Link>
        <Link href={Router.asPath}>
          <a className="mx-3"> Registry</a>
        </Link>
      </section>
    </div>
  );
};

export default Nav;
