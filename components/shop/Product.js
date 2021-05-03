import { Star } from "../icons";
import Image from 'next/image';
import { useContext, useEffect, useState } from "react";
import styled from 'styled-components';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { GlobalContext } from '../../context/GlobalContext';
import { useRouter } from 'next/router';
import axios from "axios";
import SubmitButton from '../Button/SubmitButton/SubmitButton';

function Product ({ product }) {
  
  const initialState = {
    stock: product.stock,
    quantity: 0,
    color: null,
    shippingCountry: null,
    size: null,
    loading: false
  };

  const Router = useRouter();

  const { state, setState } = useContext(GlobalContext);

  const [currentPhoto, setCurrentPhoto] = useState({photo: ''})

  const [productInfo, setProductInfo] = useState(initialState) 

  const inputChange = e => setProductInfo({...productInfo, [e.target.name]: e.target.value})

  useEffect(() => {setProductInfo(initialState)}, [Router.query])

  const addToCart = async e => {
    e.preventDefault();
    if (productInfo.quantity === 0) {
      setState({ ...state, alert: { type: 'danger', message: 'Please select atleast one item' } })
      return;
    }

    try {
      setProductInfo({ ...productInfo, loading: true })
      
      const updatedCart = [{ product: product._id, quantity: productInfo.quantity, color: productInfo.color, shippingCountry: productInfo.shippingCountry, size: productInfo.size }, ...state.user.cart.filter(item => item.product._id !== product._id)];

      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API || 'api'}/v1/users/update-me`, { cart: updatedCart }, { withCredentials: true });
      
      setProductInfo({...productInfo, loading: false})
      setState({ ...state, user: res.data.data.user });
    } catch (error) {
      setState({...state, alert: {type: 'danger', message: error.response?.data?.message || error.message || 'Network Error'}})
    }
    
  }

  return (
    <div className="col d-flex px-0 pb-5">
      <div
        className="col-3 d-flex pr-0"
        style={{ position: "sticky", top: 0, left: 0, height: "max-content" }}
      >
        <div className="d-flex flex-column mr-2 ">
          <PhotoPreview
            className="mb-2 border border-secondary rounded"
            style={{ cursor: "pointer" }}
            onMouseOver={() =>
              currentPhoto.photo !== product.coverPhoto &&
              setCurrentPhoto({ ...currentPhoto, photo: product.coverPhoto })
            }
          >
            <Image
              src={`/img/products/${product.coverPhoto}`}
              height="50px"
              width="50px"
            />
          </PhotoPreview>
          {product.photos.length > 0 &&
            product.photos.map((photo, i) => (
              <PhotoPreview
                className="mb-2 border border-secondary rounded"
                style={{ cursor: "pointer" }}
                key={i}
                onMouseOver={() => setCurrentPhoto({ ...currentPhoto, photo })}
              >
                <Image
                  src={`/img/products/${photo}`}
                  height="50px"
                  width="50px"
                />
              </PhotoPreview>
            ))}
        </div>
        <div>
          <Image
            src={`/img/products/${
              currentPhoto.photo || product.coverPhoto || "product.png"
            }`}
            height="300px"
            width="300px"
          />
        </div>
      </div>
      <div className="col px-0">
        <div className="col">
          <h4>{product.summary}</h4>
          <div className="d-flex">
            <Star count={product.ratingsAverage} />
            <span className="mx-1">|</span>
            <h6 className="mt-1">{product.ratingsCount} ratings</h6>
          </div>
          <h5 className="my-3">
            Price:{" "}
            <b>
              <i>${product.price}</i>
            </b>
          </h5>
          <div className="border-bottom mb-4 pb-2">
            {product.specs.map((spec) => (
              <div className="d-flex" key={spec._id}>
                <h5 style={{ width: "200px" }}>
                  <b>{spec.name}</b>
                </h5>
                <h5>{spec.value}</h5>
              </div>
            ))}
          </div>
          {product.gender !== "all" && (
            <h5>
              <b>For</b>: {product.gender}
            </h5>
          )}
          <h5>
            <b>About this item</b>
          </h5>
          <p className="border-bottom pb-3 mb-4" style={{ fontSize: 15 }}>
            {product.description}
          </p>
          <h5><b>Stock:</b>{productInfo.stock}</h5>
          <form onSubmit={addToCart}>
            <div className="d-flex align-items-center">
              <h5 className="mb-0"><b>Select color:</b></h5>
              <div className="d-flex">
              {product.colors.map(color => (
                <label
                  htmlFor={color._id}
                  className="mx-2"
                  style={{background: color.name, cursor: 'pointer', position: 'relative', height: 25, width: 25}} 
                  key={color._id}
                  onClick={() => setProductInfo({...productInfo, color: color._id})}
                >
                  <input type="radio" name="color" id={color._id} className="form-check-input ml-1 mt-2" style={{height: '13px', width: '13px', opacity: productInfo.color === color._id ? 1: 0, position: 'absolute', top: -12, right: -5}} required/>
                </label>
              ))}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <h5 className="mb-0"><b>Select size:</b></h5>
              <div className="d-flex">
              {product.sizes.map((size, i) => (
                <label
                  htmlFor={size+i}
                  className="mx-2 d-flex align-items-center justify-content-center"
                  style={{ cursor: 'pointer', border: '1px solid black', height: 25, width: 30, background: productInfo.size === size ? 'black': 'white', color: productInfo.size === size ? 'white': 'black'}} 
                  key={i}
                  onClick={() => setProductInfo({...productInfo, size})}
                >
                  <h5 className="mb-0">{size}</h5>
                  <input type="radio" name="size" id={size+i} className="form-check-input ml-1 mt-2" style={{height: '1px', width: '1px', opacity: 0}} required/>
                </label>
              ))}
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <h5 className="mb-0 mr-2"><b>Select shipping country:</b></h5>
              <select
                name="shippingCountry"
                id="shippingCountry"
                className="form-control col-2"
                required
                style={{fontSize: 15}}
                onChange={inputChange}
              >
                <option value="">Select country</option>
                {product.shippingCountries.map(country => (
                  <option value={country._id} key={country._id}>{country.name}</option>
                ))}
              </select>
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  disabled={ productInfo.quantity === 0}
                  onClick={() => setProductInfo({...productInfo, stock: productInfo.stock + 1, quantity: productInfo.quantity - 1})}>
                  <FaMinus />
                </button>
                <div className="d-flex align-items-center justify-content-center" style={{ width: 40 }}>
                  <InputArrowsHidden
                    type="number"
                    name="quantity"
                    min="0"
                    max={productInfo.stock}
                    className="form-control"
                    required
                    value={productInfo.quantity} onChange={e => {
                      if (e.target.value === 0) {
                        e.target.setCustomValidity('please select atleast one item')
                      }
                      inputChange(e);
                    }}/>
                </div>
                <button
                  type="button"
                  disabled={productInfo.stock === 0}
                  className="btn btn-outline-dark"
                  onClick={() => setProductInfo({...productInfo, stock: productInfo.stock - 1, quantity: productInfo.quantity + 1})}>
                  <FaPlus />
                </button>
              </div>
              <div className="ml-3">
                <SubmitButton loading={productInfo.loading}><h5 className="mb-0 p-1">Add to cart</h5></SubmitButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 

export default Product

const PhotoPreview = styled.div`
  :hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, .3)
  }
`

const CartButton = styled(motion.button)`
  padding: 5px 15px;
  font-size: 15px;
  background: #f9c16d;
  border: none;
  border-radius: 2px;
  :focus {
    box-shadow: 0 0 5px rgba(0, 0, 0, .5)
  }
`;

const InputArrowsHidden = styled.input`
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
  font-size: 15px;
  text-align: center;
  font-weight: bold;
`;