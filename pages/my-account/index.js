import Slider2 from '../../components/Slider/Slider2/Slider2'
import Card2 from '../../components/Card/Card2/Card2';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import {useRouter} from 'next/router';
import { ADMIN } from '../../utils/variables';

function index () {
  const router = useRouter()
  const { state } = useContext(GlobalContext);

  useEffect(() => {
    if (!state.loggedIn) return router.replace("/login");
    if (state.loggedIn && state.user.role === ADMIN) {
      const newCards = [
        {
          link: "admin",
          title: "Admin Panel",
          text: "Manage user accounts, products etc from here",
          img: { src: `/img/users/${state.user.photo || 'user.jpg'}`, alt: "admin panel" },
        },
        ...cards,
      ];
      setCards(newCards);
    }
  }, [state.loggedIn]);
  const [cards, setCards] = useState([
    {
      link: "/my-account/orders",
      title: "Your Orders",
      text: "Track, return or buy things again",
      img: { src: "/img/account/order.png", alt: "orders" },
    },
    {
      link: "/my-account/prime",
      title: "Prime",
      text: "View benefits and payment settings",
      img: { src: "/img/account/prime.png", alt: "amazon prime" },
    },
    {
      link: "/my-account/gift-cards",
      title: "Gift Cards",
      text: "View balance, redeem or reload cards",
      img: { src: "/img/account/gift-card.png", alt: "git cards" },
    },
    {
      link: "/my-account/payments",
      title: "Your Payments",
      text: "Manage payment methods & transactions",
      img: { src: "/img/account/payment.png", alt: "payments" },
    },
    {
      link: "my-account/profile",
      title: "Your Profile",
      text: "Manage, add or remove profile",
      img: { src: "/img/account/profile.png", alt: "profile" },
    },
    {
      link: "/my-account/devices",
      title: "Your devices",
      text: "Manage your amazon devices and digital content",
      img: { src: "/img/account/device.png", alt: "devices" },
    },
  ]);
 
    return (
      <div>
        {state.loggedIn && state.user 
          ? (
            <div className="col py-3">
        <div style={{ maxWidth: '1000px', margin: '0 auto'}}>
          <h1 className="my-4">Your Account</h1>
          <div className="row align-items-stretch row-cols-1 row-cols-sm-2 row-cols-lg-3">
            {cards.map((card, i) => (
              <Card2
                key={i} 
                link={card.link}
                title={card.title}
                text={card.text}
                img={{ src: card.img.src, alt: card.img.alt }}
              />
            ))}
          </div>
        </div>
        <div className="my-4">
          <Slider2
            title="Inspired by your browsing history"
            linkText=""
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
            title="Related items you viewed"
            linkText=""
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
          ): ''}
      </div>
    );
}

export default index
