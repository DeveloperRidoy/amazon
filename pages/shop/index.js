import { useContext, useState } from 'react';
import styled from 'styled-components';
import { GlobalContext } from '../../context/GlobalContext';
import { motion } from 'framer-motion';
import { FaSync } from 'react-icons/fa';
import ProductPreview from '../../components/shop/ProductPreview';

const initialFilter = {
  price: 2000,
  category: "",
  country: "",
  gender: "",
  bestSeller: "",
  ratingsAverage: 5,
};

function Shop () {

  const { state, setState } = useContext(GlobalContext);

  const [filteredProducts, setFilteredProducts] = useState(state.products);
  
  const [filter, setFilter] = useState(initialFilter)
  
  const filterByName = e => {
     e.target.value === ""
       ? setFilteredProducts(state.products)
       : setFilteredProducts(
           state.products.filter((product) =>
             product.name
               .toLowerCase()
               .split(" ")
               .join("")
               .includes(e.target.value.toLowerCase().split(" ").join(""))
           )
         );
  }

  const inputChangeHandler = e => {
    setFilter({...filter, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked: e.target.value})
    let updatedProducts = [...state.products];

    Object.keys(filter).forEach(field => {
      switch (e.target.name) {
        case field:
            e.target.value !== ''
            ? field === 'price'
            ? updatedProducts = updatedProducts.filter(product => field in product ? product[field] <= e.target.value: true)
            : field === 'category'
            ? updatedProducts = updatedProducts.filter(product => product[field]._id === e.target.value)
            :field === 'ratingsAverage'
            ? updatedProducts = updatedProducts.filter(product => field in product ? product[field] <= e.target.value: true)
            : field === 'country'
            ? updatedProducts = updatedProducts.filter(product => 'shippingCountries' in product ? product.shippingCountries.some(country => country._id.includes(e.target.value)) : true)
            : field === 'bestSeller'
            ? updatedProducts = updatedProducts.filter(product => field in product && e.target.checked === true ? product[field] === true : true)
            : updatedProducts = updatedProducts.filter(product => field in product ? product[field] === e.target.value: true)
            : ''
          break;
        default:
          filter[field] !== ''
            ?field === 'price'
            ? updatedProducts = updatedProducts.filter(product => 'price' in product ? product.price <= filter[field] : true)
            : field === 'category'
            ? updatedProducts = updatedProducts.filter(product => product[field]._id === filter[field])
            :field === 'ratingsAverage'
            ? updatedProducts = updatedProducts.filter(product => 'ratingsAverage' in product ? product.ratingsAverage <= filter[field]: true)
            : field === 'country'
            ? updatedProducts = updatedProducts.filter(product => 'shippingCountries' in product ? product.shippingCountries.some(country => country._id.includes(filter[field])) : true)
            : field === 'bestSeller'
            ? updatedProducts = updatedProducts.filter(product => field in product && filter[field] === true ? product[field] === true : true)
            : updatedProducts = updatedProducts.filter(product => field in product ? product[field] === filter[field]: true)
            : ''

      }
    })
  
    setFilteredProducts(updatedProducts);
  } 
  const filterProducts = e => {
    e.preventDefault();
  }
    return (
      <div className="d-flex mx-auto" style={{ maxWidth: 1350 }}>
        <Controls className="col-12 col-md-3 p-3">
          <form onSubmit={filterProducts}>
            <div className="input-group mb-3">
              <input
                type="text"
                name="search"
                id="search"
                className="form-control"
                autoComplete="true"
                onChange={filterByName}
                placeholder="search product..."
              />
              <div className="input-group-append">
                <button className="btn btn-dark">Search</button>
              </div>
            </div>
            <h3>Sort by</h3>
            <div className="mb-3">
              <label htmlFor="price">
                <b>price (${filter.price})</b>
              </label>
              <input
                type="range"
                name="price"
                id="price"
                min="0"
                max="2000"
                className="form-control-range"
                value={filter.price}
                onChange={inputChangeHandler}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category">
                <b>category</b>
              </label>
              <select
                name="category"
                id="category"
                className="form-control"
                value={filter.category}
                onChange={inputChangeHandler}
              >
                <option value="">Select a category</option>
                {state.categories.map((category) => (
                  <option value={category._id} key={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="country">
                <b>Shipping Country</b>
              </label>
              <select
                name="country"
                id="country"
                className="form-control"
                value={filter.country}
                onChange={inputChangeHandler}
              >
                <option value="">Select a country</option>
                {state.countries.map((country) => (
                  <option value={country._id} key={country._id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="bestSeller"
                id="bestSeller"
                className="form-check-input mt-1"
                checked={filter.bestSeller}
                onChange={inputChangeHandler}
              />
              <label htmlFor="bestSeller" className="form-check-label">
                <b>BestSeller</b>
              </label>
            </div>
            <div className="mb-3">
              <label htmlFor="ratingsAverage">
                <b>Rating ({filter.ratingsAverage})</b>
              </label>
              <input
                type="range"
                name="ratingsAverage"
                id="ratingsAverage"
                min="0"
                max="5"
                step=".1"
                className="form-control-range"
                value={filter.ratingsAverage}
                onChange={inputChangeHandler}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="gender">
                <b>Gender specific</b>
              </label>
              <select
                name="gender"
                id="gender"
                className="form-control"
                value={filter.gender}
                onChange={inputChangeHandler}
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <button type="submit" className="btn btn-dark">
              Filter
            </button>
            <button
              className="btn btn-dark ml-3"
              type="button"
              data-toggle="tooltip"
              data-placement="top"
              title="Tooltip on top"
              onClick={() => {
                setFilter(initialFilter);
                setFilteredProducts(state.products);
              }}
            >
              <FaSync />
            </button>
          </form>
        </Controls>
        <Layout className="col-12 col-md-9 py-3" layout>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
            {filteredProducts.length > 0 &&
              filteredProducts.map((product) => (
                <ProductPreview key={product._id} product={product} />
              ))}
          </div>
        </Layout>
      </div>
    );
}

export default Shop

const Controls = styled.div`
  box-shadow: 0 0 15px rgba(0, 0, 0, .2);
  position: sticky;
  top: 0;
  left: 0;
  height: max-content;
`

const Layout = styled(motion.div)`
  
`