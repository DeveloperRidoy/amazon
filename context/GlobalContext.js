import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Spinner from "../components/Spinners/Spinner";

export const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {

  const [state, setState] = useState({
      alert: {
        type: null,
        message: null
        },
      loading: true,
      loggedIn: false,
      user: {
        name: null,
        email: null,
        role: null,
        photo: null,
        _id: null
    },
    products: [],
    categories: [],
    colors: [],
    countries: []
    });
    const { alert, loading } = state;
  
    useEffect(() => {
        alert && alert.type && alert.message && setTimeout(() => {
            setState({ ...state, alert: null });
        }, alert.timeOut || 5000)
    }, [alert])

  useEffect( async () => {
    try {
      const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/users/auth`, {withCredentials: true});
      const productsRes = await axios.get(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/products`, {withCredentials: true});
      const categoryRes = await axios.get(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/categories`, {withCredentials: true});
      const countryRes = await axios.get(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/countries`, {withCredentials: true});
      const colorRes = await axios.get(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/colors`, { withCredentials: true });
      return setState({
        ...state,
        loading: false,
        products: productsRes.data.data.products,
        categories: categoryRes.data.data.categories,
        colors: colorRes.data.data.colors,
        countries: countryRes.data.data.countries,
        loggedIn: userRes.data.status === 'success' ? true : false,
        user: userRes.data.status === 'success' ? userRes.data.data.user : null
      });
    } catch (error) {
      setState({ ...state, loading: false, alert: {type: 'danger', message: 'Network Error'} });
    }
    }, [])

  return (
    <GlobalContext.Provider value={{ state, setState }}>
      {alert && alert.message && (
        <h4
          className={`alert alert-${alert.type}`}
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 4,
          }}
        >
          {alert.message}
        </h4>
      )}
      {loading
        ? (
        <Spinner
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />
        )
        : children
    }
      
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;