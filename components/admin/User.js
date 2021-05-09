import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styled from 'styled-components';
import { PencilRuler, TrashAlt } from "../icons";
import SubmitButton from '../Button/SubmitButton/SubmitButton';
import axios from 'axios';

const User = ({ user, i, setFilteredUsers, filteredUsers }) => {
  const { state, setState } = useContext(GlobalContext);

  const [expand, setExpand] = useState(false);

  const [loading, setLoading] = useState(false);

  const [data, setdata] = useState({
    name: user.name,
    email: user.email,
    password: "",
    photo: user.photo,
    role: user.role,
  });

  const inputChange = (e) =>
    setdata({
      ...data,
      [e.target.name]:
      e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const updateUser = async (e) => {
    try {
        e.preventDefault();
        const info = { ...data };
      !info.password && delete info.password

      setLoading(true);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API || "api"}/v1/users/${user._id}`,
        info,
        { withCredentials: true }
        );
        setdata({ ...data, password: '' });
        setLoading(false);
        setExpand(false);
        setState({ ...state, user: user._id === state.user._id ? res.data.data.user: state.user, loggedIn: !info.password && !user._id !== state.user._id });
        setFilteredUsers({
          ...filteredUsers,
          users: filteredUsers.users.map((prevUser) =>
            prevUser._id === user._id
              ? (prevUser = res.data.data.user)
              : prevUser
          ),
        });
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

  const deleteUser = async () => {
    try {
      if (!confirm('Permanently delete this user?')) return;
      await axios.delete(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/users/${user._id}`, { withCredentials: true })
      const breadCrumbs = [];
      const updatedUsers = filteredUsers.users.filter(prevUser => prevUser._id !== user._id);
      updatedUsers.forEach(
        (user, i) =>
          i < updatedUsers.length / filteredUsers.limit && breadCrumbs.push(i)
      );
      setFilteredUsers({
        ...filteredUsers,
        users: updatedUsers,
        breadCrumbs,
        currentIndex:
          i === filteredUsers.currentIndex
            ? filteredUsers.currentIndex - filteredUsers.limit
            : filteredUsers.currentIndex,
      });
    } catch (error) {
      setState({
        ...state,
        alert: {
          type: "danger",
          message:
            error.response?.data?.message || error.message || "Network Error",
        },
      });
    }
  }

  return (
    <div className="d-flex align-items-center p-3 mb-3 shadow">
      {!expand ? (
        <div className="d-flex align-items-center">
          <img
            src={`/img/users/${user.photo || "user.jpg"}`}
            alt={user.name}
            className="rounded-circle"
            height={60}
            width={60}
          />
          <div className="col px-0 ml-3">
            <h5>
              <b>Name: </b>
              {user.name}
            </h5>
            <h5>
              <b>Role: </b>
              {user.role}
            </h5>
            <div className="col px-0 d-inline-flex">
              <div
                className="mr-3 p-0"
                tooltip="edit user"
                style={{ cursor: "pointer" }}
                onClick={() => setExpand(true)}
              >
                <PencilRuler fontSize="12px" />
              </div>
              <div
                className="mr-3 p-0"
                tooltip="delete user"
                style={{ cursor: "pointer" }}
                onClick={deleteUser}
              >
                <TrashAlt fontSize="12px" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <StyledForm onSubmit={updateUser} className="col">
          <div className="form-group d-flex align-items-center">
            <img
              src={`/img/users/${user.photo || "user.jpg"}`}
              alt={user.name}
              style={{ height: 50, width: 50, borderRadius: "50%" }}
            />
            <input
              type="file"
              name="photo"
              id="photo"
              style={{ height: 0.1, width: 0.1, opacity: 0 }}
            />
            <label htmlFor="photo" className="btn btn-outline-dark mb-0 ml-3">
              Upload photo
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              placeholder="name"
              value={data.name}
              onChange={inputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              className="form-control"
              placeholder="email"
              value={data.email}
              onChange={inputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              className="form-control"
              name="role"
              value={data.role}
              onChange={inputChange}
            >
              <option value="ADMIN">admin</option>
              <option value="USER">user</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              minLength="8"
              name="password"
              id="password"
              autoComplete="off"
              className="form-control"
              placeholder="password"
              value={data.password}
              onChange={inputChange}
            />
          </div>
          <div className="d-flex">
            <SubmitButton
              className="btn bg-dark text-white"
              spinColor="white"
              loading={loading}
            >
              Update
            </SubmitButton>
            <button
              type="button"
              className="btn btn-outline-dark ml-3"
              onClick={() => setExpand(false)}
            >
              Cancel
            </button>
          </div>
        </StyledForm>
      )}
    </div>
  );
};

export default User;

const StyledForm = styled.form`
  label {
    font-weight: bold;
  }
`;
