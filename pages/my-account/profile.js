import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GlobalContext } from "../../context/GlobalContext";
import BreadCrumb from "../../components/Breadcrumb/BreadCrumb";
import SubmitButton from "../../components/Button/SubmitButton/SubmitButton";
import styled from "styled-components";
import axios from "axios";
import { readFile } from "../../utils/fileReader";

function index() {
  const router = useRouter();

  useEffect(() => {
     if (!state.loggedIn) return router.replace("/login");
   }, []);

  const { state, setState } = useContext(GlobalContext);

  const [photoLabel, setPhotolabel] = useState("Choose new photo");

  const [formData, setFormData] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
    photo: "",
    photoPreview: "",
    phone: state.user?.phone || "",
  });

  const [billingData, setBillingData] = useState({
    firstName: state.user?.billing?.firstName || "",
    lastName: state.user?.billing?.lastName || "",
    companyName: state.user?.billing?.companyName || "",
    country: state.user?.billing?.country || "",
    streetAddress1: state.user?.billing?.streetAddress1 || "",
    streetAddress2: state.user?.billing?.streetAddress2 || "",
    townOrCity: state.user?.billing?.townOrCity || "",
    zip: state.user?.billing?.zip || "",
    phone: state.user?.billing?.phone || "",
    email: state.user?.billing?.email || ""
  });

  const [loading, setLoading] = useState(false);

  const [billingLoading, setBillingLoading] = useState(false);

  const inputChange = (e) =>
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const billingInputChange = (e) =>
    setBillingData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // send request with data
      const data = new FormData();
      Object.keys(formData).forEach((field) =>
        data.append(field, formData[field])
      );
      const res = await axios.patch(`/api/v1/users/update-me`, data);

      setLoading(false);

      setState((prevState) => ({
        ...prevState,
        user: res.data.data.user,
        alert: { type: "success", message: res.data.message, timeOut: 2000 },
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        alert: {
          type: "danger",
          message: error.response ? error.response.data.message : error.message,
        },
      }));

      setLoading(false);
    }
  };

  // password form data
  const [passwordFrom, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { oldPassword, newPassword, confirmPassword } = passwordFrom;

  const [passwordFormLoading, setPasswordFormLoading] = useState(false);

  const passwordInputChange = (e) =>
    setPasswordForm({ ...passwordFrom, [e.target.name]: e.target.value });

  const submitPasswordForm = async (e) => {
    try {
      e.preventDefault();
      setPasswordFormLoading(true);

      // send request with data
      const res = await axios.patch(
        `/api/v1/users/update-password`,
        passwordFrom
      );

      setPasswordFormLoading(false);
      setState((prevState) => ({
        ...prevState,
        user: res.data.data.user,
        alert: { type: "success", message: res.data.message, timeOut: 2000 },
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        alert: {
          type: "danger",
          message: error.response ? error.response.data.message : error.message,
        },
      }));

      setPasswordFormLoading(false);
    }
  };

  // delete account
  const deleteAccount = async () => {
    try {
      if (!confirm("Are you sure? Your account will be permanently deleted!"))
        return;

      const res = await axios.delete(`/api/v1/users/delete-me`);
      setState({
        ...state,
        loggedIn: false,
        user: null,
        alert: { type: "danger", message: res.data.message, timeOut: 2000 },
      });
      settimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        alert: {
          type: "danger",
          message: error.response ? error.response.data.message : error.message,
        },
      }));
    }
  };

  // upload photo
  const setPhoto = async (e) => {
    try {
      const file = e.target.files[0];
      const photoPreview = await readFile(file);
      setPhotolabel("One file Chosen");
      setFormData({ ...formData, photo: file, photoPreview });
    } catch (error) {
      setState({ ...state, alert: { type: "danger", message: error.message } });
    }
  };

  const submitBillingForm = async (e) => {
    try {
      e.preventDefault();
      setBillingLoading(true);
      const res = await axios.patch('/api/v1/users/update-me', { billing: billingData });
      setState({ ...state, user: res.data.data.user , alert: {type: 'success', message: res.data.message}});
      setBillingData(res.data.data.user.billing);
      setBillingLoading(false);
    } catch (error) {
       setState({ ...state, alert: { type: "danger", message: error.message } });
    }
  }

  return (
    <div className="p-3">
      <div className="col-md-6 mx-auto">
        <BreadCrumb />
        <h2 className="mt-5">Update User Info</h2>
        <form
          className="p-3 rounded shadow-lg border rounded"
          onSubmit={submitForm}
        >
          <div className="form-group d-flex align-items-center">
            <div className="col p-0">
              <img
                src={
                  formData.photoPreview ||
                  `/img/users/${
                    state.user?.photo ? state.user.photo : "user.jpg"
                  }`
                }
                width={"50px"}
                height={"50px"}
                alt={state.user ? state.user.name : "user"}
                className="rounded-circle"
              />
            </div>
            <div className="col-10 p-0">
              <label htmlFor="photo" className="btn btn-outline-dark">
                {photoLabel}
              </label>
              <File type="file" name="photo" id="photo" onChange={setPhoto} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="name"
              className="form-control"
              name="name"
              id="name"
              onChange={inputChange}
              value={formData.name}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              onChange={inputChange}
              value={formData.email}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="number"
              className="form-control"
              name="phone"
              id="phone"
              onChange={(e) => {
                let val = e.target.value;
                if (val.length > 11) e.target.value = val.slice(0, 11);
                if (val < 0) e.target.value = 0;
                inputChange(e);
              }}
              value={formData.phone}
            />
          </div>
          <SubmitButton loading={loading}>Update</SubmitButton>
        </form>
        <h2 className="mt-5">Update Billing Data</h2>
        <form
          className="p-3 rounded shadow-lg border rounded"
          onSubmit={submitBillingForm}
        >
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="firstName"
              className="form-control"
              name="firstName"
              id="firstName"
              onChange={billingInputChange}
              value={billingData.firstName}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="lastName"
              className="form-control"
              name="lastName"
              id="lastName"
              onChange={billingInputChange}
              value={billingData.lastName}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyName">Company Name (optional)</label>
            <input
              type="companyName"
              className="form-control"
              name="companyName"
              id="companyName"
              onChange={billingInputChange}
              value={billingData.companyName}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              name="country"
              id="country"
              className="form-control"
              value={billingData.country}
              onChange={billingInputChange}
            >
              {state.countries?.map((country) => (
                <option value={country._id} key={country._id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="townOrCity">Town Or City</label>
            <input
              type="townOrCity"
              className="form-control"
              name="townOrCity"
              id="townOrCity"
              onChange={billingInputChange}
              value={billingData.townOrCity}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="streetAddress1">Street address 1</label>
            <input
              type="streetAddress1"
              className="form-control"
              name="streetAddress1"
              id="streetAddress1"
              onChange={billingInputChange}
              value={billingData.streetAddress1}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="streetAddress2">Street Address 2 (optional)</label>
            <input
              type="streetAddress2"
              className="form-control"
              name="streetAddress2"
              id="streetAddress2"
              onChange={billingInputChange}
              value={billingData.streetAddress2}
              
            />
          </div>
          <div className="form-group">
            <label htmlFor="billingEmail">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="billingEmail"
              onChange={billingInputChange}
              value={billingData.email}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="billingPhone">Phone</label>
            <input
              type="number"
              className="form-control"
              name="phone"
              id="billingPhone"
              onChange={(e) => {
                let val = e.target.value;
                if (val.length > 11) e.target.value = val.slice(0, 11);
                if (val < 0) e.target.value = 0;
                billingInputChange(e);
              }}
              value={billingData.phone}
            />
          </div>
          <SubmitButton loading={billingLoading}>Update</SubmitButton>
        </form>
        <h2 className="mt-5">Update Password</h2>
        <form
          className="p-3 rounded shadow-lg border rounded"
          onSubmit={submitPasswordForm}
        >
          <div className="form-group">
            <label htmlFor="oldPassword">Current Password</label>
            <input
              type="password"
              className="form-control"
              name="oldPassword"
              id="oldPassword"
              onChange={passwordInputChange}
              value={oldPassword}
              required
              autoComplete="true"
              minLength={8}
              maxLength={16}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">New Password</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              id="newPassword"
              onChange={passwordInputChange}
              value={newPassword}
              required
              autoComplete="true"
              minLength={8}
              maxLength={16}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              id="confirmPassword"
              onChange={passwordInputChange}
              value={confirmPassword}
              required
              autoComplete="true"
              minLength={8}
              maxLength={16}
            />
          </div>
          <SubmitButton loading={passwordFormLoading}>Update</SubmitButton>
        </form>
        <button className="btn btn-danger mt-5" onClick={deleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default index;

const File = styled.input`
  height: 0.1px;
  width: 0.1px;
  opacity: 0;
`;
