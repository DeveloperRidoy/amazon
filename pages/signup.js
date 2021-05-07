import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import SubmitButton from "../components/Button/SubmitButton/SubmitButton";
import styled from "styled-components";

function index() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
  });

  const [loading, setLoading] = useState(false);

  const { state, setState } = useContext(GlobalContext);

  useEffect(() => {
    if (state.loggedIn) return router.replace("/my-account");
  }, []);

  const { name, email, password, confirmPassword } = formData;
  const inputChange = (e) =>
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault();
      // see if passwords match
      if (password !== confirmPassword)
        return setState((prevState) => ({
          ...prevState,
          alert: {
            type: "danger",
            message: "Passwords do not match. Please try again",
          },
        }));

      setLoading(true);

      // send request with data
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API || "api"}/v1/users/signup`,
        formData,
        { withCredentials: true }
      );

      setLoading(false);
      setState((prevState) => ({
        ...prevState,
        loggedIn: true,
        user: res.data.data.user,
        alert: { type: "success", message: res.data.message, timeOut: 2000 },
      }));

      // redirect to my-account after 2 seconds
      setTimeout(() => router.push("/my-account"), 2000);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        alert: { type: "danger", message: error.response.data.message },
      }));

      setLoading(false);
    }
  };

  return (
    <div className="py-3 bg-white">
      <div
        className="d-flex flex-column col-md-6 mx-auto align-items-center "
        style={{ maxWidth: "400px" }}
      >
        <Link href="/">
          <a className="logoContainer my-5">
            <div className="logo"></div>
          </a>
        </Link>
        <form className="p-3 rounded shadow-lg" onSubmit={submitForm}>
          <h1>Sign-up</h1>
          <div className="form-group">
            <label htmlFor="email">Name</label>
            <input
              type="name"
              className="form-control"
              name="name"
              id="name"
              onChange={inputChange}
              value={name}
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
              value={email}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              minLength="8"
              maxLength="16"
              className="form-control"
              name="password"
              id="password"
              autoComplete="true"
              onChange={inputChange}
              value={password}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              minLength="8"
              maxLength="16"
              className="form-control"
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="true"
              onChange={inputChange}
              value={confirmPassword}
              required
            />
          </div>
          <SubmitButton loading={loading}>Sign up</SubmitButton>
          <p className="mt-3">
            By continuing, you agree to Amazon's{" "}
            <Link href={Router.asPath}>
              <a>Conditions of Use</a>
            </Link>{" "}
            and{" "}
            <Link href={Router.asPath}>
              <a>Privacy Notice</a>
            </Link>
            .
          </p>
        </form>
        <h5 className="text-muted mt-4 mb-3">Have an Account?</h5>
        <Link href="/login">
          <RegisterLink href="/login">Login to Your Account</RegisterLink>
        </Link>
        <div className="w-75 border-top pt-3 mt-4 d-flex justify-content-around">
          <Link href={Router.asPath}>Conditions of Use</Link>
          <Link href={Router.asPath}>Privacy Notice</Link>
          <Link href={Router.asPath}>Help</Link>
        </div>
        <p className="mt-3 text-disabled ">
          © 1996-2021, Amazon.com, Inc. or its affiliates
        </p>
      </div>
    </div>
  );
}

export default index;

const RegisterLink = styled.a`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 5px 15px;
  width: 100%;
  color: black;
  text-align: center;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    color: black;
    text-decoration: none;
  }
  &:focus {
    transform: scale(0.95);
  }
`;
