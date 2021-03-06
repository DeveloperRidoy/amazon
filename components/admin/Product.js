import styled from "styled-components";
import { Eye, PencilRuler, Star, TrashAlt } from "../icons";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AdminContext } from "../../pages/admin";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { useRouter } from "next/router";

const Product = ({ product, setShowAddProduct, setProductData }) => {
  const Router = useRouter();

  const { LayoutRef } = useContext(AdminContext);

  const { state, setState } = useContext(GlobalContext);

  const deleteProduct = async (product) => {
    try {
      if (!confirm("Delete this product permanently?")) return;

      const res = await axios.delete(`/api/v1/products/${product._id}`);

      setState({
        ...state,
        products: state.products.filter((prod) => prod._id !== product._id),
        alert: { type: "success", message: res.data.message },
      });
    } catch (error) {
      setState({
        ...state,
        alert: {
          type: "danger",
          message:
            error.response?.data.message || error.message || "Network Error",
        },
      });
    }
  };

  const updateAddPorductOptions = () => {
    setShowAddProduct(true);
    LayoutRef.current.scrollTo(0, 0);
    setProductData({
      ...product,
      coverPhotoSrc: product.coverPhoto,
      photosSrc: product.photos,
      editId: product._id,
      colors: product.colors.map((color) => color._id),
      shippingCountries: product.shippingCountries.map(
        (country) => country._id
      ),
      category: product.category._id,
    });
  };

  return (
    <div className="col mb-3">
      <StyledProduct className="col d-flex flex-column flex-md-row align-items-center">
        <div>
          <img
            src={`/img/products/${product.coverPhoto || "product.png"}`}
            height="150"
            width="150"
          />
        </div>
        <div className="col-md-8 col-lg-10 py-4">
          <h3>{product.name}</h3>
          <h5>{product.summary}</h5>
          <h5 className="d-flex">
            <Star count={product.ratingsAverage} />({product.ratingsCount})
          </h5>
          <h5>
            price:{" "}
            <b>
              <i>${product.price}</i>
            </b>
          </h5>
          <div className="d-flex w-100 justify-content-end">
            <div
              className="mr-3 d-block"
              tooltip="update product"
              onClick={updateAddPorductOptions}
            >
              <PencilRuler />
            </div>
            <div
              className="mr-3"
              tooltip="view product"
              onClick={() =>
                Router.push(`/shop/${product.category.name}/${product.slug}`)
              }
            >
              <Eye />
            </div>
            <div
              className="mr-3"
              tooltip="delete product"
              onClick={() => deleteProduct(product)}
            >
              <TrashAlt />
            </div>
          </div>
        </div>
      </StyledProduct>
    </div>
  );
};
const StyledProduct = styled(motion.div)`
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
`;

export default Product;
