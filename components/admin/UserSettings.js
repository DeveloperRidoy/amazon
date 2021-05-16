import axios from "axios";
import { createRef, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import SubmitButton from "../Button/SubmitButton/SubmitButton";
import User from "./User";
import { LayoutRef } from "../../pages/admin";

const initialData = {
  name: "",
  role: "USER",
  _id: "",
  searchType: "name",
};

function UserSettings(e) {
  const { state, setState } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);

  const [searchData, setSearchData] = useState(initialData);

  const nameRef = createRef(null);

  const idRef = createRef(null);

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
      e && e.preventDefault();

      // focus the text input for better experience
      searchData.searchType === "name"
        ? nameRef.current.focus()
        : idRef.current.focus();

      const data = { ...searchData };

      // delete unnecessary info
      data.name === '' && delete data.name;
      data.role === '' && delete data.role;
      data._id === '' && delete data._id;
      delete data.searchType;

      // check if _id length is 24 
      if (data._id && data._id.length !== 24) {
        return setState({ ...state, alert: { type: 'danger', message: 'invalid id' } });
      }


      // state update
      setLoading(true);
      setSearchData({ ...searchData, name: "", _id: "" });
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

  // get all users on first load
  useEffect(() => searchUser(), []);

  return (
    <div style={{ position: "relative" }}>
      <form
        onSubmit={searchUser}
        className="col-md-7 bg-white py-1 shadow mb-3"
        style={{
          position: "sticky",
          overflowY: "hidden",
          top: 30,
          left: 0,
          zIndex: 2,
        }}
      >
        <div className="form-group">
          <label htmlFor={searchData.searchType === 'name' ? 'name': '_id'}>
            <h3>
              <b>Search users</b>
            </h3>
          </label>
          <div className="input-group">
            <div className="mr-n1" style={{ width: 100 }}>
              <select
                name="searchType"
                id="searchType"
                className="form-control form-control-lg"
                value={searchData.searchType}
                onChange={e => {
                  e.target.value === 'name'
                    ? setSearchData({ ...searchData, _id: '', searchType: e.target.value })
                    : setSearchData({ ...searchData, name: '', searchType: e.target.value });
                }}
              >
                <option value="name">name</option>
                <option value="id">id</option>
              </select>
            </div>
            {searchData.searchType === "name" ? (
              <input
                ref={nameRef}
                type="text"
                className="form-control form-control-lg"
                name="name"
                id="name"
                placeholder="search by name..."
                value={searchData.name}
                onChange={inputchange}
              />
            ) : (
              searchData.searchType === "id" && (
                <input
                  ref={idRef}
                  type="text"
                  className="form-control form-control-lg"
                  name="_id"
                  id="_id"
                  placeholder="search by id..."
                  value={searchData._id}
                  onChange={inputchange}
                />
              )
            )}
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
                disabled={
                  !searchData.name && !searchData.role && !searchData._id
                }
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
        <div>
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
        </div>
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
