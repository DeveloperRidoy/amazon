import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import SubmitButton from '../components/Button/SubmitButton/SubmitButton';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function Checkout () {

  const { state, setState } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false)

  const initialData = {
    firstName: state.user?.billing?.firstName || "",
    lastName: state.user?.billing?.lastName || "",
    companyName: state.user?.billing?.companyName || "",
    country: state.user?.billing?.country || "",
    streetAddress1: state.user?.billing?.streetAddress1 || "",
    streetAddress2: state.user?.billing?.streetAddress2 || "",
    townOrCity: state.user?.billing?.townOrCity || "",
    zip: state.user?.billing?.zip || "",
    phone: state.user?.billing?.phone || "",
    email: state.user?.billing?.email || "",
    note: state.user?.billing?.note || "",
    saveReference: !state.user?.billing,
  };


  const [billingData, setBillingData] = useState(initialData);

  const inputChange = (e) =>
    setBillingData({
      ...billingData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const initiateCheckout = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      // save billing info if savePreference checked 
      billingData.saveReference && await axios.patch('/api/v1/users/update-me', {billing: billingData});

      // create stipe checkout session
      const stripe = await stripePromise;
      const data = { cart: state.user.cart, billingData, userId: state.user._id };
      const res = await axios.post(`/api/v1/checkout/create-checkout-session`, data);

      // redirect to stripe checkout page
      const result = await stripe.redirectToCheckout({
        sessionId: res.data.data.sessionId,
      });
      setLoading(false)
      // show error message on error
      if (result.error) {
        return setState({
          ...state,
          alert: { type: "danger", message: result.error.message },
        });
      }
    } catch (error) {
      setLoading(false);
      setState({
        ...state,
        alert: {
          type: "danger",
          message:
            error.response?.data?.message || error.message || "Network Error",
        },
      });
    }
  };

  return (
    <div className="p-5">
      {state.user?.cart?.length > 0 ? (
        <div>
          <h3 className=" pb-5">Checkout</h3>
          <StyledForm
            className="row row-cols-1 row-cols-lg-2"
            onSubmit={initiateCheckout}
          >
            <div className="col-lg-8">
              <div className="col-12 p-0">
                <h4 className="mb-5">Billing details</h4>
                <div className="form-row row-cols-1 row-cols-sm-2">
                  <div className="col form-group">
                    <label htmlFor="firstName">First name</label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      className="form-control form-control-lg"
                      required
                      value={billingData.firstName}
                      onChange={inputChange}
                    />
                  </div>
                  <div className="col form-group">
                    <label htmlFor="lastName">Last name</label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="form-control form-control-lg"
                      required
                      value={billingData.lastName}
                      onChange={inputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="companyName">Company name (optional)</label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="form-control form-control-lg"
                    value={billingData.companyName}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    name="country"
                    id="country"
                    className="form-control form-control-lg"
                    required
                    value={billingData.country}
                    onChange={inputChange}
                  >
                    <option value="">Select Country</option>
                    {state.countries.map((country) => (
                      <option value={country._id} key={country._id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="streetAddress1"> Street address 1</label>
                  <input
                    type="text"
                    id="streetAddress1"
                    name="streetAddress1"
                    className="form-control form-control-lg"
                    placeholder="House number and street name"
                    required
                    value={billingData.streetAddress1}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="streetAddress2">
                    {" "}
                    Street address 2 (optional)
                  </label>
                  <input
                    type="text"
                    id="streetAddress2"
                    name="streetAddress2"
                    className="form-control form-control-lg"
                    placeholder="Apartment, suite, unit etc"
                    value={billingData.streetAddress2}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="townOrCity">Town / City</label>
                  <input
                    type="text"
                    name="townOrCity"
                    id="townOrCity"
                    className="form-control form-control-lg"
                    required
                    value={billingData.townOrCity}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zip">ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    id="zip"
                    className="form-control form-control-lg"
                    required
                    value={billingData.zip}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone (optional)</label>
                  <input
                    type="number"
                    name="phone"
                    id="phone"
                    minLength="8"
                    className="form-control form-control-lg"
                    required
                    value={billingData.phone}
                    onChange={inputChange}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val < 0) e.target.value = 0;
                      if (val.length > 11)
                        e.target.value = val.substring(0, 11);
                      inputChange(e);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control form-control-lg"
                    required
                    value={billingData.email}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="note">Order notes (optional)</label>
                  <textarea
                    name="note"
                    id="note"
                    cols="30"
                    rows="4"
                    placeholder="Notes about your order, e.g. special notes for delivery"
                    className="form-control form-control-lg"
                    value={billingData.note}
                    onChange={inputChange}
                  ></textarea>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="saveReference"
                    id="saveReference"
                    className="form-check-input"
                    checked={billingData.saveReference}
                    onChange={inputChange}
                  />
                  <label htmlFor="saveReference" className="form-check-label">
                    Save details for future reference
                  </label>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="col border p-4">
                <h4 className="col p-0">Your order</h4>
                <div>
                  <div className="d-flex">
                    <h5 className="col-3 p-0">
                      <b>Product</b>
                    </h5>
                    <h5 className="col p-0">
                      <b>Total</b>
                    </h5>
                  </div>
                  {state.user.cart.map((item) => (
                    <div
                      className="d-flex border-bottom my-3 align-items-center"
                      key={item._id}
                    >
                      <h5 className="col-3 p-0 text-muted">
                        {item.product.name} <FaTimes /> {item.quantity}
                      </h5>
                      <h5 className="col p-0">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </h5>
                    </div>
                  ))}
                  <div className="d-flex mb-3">
                    <h5 className="col-3 p-0">
                      <b>Subtotal</b>
                    </h5>
                    <h5 className="col p-0">
                      {state.user.cart
                        .map((item) => item.product.price * item.quantity)
                        .reduce((prev, current) => prev + current)
                        .toFixed(2)}
                    </h5>
                  </div>
                  <div className="d-flex mb-3">
                    <h5 className="col-3 p-0">
                      <b>Shipping</b>
                    </h5>
                    <h5 className="col p-0">Free Shipping!</h5>
                  </div>
                  <div className="d-flex mb-3">
                    <h5 className="col-3 p-0">
                      <b>Total</b>
                    </h5>
                    <h5 className="col p-0">
                      {state.user.cart
                        .map((item) => item.product.price * item.quantity)
                        .reduce((prev, current) => prev + current)
                        .toFixed(2)}
                    </h5>
                  </div>
                  <SubmitButton className="btn bg-dark text-white col mt-4 d-flex align-items-center justify-content-center" loading={loading} spinColor="white">
                    <h3 className="mb-0 mr-2">Place order</h3>
                  </SubmitButton>
                </div>
              </div>
            </div>
          </StyledForm>
        </div>
      ) : (
        <h3>You cart is emply!. Please add some product first</h3>
      )}
    </div>
  );
}

export default Checkout;

const StyledForm = styled.form`
  label {
    font-weight: bold;
    font-size: 15px;
  }
`;
