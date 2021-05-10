import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import SubmitButton from "../components/Button/SubmitButton/SubmitButton";
import axios from "axios";
import { cloneDeep } from "lodash";
import Link from "next/link";

function Cart() {
  const { state, setState } = useContext(GlobalContext);

  const [cartState, setCartState] = useState(cloneDeep(state.user?.cart));

  const [loading, setLoading] = useState(false);

  const otherProducts = state.products
    .filter((product) =>
      cartState?.some((prod) => prod.product._id !== product._id)
    )
    .filter((product, i) => i <= 12);

  const updateCart = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API || "api"}/v1/users/update-me`,
        { cart: cartState }
      );

      setState({
        ...state,
        alert: { type: "success", message: "Cart updated" },
        user: res.data.data.user,
      });

      setLoading(false);
    } catch (error) {
      setState({
        ...state,
        alert: {
          type: "danger",
          message: error.response?.message || error.message || "Network Error",
        },
      });
    }
  };

  const updateQuantity = (item, type) => {
    const updateIndex = cartState.findIndex(
      (cartItem) => cartItem._id === item._id
    );
    const modifiedCart = [...cartState];
    type === "plus"
      ? (modifiedCart[updateIndex].quantity += 1)
      : (modifiedCart[updateIndex].quantity -= 1);
    setCartState(modifiedCart);
  };

  const cartTotal = () => {
    let total = 0;
    state.user.cart.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total.toFixed(2);
  };

  return (
    <div>
      <h3 className="p-5" style={{ background: "#F6F6F6" }}>
        Cart
      </h3>
      {state.user?.cart?.length > 0 ? (
        <div className="row mx-0">
          <form className="col-lg-8 ml-lg-3 mb-5" onSubmit={updateCart}>
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
                      onClick={() =>
                        setCartState(
                          cartState.filter(
                            (cartItem) => cartItem._id !== item._id
                          )
                        )
                      }
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
                    <h5 className="mb-0">{item.product.name}</h5>
                    <div className="d-flex d-sm-none align-items-center">
                      <div className="col px-0">
                        <h5 className="mb-0">
                          <b>PRICE:</b> ${item.product.price}
                        </h5>
                        <h5 className="mb-0">
                          <b>TOTAL:</b> ${cartTotal()}
                        </h5>
                      </div>
                      <div className="col px-0 d-flex align-items-center jusity-content-center">
                        <button
                          type="button"
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
                          type="button"
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
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() =>
                      setState({
                        ...state,
                        alert: { type: "danger", message: "No such coupon!" },
                      })
                    }
                  >
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
                  <h5 className="mb-0">
                    <b>Subtotal</b>
                  </h5>
                </div>
                <div className="col">
                  <h5 className="mb-0">${cartTotal()}</h5>
                </div>
              </div>
              <div className="d-flex">
                <div className="col">
                  <h5 className="mb-0">
                    <b>Total</b>
                  </h5>
                </div>
                <div className="col">
                  <h5 className="mb-0">${cartTotal()}</h5>
                </div>
              </div>
              <button
                type="button"
                className="btn col mt-1 "
                disabled={state.user.cart.length === 0}
                style={{ background: "#FFD49D" }}
              >
                <Link href="/checkout">
                  <h5 className="mb-0">PROCEED TO CHECKOUT</h5>
                </Link>
              </button>
            </div>
          </form>
          <div className="col border-left">
            <h4 className="mb-0">More products</h4>
            {otherProducts.map((product) => (
              <Link
                href={`/shop/${product.category.name}/${product.slug}`}
                key={product._id}
              >
                <a>
                  <img
                    src={`/img/products/${product.coverPhoto || "product.png"}`}
                    style={{ height: 70, width: 70 }}
                    className="m-3 shadow"
                  />
                </a>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-5 mb-5">
          <h3>Cart is empty!</h3>
        </div>
      )}
    </div>
  );
}

export default Cart;
