import { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { GlobalContext } from "../../context/GlobalContext";
import Image from "next/image";
import { readFile, readFiles } from "../../utils/fileReader";
import { v4 as uid } from 'uuid';
import axios from "axios";
import SubmitButton from '../Button/SubmitButton/SubmitButton';
import { FaTimesCircle } from 'react-icons/fa'
import { motion } from "framer-motion";
import { AdminContext } from "../../pages/admin";

function AddProduct ({ className, setShowAddProduct, productData, setProductData }) {
  
  const { LayoutRef } = useContext(AdminContext);
  const { state, setState } = useContext(GlobalContext);
  const specNAmeRef = useRef(null);
  const [formLading, setformLading] = useState(false);

  // upload coverPhoto
  const uploadProductPhoto = async (e) => {
    try {
      const coverPhotoPreview = await readFile(e.target.files[0]);
      setProductData({
        ...productData,
        coverPhoto: e.target.files[0],
        coverPhotoPreview,
      });
    } catch (error) {
      setState({ ...state, alert: { type: "danger", message: error.message } });
    }
  };

  // upload multiple photos
  const uploadProductPhotos = async (e, limit) => {
    try {
      const files = e.target.files; 
      const filesArr = Object.values(files);
      if (limit >= filesArr.length) { limit = filesArr.length };
      const photosPreview = await readFiles(files, limit);
      const photos = {}
      Object.keys(files).filter(key => Number(key) < limit).forEach(key => photos[key] = files[key])
      setProductData({ ...productData, photos, photosPreview });
    } catch (error) {
      setState({ ...state, alert: { type: "danger", message: error.message } });
    }
  };

  // input change handler
  const inputChange = (e) => {
    setProductData({
      ...productData, [e.target.name]: e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value
    });
  }

  // add spec 
  const addSpec = () => {
    specNAmeRef.current.focus();
    setProductData({
      ...productData,
      specName: "",
      specValue: "",
      specs: [
        { id: uid(), name: productData.specName, value: productData.specValue },...productData.specs
      ],
    });
  }
    
  // remove spec
  const removeSpec = spec => {
    const updatedSpecs = [...productData.specs.filter(item => item._id ? item._id !== spec._id : item.id !== spec.id)];
    setProductData({ ...productData, specs: updatedSpecs });
  }   

  // update spec
  const updateSpec = (spec, property, value) => {
    const updatedSpecs = [...productData.specs];
    const updateIndex = updatedSpecs.findIndex(item => item._id ? item._id === spec._id : item.id === spec.id);
    updatedSpecs[updateIndex][property] = value;
    setProductData({ ...productData, specs: updatedSpecs })
  }

  // submit productdata form
  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      setformLading(true)

      //(1) filter unnecessary information and create new data 
      const filteredData = Object.keys(productData).filter(
        (key) =>
          key !== "specName" &&
          key !== "specValue" &&
          key !== "photosPreview" &&
          key !== "coverPhotoPreview" &&
          key !== 'id' &&
          key !== '_id' &&
          key !== 'createdAt'
      );
      
      const data = {};
      filteredData.forEach(key => data[key] = JSON.stringify(productData[key]));
    
      //(3) create new FormData with the filtered data
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));

      //(4) separate the photos files array into separate file with the name of photos
      productData.photosPreview?.length > 0 && Object.keys(productData.photos).forEach(key => formData.append('photos', productData.photos[key]));
      
      // (5) append coverPhoto
      productData.coverPhotoPreview && formData.append('coverPhoto', productData.coverPhoto);
 
      //(6) send request with formData
      const res = productData.editId 
        ? await axios.patch(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/products/${productData.editId}`, formData, {withCredentials: true})
        : await axios.post(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/products`, formData, { withCredentials: true });
      setState({
        ...state,         
        alert: { type: "success", message: res.data.message },
        products: productData.editId
          ? [res.data.data.product, ...state.products.filter(product => product._id !== res.data.data.product._id)]
          : [res.data.data.product, ...state.products],
      });

      //(7) cleanup after finishing request
      setformLading(false)
      setShowAddProduct(false);
      LayoutRef.current.scrollTo(0, 0);
    } catch (error) {
      setformLading(false)
      setState({ ...state, alert: { type: 'danger', message: error.response?.data?.message || error.message } }) 
    }
  };   
      
  return (
    <div className={className}>
      <Form encType="multipart/form-data" onSubmit={formSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-control"
            value={productData.name}
            onChange={inputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            step=".01"
            id="price"
            className="form-control"
            min="0"
            value={productData.price}
            onChange={inputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            name="brand"
            id="brand"
            className="form-control"
            value={productData.brand}
            onChange={inputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="colors">Colors</label>
          <select
            multiple
            name="colors"
            id="colors"
            className="form-control mb-3"
            value={productData.colors}
            required
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
          >
            {state.colors?.length > 0 &&
              state.colors.map((color) => (
                <option key={color._id} value={color._id}>
                  {color.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="countries">Shipping Countries</label>
          <select
            multiple
            name="countries"
            id="countries"
            className="form-control mb-3"
            value={productData.shippingCountries}
            required
            onChange={(e) =>
              setProductData({
                ...productData,
                shippingCountries: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
          >
            {state.countries?.length > 0 &&
              state.countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="summary">Summary</label>
          <input
            type="text"
            name="summary"
            id="summary"
            className="form-control"
            value={productData.summary}
            onChange={inputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            cols="10"
            rows="3"
            className="form-control"
            value={productData.description}
            onChange={inputChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="ratingsCount">RatingsCount</label>
          <input
            type="number"
            name="ratingsCount"
            id="ratingsCount"
            className="form-control "
            min="0"
            value={productData.ratingsCount}
            onChange={inputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ratingsAverage">RatingsAverage</label>
          <input
            type="number"
            name="ratingsAverage"
            id="ratingsAverage"
            className="form-control"
            value={productData.ratingsAverage}
            onChange={(e) => {
              const value = e.target.value;
              e.target.value = value <= 0 ? 0 : value >= 5 ? 5 : value;
              inputChange(e);
            }}
          />
        </div>

        <div className="form-group">
          <div className="form-check">
            <input
              type="checkbox"
              name="bestSeller"
              id="bestSeller"
              className="form-check-input"
              value={productData.bestSeller}
              onChange={inputChange}
            />
            <label htmlFor="bestSeller" className="form-check-label">
              Best Seller
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            className="form-control mb-3"
            value={productData.category}
            onChange={inputChange}
          >
            <option value="">
              Select A Category
            </option>
            {state.categories?.length > 0 &&
              state.categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Gender specific?</label>
          <div className="form-check">
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              className="form-check-input"
              onClick={inputChange}
            />
            <label htmlFor="male" className="form-check-label">
              Male
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              onClick={inputChange}
              className="form-check-input"
            />
            <label htmlFor="female" className="form-check-label">
              Female
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              name="gender"
              id="all"
              value="all"
              defaultChecked
              onClick={inputChange}
              className="form-check-input"
            />
            <label htmlFor="all" className="form-check-label">
              All
            </label>
          </div>
        </div>
        <div className="mb-3 d-flex align-items-center">
          <WithCross className="mr-3">
            <Image
              height="50"
              width="50"
              className="rounded"
              src={
                productData.coverPhotoPreview ||
                `/img/products/${productData.coverPhotoSrc || "product.png"}`
              }
            />
            {productData.coverPhoto && (
              <motion.div
                className="cross"
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setProductData({
                    ...productData,
                    coverPhoto: "",
                    coverPhotoPreview: "",
                    coverPhotoSrc: "",
                  });
                }}
              >
                <FaTimesCircle />
              </motion.div>
            )}
          </WithCross>
          <label htmlFor="coverPhoto" className="btn btn-dark">
            Upload coverPhoto
          </label>
          <File
            type="file"
            name="coverPhoto"
            id="coverPhoto"
            className="form-control-file"
            accept="image/*"
            onChange={uploadProductPhoto}
            required={!productData.editId}
          />
        </div>
        <div className="mb-3 d-flex align-items-center">
          <div className="mr-3 d-flex">
            {productData.photosSrc?.length > 0 ? (
              productData.photosSrc.map((src, i) => (
                <WithCross key={i} className="mr-3">
                  <Image
                    height="50"
                    width="50"
                    className="rounded mr-2"
                    src={`/img/products/${src}`}
                  />
                  <motion.div
                    className="cross"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const updatedPhotos = { ...productData.photos };
                      delete updatedPhotos[i];
                      const updatedPhotosPreview = productData.photosPreview.filter(
                        (preview) =>
                          productData.photosPreview.indexOf(preview) !== i
                      );
                      setProductData({
                        ...productData,
                        photos: updatedPhotos,
                        photosPreview: updatedPhotosPreview,
                      });
                    }}
                  >
                    <FaTimesCircle />
                  </motion.div>
                </WithCross>
              ))
            ) : productData.photosPreview?.length > 0 ? (
              productData.photosPreview.map((preview, i) => (
                <WithCross key={i} className="mr-3">
                  <Image
                    height="50"
                    width="50"
                    className="rounded mr-2"
                    src={preview}
                  />
                  <motion.div
                    className="cross"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const updatedPhotos = { ...productData.photos };
                      delete updatedPhotos[i];
                      const updatedPhotosPreview = productData.photosPreview.filter(
                        (preview) =>
                          productData.photosPreview.indexOf(preview) !== i
                      );
                      setProductData({
                        ...productData,
                        photos: updatedPhotos,
                        photosPreview: updatedPhotosPreview,
                      });
                    }}
                  >
                    <FaTimesCircle />
                  </motion.div>
                </WithCross>
              ))
            ) : (
              <Image
                height="50"
                width="50"
                className="rounded"
                src="/img/products/product.png"
              />
            )}
          </div>
          <label htmlFor="photos" className="btn btn-dark">
            Upload 3 photos
          </label>
          <File
            type="file"
            multiple
            name="photos"
            id="photos"
            className="form-control-file"
            accept="image/*"
            onChange={(e) => uploadProductPhotos(e, 3)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="sizes">Sizes</label>
          <select
            name="sizes"
            id="sizes"
            multiple
            className="form-control"
            value={productData.sizes}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: Array.from(
                  e.target.selectedOptions,
                  (item) => item.value
                ),
              })
            }
          >
            <option value="sm">sm</option>
            <option value="lg">lg</option>
            <option value="xl">xl</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            name="stock"
            id="stock"
            min="0"
            className="form-control"
            value={productData.stock}
            onChange={inputChange}
          />
        </div>
        <div className="mb-3">
          <h5>Specs</h5>
          <div className="d-flex aling-items-center">
            <input
              ref={specNAmeRef}
              type="text"
              name="specName"
              id="specName"
              className="form-control col-3 mr-1"
              placeholder="name"
              onChange={inputChange}
              value={productData.specName || ""}
            />
            <div className="input-group">
              <input
                type="text"
                name="specValue"
                id="specValue"
                className="form-control"
                placeholder="Info"
                onChange={inputChange}
                value={productData.specValue || ""}
              />
              <div className="input-group-append">
                <button
                  disabled={!productData.specName || !productData.specValue}
                  type="button"
                  className="btn btn-dark"
                  onClick={addSpec}
                >
                  +Add
                </button>
              </div>
            </div>
          </div>
          {productData.specs.length > 0 &&
            productData.specs.map((spec) => (
              <div className="d-flex aling-items-center mt-3" key={spec.id || spec._id}>
                <input
                  type="text"
                  name={spec.name}
                  className="form-control col-3 mr-1"
                  defaultValue={spec.name}
                  onChange={(e) => updateSpec(spec, "name", e.target.value)}
                />
                <div className="input-group">
                  <input
                    type="text"
                    name={spec.value}
                    className="form-control"
                    defaultValue={spec.value}
                    onChange={(e) => updateSpec(spec, "value", e.target.value)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-dark"
                      type="button"
                      onClick={() => removeSpec(spec)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="d-flex">
          <SubmitButton
            loading={formLading}
            className="text-white bg-dark"
            spinColor="white"
          >
            Submit{" "}
          </SubmitButton>
          <button
            className="btn btn-outline-dark ml-3"
            onClick={() => setShowAddProduct(false)}
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}

export default AddProduct;

const Form = styled.form`
  padding: 15px;
  font-size: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  input,
  textarea,
  select {
    font-size: 15px;
    font-weight: 500;
    color: black;
    ::placeholder {
      color: black;
      font-size: 13px;
      font-weight: 400;
    }
  }
`;

const File = styled.input`
  opacity: 0;
  height: 0.1px;
  width: 0.1px;
`;

const WithCross = styled.div`
  position: relative;
  .cross {
    position: absolute;
    top: -11px;
    color: red;
    left: 38px;
    font-size: 15px;
    cursor: pointer;
    background: white;
    border-radius: 50%;

  }
`;