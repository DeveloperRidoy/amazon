import { useContext, useState } from "react"
import { GlobalContext } from "../context/GlobalContext"
import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa'
import SubmitButton from '../components/Button/SubmitButton/SubmitButton';

function Cart () {

  const { state, setState } = useContext(GlobalContext);

  const [cartState, setCartState] = useState([...state.user.cart]);

  const [loading, setLoading] = useState(false);

  const updateCart = async e => {
    e.preventDefault();
  }

  const updateQuantity = (item, type) => {
    const updateIndex = cartState.findIndex(cartItem => cartItem._id === item._id);
    const modifiedCart = [...cartState];
    modifiedCart[updateIndex].quantity =
      type === "plus"
        ? modifiedCart[updateIndex].quantity + 1
        : modifiedCart[updateIndex].quantity - 1;

    setCartState(modifiedCart);
  }

  const cartTotal = () => {
    let total = 0;
    state.user.cart.forEach(item => {total += item.product.price * item.quantity });
    return (total).toFixed(2);
  }
  console.log(state.user.cart, cartState);
    return (
      <div>
        <h3 className="p-5" style={{ background: "#F6F6F6" }}>
          Cart
        </h3>
        <form className="col-md-10 col-lg-8 ml-lg-3 mb-3" onSubmit={updateCart}>
          <div className="row row-cols-1 row-cols-sm-2 border-bottom py-2 d-none d-sm-flex">
            <div className="col d-flex align-items-center">
              <div className="col-sm-4 col-3"></div>
              <div className="col">
                <h5 className="mb-0">
                  <b>PRODUCT</b>
                </h5>
              </div>
            </div>
            <div className="col d-flex align-items-center justify-content-between">
              <h5 className="mb-0">
                <b>PRICE</b>
              </h5>
              <div className="d-flex align-items-center justify-content-center">
                <h5 className="mb-0">
                  <b>QUANTITY</b>
                </h5>
              </div>
              <h5 className="mb-0">
                <b>TOTAL</b>
              </h5>
            </div>
          </div>
          {cartState.map((item) => (
            <div
              className="row border-bottom row-cols-1 row-cols-sm-2 mb-2 py-2"
              key={item._id}
            >
              <div className="col d-flex align-items-sm-center">
                <div className="col-sm-4 col-3 d-flex align-items-center">
                  <button
                    className="btn btn-outline-dark p-0 mr-2"
                    style={{ height: 20, width: 20, borderRadius: "50%" }}
                    onClick={() => setCartState(cartState.filter(cartItem => cartItem._id !== item._id))}
                  >
                    <FaTimes />
                  </button>
                  <img
                    src={`/img/products/${
                      item.product?.coverPhoto || "product.png"
                    }`}
                    alt={item.product.name}
                    style={{ height: 50, width: 50 }}
                  />
                </div>
                <div className="col">
                  <h5>{item.product.name}</h5>
                  <div className="d-flex d-sm-none align-items-center">
                    <div className="col px-0">
                      <h5>
                        <b>PRICE:</b> ${item.product.price}
                      </h5>
                      <h5>
                        <b>TOTAL:</b> ${item.product.price * item.quantity}
                      </h5>
                    </div>
                    <div className="col px-0 d-flex align-items-center jusity-content-center">
                      <button
                        className="btn btn-outline-dark d-flex align-items-center"
                        disabled={item.quantity === 0}
                        onClick={() => updateQuantity(item, "minus")}
                      >
                        <FaMinus />
                      </button>
                      <div className="p-3">
                        <h5 className="mb-0">{item.quantity}</h5>
                      </div>
                      <button
                        className="btn btn-outline-dark d-flex align-items-center"
                        disabled={item.product.stock - item.quantity === 0}
                        onClick={() => updateQuantity(item, "plus")}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col d-none d-sm-flex align-items-center justify-content-between">
                <h5 className="mb-0">${item.product.price}</h5>
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-dark d-flex align-items-center"
                    disabled={item.quantity === 0}
                    onClick={() => updateQuantity(item, "minus")}
                  >
                    <FaMinus />
                  </button>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: 35 }}
                  >
                    <h5 className="mb-0">{item.quantity}</h5>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-dark d-flex align-items-center"
                    disabled={item.product.stock - item.quantity === 0}
                    onClick={() => updateQuantity(item, "plus")}
                  >
                    <FaPlus />
                  </button>
                </div>
                <h5 className="mb-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </h5>
              </div>
            </div>
          ))}
          <div className="d-sm-flex align-items-center justify-content-between mt-3">
            <div className="input-group mb-3 mb-sm-0" style={{ width: 250 }}>
              <input
                type="text"
                name="coupon"
                id="coupon"
                placeholder="Enter coupon code"
                className="form-control"
              />
              <div className="input-group-append">
                <button type="button" className="btn btn-dark">
                  APPLY COUPON
                </button>
              </div>
            </div>
            <SubmitButton
              className="text-white bg-dark"
              spinColor="white"
              loading={loading}
            >
              UPDATE CART
            </SubmitButton>
          </div>
          <div className="col-sm-6 ml-auto mt-5 px-0">
            <h5 className="text-center">
              <b>Cart Totals</b>
            </h5>
            <div className="d-flex">
              <div className="col">
                <h5>
                  <b>Subtotal</b>
                </h5>
              </div>
              <div className="col">
                <h5>${cartTotal()}</h5>
              </div>
            </div>
            <div className="d-flex">
              <div className="col">
                <h5>
                  <b>Total</b>
                </h5>
              </div>
              <div className="col">
                <h5>${cartTotal()}</h5>
              </div>
            </div>
            <button
              type="button"
              className="btn col"
              style={{ background: "#FFD49D" }}
            >
              <h5 className="mb-0">PROCEED TO CHECKOUT</h5>
            </button>
          </div>
        </form>
      </div>
    ); 
} 

export default Cart 
