import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SubmitButton from '../components/Button/SubmitButton/SubmitButton'
import styled from 'styled-components';

function index () {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        email: '',  
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const {state, setState } = useContext(GlobalContext);
    
    useEffect(() => {
        if(state.loggedIn ) return router.replace('/my-account')
    }, [])

    const { email, password } = formData;
    
    const inputChange = (e) => setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    
    const submitForm = async (e) => {
        try {
            e.preventDefault();
            setLoading(true)
            
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/users/login`, formData, {withCredentials: true});
            
            setLoading(false);
            
            setState(prevState => ({ ...prevState, alert: { type: 'success', message: res.data.message, timeOut: 2000 }, loggedIn: true, user: res.data.data.user }));
            setTimeout(() => router.push("/my-account"), 1000);
        } catch (error) {
            const message = error.response
                ? error.response.status === 500
                    ? 'Server Error'
                    : error.response.data.message
                : 'Network Error'
            setState(prevState => ({ ...prevState, alert: { type: 'danger', message } }))
            setLoading(false)
        }
    }
    
    return (
      <div className="pt-3 bg-white">
        <div
          className="d-flex h-100 flex-column col-md-6 mx-auto align-items-center "
          style={{ maxWidth: "400px" }}
        >
          <Link href="/">
            <a href="/" className="logoContainer my-5">
              <div className="logo"></div>
            </a>
          </Link>
          <form className="p-3 w-100 rounded shadow-lg" onSubmit={submitForm}>
            <h1>Sign-In</h1>
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
              <label htmlFor="password">password</label>
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
            <SubmitButton loading={loading}>Log in</SubmitButton>
            <p className="mt-3">
              By continuing, you agree to Amazon's{" "}
              <Link href="#">
                <a>Conditions of Use</a>
              </Link>{" "}
              and{" "}
              <Link href="#">
                <a>Privacy Notice</a>
              </Link>
              .
            </p>
            <Link href="/users/forgot-password">
              <a>Forgot Your Password?</a>
            </Link>
          </form>
          <h5 className="text-muted mt-4 mb-3">New to Amazon?</h5>
          <Link href="/signup">
            <RegisterLink href="/signupl">
              Create your Amazon Account
            </RegisterLink>
          </Link>
          <div className="w-75 border-top pt-3 mt-4 d-flex justify-content-around">
            <Link href="#">Conditions of Use</Link>
            <Link href="#">Privacy Notice</Link>
            <Link href="#">Help</Link>
          </div>
          <p className="mt-3 mb-auto text-disabled ">
            © 1996-2021, Amazon.com, Inc. or its affiliates
          </p>
        </div>
      </div>
    );
}



export default index 


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