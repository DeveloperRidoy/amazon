import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { motion } from 'framer-motion';
import Product from "./Product";
import AddProduct from "./AddProduct";

const initialProductData = {
  name: "",
  price: "",
  brand: "",
  colors: [],
  description: "",
  summary: "",
  ratingsCount: "",
  ratingsAverage: "",
  bestSeller: false,
  category: "",
  coverPhoto: "",
  coverPhotoPreview: "",
  coverPhotoSrc: "",
  photos: {},
  photosPreview: [],
  photosSrc: [],
  specs: [],
  specName: "",
  specValue: "",
  shippingCountries: [],
  gender: "all",
  stock: "",
  sizes: [],
  editId: ''
};

function ProductSettings () {

  const { state } = useContext(GlobalContext);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productsNavigation, setProductsNaavigation] = useState({start: 0, limit: 9})
  const [products, setProducts] = useState(state.products.slice(productsNavigation.start, productsNavigation.start + productsNavigation.limit));
  const [searchInput, setSearchInput] = useState('');
  const [productData, setProductData] = useState(initialProductData);

  useEffect(() => {
    products !== state.products &&
      setProducts(
        state.products.slice(
          productsNavigation.start,
          productsNavigation.start + productsNavigation.limit
        )
      );
  }, [state.products, productsNavigation])
    return (
      <div>
        <motion.button
          className="btn text-white mx-3 mb-3"
          style={{ background: "#2C3E50" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowAddProduct(!showAddProduct);
            showAddProduct && setProductData(initialProductData)
          }}
        >
          <h4 className="mb-0">{showAddProduct ? "Cancel" : "+Add Product"}</h4>
        </motion.button>
        {showAddProduct && (
          <AddProduct
            className="col-md-10"
            setShowAddProduct={setShowAddProduct}
            productData={productData}
            setProductData={setProductData}
            initialProductData={initialProductData}
          />
        )}
        <div className="row row-cols-1 mx-0 mt-4" style={{ maxWidth: 1060 }}>
          {!showAddProduct && (
            <div className="col-lg-6 px-0 mb-3">
              <div className="input-group input-group-lg col">
                <input
                  type="text"
                  placeholder="Search Products by name..."
                  className="form-control"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    e.target.value === ""
                      ? setProducts(state.products.slice(productsNavigation.start, productsNavigation.start + productsNavigation.limit))
                      : setProducts(
                          state.products.filter((product) =>
                            product.name
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                          )
                        );
                  }}
                />
                <div className="input-group-append">
                  <button
                    disabled={searchInput.length === 0}
                    className="btn btn-dark"
                    onClick={() => {
                      setProducts(
                        state.products.filter((product) =>
                          product.name
                            .toLowerCase()
                            .includes(searchInput.toLowerCase())
                        )
                      );
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          )}
          {!showAddProduct &&
            products.length > 0 &&
            products.map((product) => (
              <Product
                key={product._id}
                product={product}
                setShowAddProduct={setShowAddProduct}
                setProductData={setProductData}
              />
            ))}
        </div>
        {!showAddProduct && searchInput.length === 0 && state.products.length > productsNavigation.start + productsNavigation.limit && (
          <button className="btn btn-outline-dark mx-3" onClick={() => setProductsNaavigation({...productsNavigation, start: productsNavigation.start + productsNavigation.limit})}>next</button>
        )}
        {!showAddProduct && searchInput.length === 0 && productsNavigation.start > 0 && (
          <button className="btn btn-outline-dark mx-3" onClick={() => setProductsNaavigation({...productsNavigation, start: productsNavigation.start - productsNavigation.limit})}>prev</button>
        )}
      </div>
  );
}

export default ProductSettings