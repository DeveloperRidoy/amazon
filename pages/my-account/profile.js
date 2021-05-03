import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { GlobalContext } from "../../context/GlobalContext";
import BreadCrumb from "../../components/Breadcrumb/BreadCrumb";
import SubmitButton from "../../components/Button/SubmitButton/SubmitButton";
import Image from 'next/image';
import styled from 'styled-components';
import axios from 'axios';
import { readFile } from '../../utils/fileReader';

function index () {
  const router = useRouter();

  const { state, setState } = useContext(GlobalContext);
  
  const [photoLabel, setPhotolabel] = useState('Choose new photo');

  const [formData, setFormData] = useState({
    name: state.user ? state.user.name : '',
    email: state.user ? state.user.email : '',
    photo: '',
    photoPreview: '',
    phone: state.user && state.user.phone ? state.user.phone: '' 
  });

  const [loading, setLoading] = useState(false);
  
  useEffect(() => {if (!state.loggedIn) return router.replace("/login")}, []);

  const { name, email, phone } = formData;
  const inputChange = (e) =>
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // send request with data
      const data = new FormData();
      Object.keys(formData).forEach(field => data.append(field, formData[field]));
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API || "api"}/v1/users/update-me`,data, {withCredentials: true});
      
      setLoading(false);
      
      setState((prevState) => ({
        ...prevState,
        user: res.data.data.user,
        alert: { type: "success", message: res.data.message, timeOut: 2000 },
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        alert: { type: "danger", message: error.response ? error.response.data.message: error.message },
      }));

      setLoading(false);
    }
    };

    // password form data
  const [passwordFrom, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const { oldPassword, newPassword, confirmPassword } = passwordFrom;
  
  const [passwordFormLoading, setPasswordFormLoading] = useState(false);

  const passwordInputChange = e => setPasswordForm({ ...passwordFrom, [e.target.name]: e.target.value });
  
  const submitPasswordForm = async (e) => {
    try {
      e.preventDefault();
      setPasswordFormLoading(true);
      
      // send request with data
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API || "api"}/v1/users/update-password`,passwordFrom, {withCredentials: true});

      setPasswordFormLoading(false);
      setState((prevState) => ({
        ...prevState,
        user: res.data.data.user,
        alert: { type: "success", message: res.data.message, timeOut: 2000 }
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        alert: { type: "danger", message: error.response ? error.response.data.message: error.message },
      }));

      setPasswordFormLoading(false);
    }
  }

  // delete account 
  const deleteAccount = async () => {
    try {
      if (!confirm('Are you sure? Your account will be permanently deleted!')) return;

      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/users/delete-me`, { withCredentials: true });
      setState({ ...state, loggedIn: false, user: null, alert: { type: 'danger', message: res.data.message, timeOut: 2000 } });
      settimeout(() => router.push('/login'), 2000)
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        alert: { type: "danger", message: error.response ? error.response.data.message: error.message },
      }));
    }
  }

  // upload photo
  const setPhoto = async e => {
    try {
      const file = e.target.files[0]
      const photoPreview = await readFile(file);
      setPhotolabel("One file Chosen");
      setFormData({ ...formData, photo: file, photoPreview });
    } catch (error) {
      setState({...state, alert: {type: 'danger', message: error.message}})
    }
  }

    return (
      <div className="p-3">
        <div className="col-md-6 mx-auto ">
          <BreadCrumb />
          <h2 className="mt-5">Update Your Profile</h2>
          <form
            className="p-3 rounded shadow-lg border rounded"
            onSubmit={submitForm}
          >
            <div className="form-group d-flex align-items-center">
              <div className="col p-0">
                <Image
                  src={formData.photoPreview || `/img/users/${
                    state.user?.photo ? state.user.photo : "user.jpg"
                  }`}
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
                <File
                  type="file"
                  name="photo"
                  id="photo"
                  onChange={setPhoto}
                />
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
              <label htmlFor="phone">Phone</label>
              <input
                type="number"
                className="form-control"
                name="phone"
                id="phone"
                onChange={inputChange}
                value={phone}
              />
            </div>
            <SubmitButton loading={loading}>Update</SubmitButton>
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
                autoComplete='true'
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
                autoComplete='true'
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
                autoComplete='true'
                minLength={8}
                maxLength={16}
              />
            </div>
            <SubmitButton loading={passwordFormLoading}>Update</SubmitButton>
          </form>
          <button className="btn btn-danger mt-5" onClick={deleteAccount}>Delete Account</button>
        </div>
      </div>
    );
}

export default index

const File = styled.input`
  height: .1px;
  width: .1px;
  opacity: 0;

`