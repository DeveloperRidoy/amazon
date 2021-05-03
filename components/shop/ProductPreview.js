import Image from "next/image";
import { Star } from "../icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';

function ProductPreview ({ product }) {
    const Router = useRouter();
    return (
        <motion.div
            className="col mb-3 d-flex align-items-center justify-content-center"
            layout
        >
            <StyledProduct
                className="p-3 col-lg-10 shadow-lg"
                onClick={() => Router.push(`/shop/${product.category.name}/${product.slug}`)}
            >
                <Image
                    src={`/img/products/${product.coverPhoto || "product.png"}`}
                    height="150px"
                    width="150px"
                />
                <h5>{product.name}</h5>
                <div className="d-flex">
                    <Star count={product.ratingsAverage} />
                    ({product.ratingsAverage}/{product.ratingsCount})
                </div>
                <h5 className="mt-1">Price: ${product.price}</h5>
            </StyledProduct>
        </motion.div>
    );
}

export default ProductPreview;

const StyledProduct = styled.div`
  cursor: pointer;
`;
