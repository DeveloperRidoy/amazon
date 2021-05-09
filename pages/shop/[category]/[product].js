import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Product from '../../../components/shop/Product';
import { GlobalContext } from '../../../context/GlobalContext';
import Link from 'next/link';

function ProductPage () {
  const { state } = useContext(GlobalContext);
  const Router = useRouter();
  const [product, setProduct] = useState(
    state.products.find((product) => product.slug === Router.query.product)
  );
  const similarProducts = state.products.filter((item) => item.slug !== Router.query.product && item.category.name === Router.query.category).filter((product, i) => i <= 4);

  useEffect(() => setProduct(state.products.find(product => product.slug === Router.query.product)), [Router.query.product])
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/shop">Shop</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/shop/${Router.query.category}`}>
              {Router.query.category}
            </Link>
          </li>
        </ol>
        <div className="row mx-0">
          <div className="col px-0">
            {product 
            ? <Product product={product} />
            : <h3 className="ml-3">No product with this name!</h3>
        }
          </div>
          <div className="col-lg-2 border-left" style={{ overflowY: "auto" }}>
            <h5>Similar items</h5>
            {similarProducts.length > 0 &&
              similarProducts.map((product) => (
                <Link
                  href={`/shop/${product.category.name}/${product.slug}`}
                  key={product._id}
                >
                  <a>
                    <img
                      src={`/img/products/${
                        product.coverPhoto || "product.png"
                      }`}
                      height="100"
                      width="100"
                      className="mb-2"
                    />
                  </a>
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
}

export default ProductPage