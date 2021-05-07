import Link from "next/link";
import { useContext, useEffect } from "react";
import Card from "../components/Card/Card";
import Slider from "../components/Slider/Slider";
import Slider2 from "../components/Slider/Slider2/Slider2";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/Home.module.scss";
import { useRouter } from "next/router";

export default function Home() {
  const Router = useRouter();
  const { state } = useContext(GlobalContext);

  return (
    <div style={{ maxWidth: "1350px", margin: "0 auto" }}>
      <Slider
        className="d-none d-sm-block"
        images={[
          "banner-1",
          "banner-2",
          "banner-3",
          "banner-4",
          "banner-5",
          "banner-6",
        ]}
      />
      <div className={styles.cardsContainer}>
        <div
          className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"
          style={{ background: "#E5E6E6" }}
        >
          {state.loggedIn && (
            <div className="col p-3">
              <div className="bg-white p-4 h-100">
                <div className="d-flex align-items-center">
                  <img
                    src={`img/users/${
                      state.user && state.user.photo
                        ? state.user.photo
                        : "user.jpg"
                    }`}
                    alt={state.user.firstName}
                    width="40px"
                    height="40px"
                    style={{ borderRadius: "50%" }}
                  />
                  <h3 className="col">Hi, {state.user.firstName}</h3>
                </div>
                <p>Recommendations for you</p>
                <div className="row row-cols-2 text-center">
                  <div className="col">
                    <img
                      src="img/categories/pc.jpg"
                      alt="computer"
                      className="col"
                    />
                    <span>Computer & Accessories</span>
                  </div>
                  <div className="col">
                    <img
                      src="img/categories/ps5.jpg"
                      alt="ps5"
                      className="col"
                    />
                    <span>Video Games</span>
                  </div>
                  <div className="col">
                    <img
                      src="img/categories/babyToys.jpg"
                      alt="baby toys"
                      className="col"
                    />
                    <span>Baby Toys</span>
                  </div>
                  <div className="col">
                    <img
                      src="img/categories/toys&games.jpg"
                      alt="toys & games"
                      className="col"
                    />
                    <span>Toys & Games</span>
                  </div>
                </div>
                <Link href={Router.asPath}>
                  <a>
                    <h5 style={{ marginTop: "35px" }}>Shop now</h5>
                  </a>
                </Link>
              </div>
            </div>
          )}
          <Card text="Beauty picks" link={Router.asPath} img="beauty" />
          <Card
            text="Get fit at home"
            link={Router.asPath}
            img="fitness"
            linkText="Explore now"
          />
          <div className="col p-3">
            <div className="bg-white p-4 h-100">
              <h4 className="mb-3">Shop by Category</h4>
              <div className="row row-cols-2 text-center">
                <div className="col">
                  <img
                    src="img/categories/pc.jpg"
                    alt="computer"
                    className="col"
                  />
                  <span>Computer & Accessories</span>
                </div>
                <div className="col">
                  <img src="img/categories/ps5.jpg" alt="ps5" className="col" />
                  <span>Video Games</span>
                </div>
                <div className="col">
                  <img
                    src="img/categories/babyToys.jpg"
                    alt="baby toys"
                    className="col"
                  />
                  <span>Baby Toys</span>
                </div>
                <div className="col">
                  <img
                    src="img/categories/toys&games.jpg"
                    alt="toys & games"
                    className="col"
                  />
                  <span>Toys & Games</span>
                </div>
              </div>
              <Link href={Router.asPath}>
                <a>
                  <h5 style={{ marginTop: "82px" }}>Shop now</h5>
                </a>
              </Link>
            </div>
          </div>
          {!state.loggedIn && (
            <div className="col p-3 ">
              <div className="h-100">
                <div className="bg-white p-3">
                  <h4 className="mb-3">Sign in for the best experience</h4>
                  <Link href="/login">
                    <a
                      style={{
                        background: "#ffba7f",
                        display: "block",
                        color: "black",
                        textAlign: "center",
                        textDecoration: "none",
                        padding: "5px",
                        border: "none",
                        borderRadius: "3px",
                        margin: "0 0 15px 0",
                        width: "100%",
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      Sign in securely
                    </a>
                  </Link>
                </div>
                <div
                  className="my-4 text-center"
                  style={{ overflow: "hidden" }}
                >
                  <img
                    src="img/categories/shipment.jpg"
                    alt="beauty"
                    style={{
                      width: "90%",
                      height: "237px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <Card
            text="Shop top categories"
            link={Router.asPath}
            img="hobby"
            linkText="See more"
          />
          <Card
            text="Computers & Accessories"
            link={Router.asPath}
            img="pc&accessories"
          />
          <Card
            text="AmazonBasics"
            link={Router.asPath}
            img="amazonBasics"
            linkText="See more"
          />
          <Card
            text="Find your ideal TV"
            link={Router.asPath}
            img="tv"
            linkText="See more"
          />
        </div>
        <div className="p-3 my-2 bg-white">
          <div className="mb-2">
            <h2 className="d-inline text-dark">Discover Amazon</h2>
            <Link href={Router.asPath}>
              <a className="ml-3">
                <h5 className="d-inline">Click to learn more</h5>
              </a>
            </Link>
          </div>
          <div className="d-flex" style={{ overflowX: "scroll" }}>
            <Link href={Router.asPath}>
              <a>
                <img src="img/globe.png" alt="globe" />
              </a>
            </Link>
            <Link href={Router.asPath}>
              <a>
                <img src="img/money.png" alt="money" />
              </a>
            </Link>
            <Link href={Router.asPath}>
              <a>
                <img src="img/card.png" alt="card" />
              </a>
            </Link>
            <Link href={Router.asPath}>
              <a>
                <img src="img/box.png" alt="box" />
              </a>
            </Link>
            <Link href={Router.asPath}>
              <a>
                <img src="img/track.png" alt="track" />
              </a>
            </Link>
            <Link href={Router.asPath}>
              <a>
                <img src="img/query.png" alt="customer care" />
              </a>
            </Link>
          </div>
        </div>
        <Slider2
          title="Top Beauty and Personal Care"
          linkText="Shop now"
          images={[
            { src: "img/categories/beauty/1.jpg" },
            { src: "img/categories/beauty/2.jpg" },
            { src: "img/categories/beauty/3.jpg" },
            { src: "img/categories/beauty/4.jpg" },
            { src: "img/categories/beauty/5.jpg" },
            { src: "img/categories/beauty/6.jpg" },
            { src: "img/categories/beauty/7.jpg" },
            { src: "img/categories/beauty/8.jpg" },
            { src: "img/categories/beauty/9.jpg" },
            { src: "img/categories/beauty/10.jpg" },
            { src: "img/categories/beauty/11.jpg" },
            { src: "img/categories/beauty/12.jpg" },
            { src: "img/categories/beauty/13.jpg" },
            { src: "img/categories/beauty/14.jpg" },
          ]}
        />
        <Slider2
          title="Best Sellers in Kitchen"
          linkText="Shop now"
          images={[
            { src: "img/categories/beauty/1.jpg" },
            { src: "img/categories/beauty/2.jpg" },
            { src: "img/categories/beauty/3.jpg" },
            { src: "img/categories/beauty/4.jpg" },
            { src: "img/categories/beauty/5.jpg" },
            { src: "img/categories/beauty/6.jpg" },
            { src: "img/categories/beauty/7.jpg" },
            { src: "img/categories/beauty/8.jpg" },
            { src: "img/categories/beauty/9.jpg" },
            { src: "img/categories/beauty/10.jpg" },
            { src: "img/categories/beauty/11.jpg" },
            { src: "img/categories/beauty/12.jpg" },
            { src: "img/categories/beauty/13.jpg" },
            { src: "img/categories/beauty/14.jpg" },
          ]}
        />
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
          <Card
            text="Shop Laptops & Tablets"
            link={Router.asPath}
            img="laptop"
          />
          <Card text="Explore home bedding" link={Router.asPath} img="bed" />
          <Card
            text="Create with strip lights"
            link={Router.asPath}
            img="stripeLights"
            linkText="Shop now"
          />
          <Card
            text="Shop Laptops & Tablets"
            link={Router.asPath}
            img="laptop"
          />
        </div>
        <Slider2
          title="Amazon Top Sellers"
          images={[
            { src: "img/categories/beauty/1.jpg" },
            { src: "img/categories/beauty/2.jpg" },
            { src: "img/categories/beauty/3.jpg" },
            { src: "img/categories/beauty/4.jpg" },
            { src: "img/categories/beauty/5.jpg" },
            { src: "img/categories/beauty/6.jpg" },
            { src: "img/categories/beauty/7.jpg" },
            { src: "img/categories/beauty/8.jpg" },
            { src: "img/categories/beauty/9.jpg" },
            { src: "img/categories/beauty/10.jpg" },
            { src: "img/categories/beauty/11.jpg" },
            { src: "img/categories/beauty/12.jpg" },
            { src: "img/categories/beauty/13.jpg" },
            { src: "img/categories/beauty/14.jpg" },
          ]}
        />
        <Slider2
          title="Must have Wireless Products"
          linkText="Shop now"
          images={[
            { src: "img/categories/beauty/1.jpg" },
            { src: "img/categories/beauty/2.jpg" },
            { src: "img/categories/beauty/3.jpg" },
            { src: "img/categories/beauty/4.jpg" },
            { src: "img/categories/beauty/5.jpg" },
            { src: "img/categories/beauty/6.jpg" },
            { src: "img/categories/beauty/7.jpg" },
            { src: "img/categories/beauty/8.jpg" },
            { src: "img/categories/beauty/9.jpg" },
            { src: "img/categories/beauty/10.jpg" },
            { src: "img/categories/beauty/11.jpg" },
            { src: "img/categories/beauty/12.jpg" },
            { src: "img/categories/beauty/13.jpg" },
            { src: "img/categories/beauty/14.jpg" },
          ]}
        />
        <Slider2
          title="Best Sellers in Baby"
          linkText="Shop now"
          images={[
            { src: "img/categories/beauty/1.jpg" },
            { src: "img/categories/beauty/2.jpg" },
            { src: "img/categories/beauty/3.jpg" },
            { src: "img/categories/beauty/4.jpg" },
            { src: "img/categories/beauty/5.jpg" },
            { src: "img/categories/beauty/6.jpg" },
            { src: "img/categories/beauty/7.jpg" },
            { src: "img/categories/beauty/8.jpg" },
            { src: "img/categories/beauty/9.jpg" },
            { src: "img/categories/beauty/10.jpg" },
            { src: "img/categories/beauty/11.jpg" },
            { src: "img/categories/beauty/12.jpg" },
            { src: "img/categories/beauty/13.jpg" },
            { src: "img/categories/beauty/14.jpg" },
          ]}
        />
        <Slider2
          title="Our favorite Toys"
          linkText="Shop now"
          images={[
            { src: "img/categories/beauty/1.jpg" },
            { src: "img/categories/beauty/2.jpg" },
            { src: "img/categories/beauty/3.jpg" },
            { src: "img/categories/beauty/4.jpg" },
            { src: "img/categories/beauty/5.jpg" },
            { src: "img/categories/beauty/6.jpg" },
            { src: "img/categories/beauty/7.jpg" },
            { src: "img/categories/beauty/8.jpg" },
            { src: "img/categories/beauty/9.jpg" },
            { src: "img/categories/beauty/10.jpg" },
            { src: "img/categories/beauty/11.jpg" },
            { src: "img/categories/beauty/12.jpg" },
            { src: "img/categories/beauty/13.jpg" },
            { src: "img/categories/beauty/14.jpg" },
          ]}
        />
        <Slider2
          title="Men's Dress Shirts under $30"
          linkText="Shop now"
          images={[
            { src: "img/categories/beauty/1.jpg" },
            { src: "img/categories/beauty/2.jpg" },
            { src: "img/categories/beauty/3.jpg" },
            { src: "img/categories/beauty/4.jpg" },
            { src: "img/categories/beauty/5.jpg" },
            { src: "img/categories/beauty/6.jpg" },
            { src: "img/categories/beauty/7.jpg" },
            { src: "img/categories/beauty/8.jpg" },
            { src: "img/categories/beauty/9.jpg" },
            { src: "img/categories/beauty/10.jpg" },
            { src: "img/categories/beauty/11.jpg" },
            { src: "img/categories/beauty/12.jpg" },
            { src: "img/categories/beauty/13.jpg" },
            { src: "img/categories/beauty/14.jpg" },
          ]}
        />
        <Slider2
          title="Inspired by your browsing history"
          link={state.loggedIn ? "browsed-products" : "/login"}
          linkText={
            !state.loggedIn
              ? "Sign in to see personalized recommendations"
              : "See more"
          }
          centerText={!state.loggedIn}
          linkButton={!state.loggedIn}
          style={{
            padding: "35px 0 0 0",
            display: "flex",
            flexFlow: "column",
            justifyContent: "center",
          }}
          images={[
            { src: "img/categories/beauty/1.jpg" },
            { src: "img/categories/beauty/2.jpg" },
            { src: "img/categories/beauty/3.jpg" },
            { src: "img/categories/beauty/4.jpg" },
            { src: "img/categories/beauty/5.jpg" },
            { src: "img/categories/beauty/6.jpg" },
            { src: "img/categories/beauty/7.jpg" },
            { src: "img/categories/beauty/8.jpg" },
            { src: "img/categories/beauty/9.jpg" },
            { src: "img/categories/beauty/10.jpg" },
            { src: "img/categories/beauty/11.jpg" },
            { src: "img/categories/beauty/12.jpg" },
            { src: "img/categories/beauty/13.jpg" },
            { src: "img/categories/beauty/14.jpg" },
          ]}
        />
      </div>
    </div>
  );
}
