import styles from "./Footer.module.scss";
import { FaGlobe, FaFlagUsa } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";

function Footer() {
  const Router = useRouter();

  return (
    <div
      className={`${
        Router.route === "/login"
          ? "d-none"
          : Router.route === "/signup"
          ? "d-none"
          : Router.route === "/admin"
          ? "d-none"
          : styles.footer
      }`}
    >
      <div className={styles.backToTop} onClick={() => window.scrollTo(0, 0)}>
        <h5>Back to top</h5>
      </div>
      <div className="p-5" style={{ background: "#232F3E" }}>
        <div
          className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 mx-auto text-nowrap"
          style={{ maxWidth: "1000px", fontSize: "14px" }}
        >
          <div className="col mb-5">
            <div className="col-8 d-flex flex-column d-sm-block">
              <h5 className="mb-3">Get to Know Us</h5>
              <div className="d-flex flex-wrap flex-row flex-sm-column">
                <Link href="/shop">
                  <a className="mb-1">Careers</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Blog</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">About Amazon</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Investor Relations</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Amazon Devices</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Amazon Tours</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="col mb-5">
            <div className="col-8 d-flex flex-column d-sm-block">
              <h5 className="mb-3">Make Money with Us</h5>
              <div className="d-flex flex-wrap flex-row flex-sm-column">
                <Link href="/shop">
                  <a className="mb-1">Sell products on Amazon</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Sell on Amazon Business</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Sell apps on Amazon</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Become an Affiliate</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Advertise Your Products</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Self-Publish-with-Us</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Host an Amazon Hub</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">› See More Make Money with Us</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="col mb-5">
            <div className="col-8 d-flex flex-column d-sm-block">
              <h5 className="mb-3">Amazon Payment Products</h5>
              <div className="d-flex flex-wrap flex-row flex-sm-column">
                <Link href="/shop">
                  <a className="mb-1">Amazon Payment Cards</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Shop with Points</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Reload Your Balance</a>
                </Link>
                <Link href="/shop">
                  <a className="mb-1">Amazon Currency Converter</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="col mb-5">
            <div className="col-8 d-flex flex-column d-sm-block">
              <h5 className="mb-3">Let Us Help You</h5>
              <div className="d-flex flex-wrap flex-row flex-sm-column justify-content-start align-items-start">
                <Link href="/shop">
                  <a href="/shop" className="mb-1">
                    Amazon and COVID-19
                  </a>
                </Link>
                <Link href="/shop">
                  <a href="/shop" className="mb-1">
                    Your Account
                  </a>
                </Link>
                <Link href="/shop">
                  <a href="/shop" className="mb-1">
                    Your Orders
                  </a>
                </Link>
                <Link href="/shop">
                  <a href="/shop" className="mb-1">
                    Shipping Rates & Policies
                  </a>
                </Link>
                <Link href="/shop">
                  <a href="/shop" className="mb-1">
                    Returns & Replacements
                  </a>
                </Link>
                <Link href="/shop">
                  <a href="/shop" className="mb-1">
                    Managing Your Content & Devices
                  </a>
                </Link>
                <Link href="/shop">
                  <a href="/shop" className="mb-1">
                    Amazon Assistant
                  </a>
                </Link>
                <Link href="/shop">
                  <a href="/shop" className="mb-1">
                    Help
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="p-5 border-top border-secondary"
        style={{ background: "#232F3E", fontSize: "15px" }}
      >
        <div
          className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-center"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <Link href="/shop">
            <a className={`${styles.logoContainer} mb-3 mb-sm-0`}>
              <div className={styles.logo}></div>
            </a>
          </Link>
          <div className="d-flex flex-column flex-sm-row justify-content-around">
            <div
              className="p-2 mx-1 d-flex  align-items-center"
              style={{
                border: "1px solid rgba(255, 255, 255, .5)",
                borderRadius: "3px",
              }}
            >
              <FaGlobe />
              <div className="ml-2">English</div>
            </div>
            <div
              className="p-2 mx-1"
              style={{
                border: "1px solid rgba(255, 255, 255, .5)",
                borderRadius: "3px",
              }}
            >
              $ USD-U.S.Dollar
            </div>
            <div
              className="p-2 mx-1 d-flex justify-content-between align-items-center"
              style={{
                border: "1px solid rgba(255, 255, 255, .5)",
                borderRadius: "3px",
              }}
            >
              <FaFlagUsa />
              <div className="ml-2">United States</div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5" style={{ background: "#131921" }}>
        <div
          style={{ maxWidth: "700px", margin: "0 auto", fontSize: "13px" }}
          className="d-flex flex-column flex-sm-row justify-content-around"
        >
          <Link href="/shop">
            <a href="/shop">Conditions of Use</a>
          </Link>
          <Link href="/shop">
            <a href="/shop">Privacy Notice</a>
          </Link>
          <Link href="/shop">
            <a href="/shop">Interest-Based ads</a>
          </Link>
          <span>&copy 1996-2021, Amazon.com, Inc. or its affiliates</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
