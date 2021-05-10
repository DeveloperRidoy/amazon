import axios from "axios";
import { createRef, useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { motion } from "framer-motion";
import SubmitButton from "../Button/SubmitButton/SubmitButton";
import User from "./User";
import { LayoutRef } from "../../pages/admin";

const initialData = {
  name: "",
  role: "",
};

function UserSettings(e) {
  const { state, setState } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);

  const [searchData, setSearchData] = useState(initialData);

  const nameRef = createRef(null);

  const [filteredUsers, setFilteredUsers] = useState({
    users: [],
    searched: false,
    currentIndex: 0,
    limit: 10,
    breadCrumbs: [],
  });

  const inputchange = (e) =>
    setSearchData({
      ...searchData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const searchUser = async (e) => {
    try {
      e.preventDefault();
      const data = { ...searchData };

      // delete unnecessary info
      data.name === "" && delete data.name;
      data.role === "" && delete data.role;

      // focus the text input for better experience
      nameRef.current.focus();

      // state update
      setLoading(true);
      setSearchData({ ...searchData, name: "" });
      const res = await axios.post(`/api/v1/users/query`, data);
      setLoading(false);
      const breadCrumbs = [];
      res.data.data.users.forEach(
        (user, i) =>
          i < res.data.data.users.length / filteredUsers.limit &&
          breadCrumbs.push(i)
      );
      setFilteredUsers({
        ...filteredUsers,
        users: res.data.data.users,
        searched: true,
        breadCrumbs,
      });

      // scroll to top
      LayoutRef.current.scrollTop = 0;
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
    <div style={{ position: "relative" }}>
      <form
        onSubmit={searchUser}
        className="col-md-7 bg-white shadow pb-1"
        style={{
          position: "sticky",
          overflowY: "hidden",
          top: 43,
          left: 0,
          zIndex: 2,
        }}
      >
        <div className="form-group">
          <label htmlFor="name">
            <h3>
              <b>Search users</b>
            </h3>
          </label>
          <div className="input-group">
            <input
              ref={nameRef}
              type="text"
              className="form-control form-control-lg"
              name="name"
              placeholder="user name..."
              value={searchData.name}
              onChange={inputchange}
            />
            <div className="ml-n1">
              <select
                name="role"
                id="role"
                className="form-control form-control-lg"
                value={searchData.role}
                onChange={inputchange}
              >
                <option value="">any</option>
                <option value="ADMIN">admin</option>
                <option value="USER">user</option>
              </select>
            </div>
            <div className="input-group-append">
              <SubmitButton
                disabled={!searchData.name && !searchData.role}
                className="btn bg-dark text-white"
                loading={loading}
                spinColor="white"
              >
                Search
              </SubmitButton>
            </div>
          </div>
        </div>
      </form>
      {filteredUsers.searched && filteredUsers.users.length > 0 ? (
        <motion.div layout>
          <div>
            {filteredUsers.users.map((user, i) => {
              if (
                i >= filteredUsers.currentIndex &&
                i < filteredUsers.currentIndex + filteredUsers.limit
              ) {
                return (
                  <User
                    key={user._id}
                    i={i}
                    user={user}
                    filteredUsers={filteredUsers}
                    setFilteredUsers={setFilteredUsers}
                    setSearchData={setSearchData}
                  />
                );
              }
            })}
          </div>
          <ol className="breadcrumb font-weight-bold mt-auto">
            {filteredUsers.breadCrumbs.map((i) => (
              <li
                key={i}
                className={`breadcrumb-item  ${
                  i === filteredUsers.currentIndex / filteredUsers.limit
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setFilteredUsers({
                    ...filteredUsers,
                    currentIndex: i * filteredUsers.limit,
                  });
                  LayoutRef.current.scrollTop = 0;
                }}
              >
                <a href="#" style={{ fontSize: 15 }}>
                  {i + 1}
                </a>
              </li>
            ))}
          </ol>
        </motion.div>
      ) : (
        filteredUsers.searched &&
        filteredUsers.users?.length === 0 && (
          <h3 className="mt-3">No users found</h3>
        )
      )}
    </div>
  );
}

export default UserSettings;
