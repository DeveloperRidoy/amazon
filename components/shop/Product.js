import { Star } from "../icons";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlus, FaMinus, FaArrowRight } from "react-icons/fa";
import { GlobalContext } from "../../context/GlobalContext";
import { useRouter } from "next/router";
import axios from "axios";
import SubmitButton from "../Button/SubmitButton/SubmitButton";
import Link from "next/link";

function Product({ product }) {

  const initialState = {
    stock: product.stock,
    quantity: 0,
    color: null,
    size: null,
    loading: false,
    viewCart: false,
    viewLogin: false,
  };

  const Router = useRouter();

  const { state, setState } = useContext(GlobalContext);

  const [currentPhoto, setCurrentPhoto] = useState({ photo: "" });

  const [productInfo, setProductInfo] = useState(initialState);

  const [showDescription, setShowDescription] = useState(true);

  const [reviewData, setReviewData] = useState({
    rating: 1,
    review: '',
    product: product._id,
    loading: false,
  })

  const inputChange = (e) =>
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });

  useEffect(() => {
    setProductInfo(initialState);
  }, [Router.query.product]);

  const addToCart = async (e) => {
    e.preventDefault();
    if (productInfo.quantity === 0) {
      setState({
        ...state,
        alert: { type: "danger", message: "Please select atleast one item" },
      });
      return;
    }

    if (!state.user) {
      setState({
        ...state,
        alert: { type: "warning", message: "Please login to add to cart" },
      });
      setProductInfo({ ...initialState, viewLogin: true });
      return;
    }

    try {
      setProductInfo({ ...productInfo, loading: true });

      const updatedCart = [
        {
          product: product._id,
          quantity: productInfo.quantity,
          color: productInfo.color,
          size: productInfo.size,
        },
        ...state.user.cart.filter((item) => item.product._id !== product._id),
      ];

      const res = await axios.patch(`/api/v1/users/update-me`, {
        cart: updatedCart,
      });

      setProductInfo({ ...productInfo, loading: false, viewCart: true });
      setState({
        ...state,
        user: res.data.data.user,
        alert: { type: "success", message: "Added to cart" },
      });
    } catch (error) {
      setProductInfo(initialState);
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

  // check if user is eligible to review
  const canReview = () => {
    const orderCompleted = state.orders.some(order => order.orderStatus === 'complete' && order.user === state.user._id && order.products.find(prod => prod.product === product._id));
    
    const alreadyReviewed = product.reviews.some(review => review.user._id === state.user._id);

    return orderCompleted && !alreadyReviewed ? true : false;
  }

  // submit review
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault()
      setReviewData({ ...reviewData, loading: true });
      await axios.post('/api/v1/reviews', reviewData);

      setReviewData({ ...reviewData, loading: false });
    
      const updatedProduct = {
        ...product,
        ratingsCount: product.ratingsCount + 1,
        ratingsAverage:
          product.ratingsAverage === 1 && product.ratingsCount === 0
            ? reviewData.rating
            : (product.ratingsAverage + reviewData.rating) /
              (product.ratingsCount + 1),
        reviews: [
          ...product.reviews,
          {
            _id: state.user._id,
            createdAt: new Date(),
            user: state.user,
            ...reviewData,
          },
        ],
      };

      setState({ ...state, alert: { type: 'success', message: 'review added' }, products: state.products.map(prod => prod._id === product._id ? product = updatedProduct : prod) });

    } catch (error) {
      setReviewData({ ...reviewData, loading: false });
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
    <div className="col row px-0 pb-5">
      <PhotoContainer className="col-md-4 d-flex flex-column-reverse flex-md-row pr-0 mx-1 mb-3 mb-md-0">
        <div className="d-flex flex-md-column mx-auto">
          <PhotoPreview
            className="mb-2 border border-secondary rounded"
            style={{ cursor: "pointer" }}
            onMouseOver={() =>
              currentPhoto.photo !== product.coverPhoto &&
              setCurrentPhoto({ ...currentPhoto, photo: product.coverPhoto })
            }
          >
            <img
              src={`/img/products/${product.coverPhoto}`}
              height="50px"
              width="50px"
            />
          </PhotoPreview>
          {product.photos.length > 0 &&
            product.photos.map((photo, i) => (
              <PhotoPreview
                className="mb-2 mx-2 mx-md-0 border border-secondary rounded"
                style={{ cursor: "pointer" }}
                key={i}
                onMouseOver={() => setCurrentPhoto({ ...currentPhoto, photo })}
              >
                <img
                  src={`/img/products/${photo}`}
                  height="50px"
                  width="50px"
                />
              </PhotoPreview>
            ))}
        </div>
        <div className="text-center">
          <img
            src={`/img/products/${
              currentPhoto.photo || product.coverPhoto || "product.png"
            }`}
            height="300px"
            width="300px"
          />
        </div>
      </PhotoContainer>
      <div className="col px-3">
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
                <h5 className="col px-0">
                  <b>{spec.name}</b>
                </h5>
                <h5 className="col-8">{spec.value}</h5>
              </div>
            ))}
          </div>
          {product.gender !== "all" && (
            <h5>
              <b>For</b>: {product.gender}
            </h5>
          )}
          <div className="d-flex">
            <button
              className={`btn btn-${
                showDescription ? "" : "outline-"
              }dark ml-5 mr-2`}
              onClick={() => !showDescription && setShowDescription(true)}
            >
              <h5 className="mb-0">Description</h5>
            </button>
            <button
              className={`btn btn-${showDescription ? "outline-" : ""}dark`}
              onClick={() => {
                showDescription && setShowDescription(false);
              }}
            >
              <h5 className="mb-0">Reviews({product.reviews.length})</h5>
            </button>
          </div>
          <div className="border p-3 mb-3">
            {showDescription ? (
              <p style={{ fontSize: 15 }}>{product.description}</p>
            ) : (
              <div>
                {product.reviews.length > 0 ? (
                  <div>
                    <h5 className="mb-3">
                      <b>
                        {product.reviews.length} reviews for {product.name}
                      </b>
                    </h5>
                    {product.reviews.map((review) => (
                      <div
                        key={review._id}
                        className="d-flex align-items-start justify-content-between"
                      >
                        <div className="d-flex align-items-start">
                          <img
                            src={`/img/users/${
                              review.user?.photo || "user.jpg"
                            }`}
                            alt={review.user?.name}
                            style={{
                              heigth: 40,
                              width: 40,
                            }}
                            className="rounded-circle mr-3"
                          />
                          <div>
                            <h5>
                              <b>{review.user?.firstName}</b> -{" "}
                              {new Date(review.createdAt).toDateString()}
                            </h5>
                            <p style={{ fontSize: 15 }}>{review.review}</p>
                          </div>
                        </div>
                        <Star count={review.rating} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <h3>No reviews yet.</h3>
                )}
                {state.user && canReview() && (
                  <form onSubmit={submitReview}>
                    <label htmlFor="review" className="font-weight-bold">
                      Give a reveiw
                    </label>
                    <div className="d-flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StyledStar
                          key={star}
                          style={{
                            backgroundPosition: `-5px ${
                              reviewData.rating >= star ? "-366px" : "-426px"
                            }`,
                          }}
                          onClick={() => setReviewData({...reviewData, rating: star})}
                        />
                      ))}
                    </div>
                    <textarea
                      name="review"
                      id="review"
                      rows="3"
                      placeholder="your review here"
                      className="form-control my-3"
                      style={{ fontSize: 15 }}
                      value={reviewData.review}
                      onChange={e => setReviewData({...reviewData, review: e.target.value})}
                      required
                    ></textarea>
                    <SubmitButton loading={reviewData.loading}>
                      Submit
                    </SubmitButton>
                  </form>
                )}
              </div>
            )}
          </div>
          <div>
            <h5>
              <b>Stock:</b>
              {productInfo.stock}
            </h5>
            <form onSubmit={addToCart}>
              <div className="d-flex align-items-center">
                <h5 className="mb-0">
                  <b>Select color:</b>
                </h5>
                <div className="d-flex">
                  {product.colors.map((color) => (
                    <label
                      htmlFor={color._id}
                      className="mx-2 border border-dark"
                      style={{
                        background: color.name,
                        cursor: "pointer",
                        position: "relative",
                        height: 25,
                        width: 25,
                      }}
                      key={color._id}
                      onClick={() =>
                        setProductInfo({ ...productInfo, color: color._id })
                      }
                    >
                      <input
                        type="radio"
                        name="color"
                        id={color._id}
                        className="form-check-input ml-1 mt-2"
                        style={{
                          height: "13px",
                          width: "13px",
                          opacity: productInfo.color === color._id ? 1 : 0,
                          position: "absolute",
                          top: -12,
                          right: -5,
                        }}
                        required
                      />
                    </label>
                  ))}
                </div>
              </div>
              {product.sizes.length > 0 && (
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">
                    <b>Select size:</b>
                  </h5>
                  <div className="d-flex">
                    {product.sizes.map((size, i) => (
                      <label
                        htmlFor={size + i}
                        className="mx-2 d-flex align-items-center justify-content-center"
                        style={{
                          cursor: "pointer",
                          border: "1px solid black",
                          height: 25,
                          width: 30,
                          background:
                            productInfo.size === size ? "black" : "white",
                          color: productInfo.size === size ? "white" : "black",
                        }}
                        key={i}
                        onClick={() => setProductInfo({ ...productInfo, size })}
                      >
                        <h5 className="mb-0">{size}</h5>
                        <input
                          type="radio"
                          name="size"
                          id={size + i}
                          className="form-check-input ml-1 mt-2"
                          style={{ height: "1px", width: "1px", opacity: 0 }}
                          required
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    disabled={productInfo.quantity === 0}
                    onClick={() =>
                      setProductInfo({
                        ...productInfo,
                        stock: productInfo.stock + 1,
                        quantity: productInfo.quantity - 1,
                      })
                    }
                  >
                    <FaMinus />
                  </button>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: 40 }}
                  >
                    <InputArrowsHidden
                      type="number"
                      name="quantity"
                      min="0"
                      max={productInfo.stock}
                      className="form-control"
                      required
                      value={productInfo.quantity}
                      onChange={(e) => {
                        if (e.target.value === 0) {
                          e.target.setCustomValidity(
                            "please select atleast one item"
                          );
                        }
                        inputChange(e);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={productInfo.stock === 0}
                    className="btn btn-outline-dark"
                    onClick={() =>
                      setProductInfo({
                        ...productInfo,
                        stock: productInfo.stock - 1,
                        quantity: productInfo.quantity + 1,
                      })
                    }
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="ml-3 d-flex align-items-center">
                  <SubmitButton loading={productInfo.loading}>
                    <h5 className="mb-0">Add to cart</h5>
                  </SubmitButton>
                  {productInfo.viewCart ? (
                    <Link href="/cart">
                      <a className="btn btn-dark ml-3">
                        View cart <FaArrowRight />
                      </a>
                    </Link>
                  ) : (
                    productInfo.viewLogin && (
                      <Link href="/login">
                        <a className="btn btn-dark ml-3">
                          Login <FaArrowRight />
                        </a>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;

const PhotoPreview = styled.div`
  :hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
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

const PhotoContainer = styled.div`
  height: max-content;
  @media (min-width: 768px) {
    position: sticky;
    top: 0;
    left: 0;
  }
`;

const StyledStar = styled.span`
  background-image: url(/images2.png);
  height: 16px;
  width: 17px;
  cursor: pointer;
`;