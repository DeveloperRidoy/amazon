import { useContext, useState } from "react"
import { GlobalContext } from "../../context/GlobalContext";

function Order ({ order }) {
    
    const { state } = useContext(GlobalContext);

    const [expand, setExpand] = useState(false);

    return (
      <>
        <tr>
          <td>#{order._id}</td>
          <td>{new Date(order.date).toDateString()}</td>
          <td>{order.orderStatus}</td>
          <td>${order.totalAmount / 100}</td>
          <td>
            <button className="btn btn-dark" onClick={() => setExpand(!expand)}>
              {expand ? "Close" : "View"}
            </button>
          </td>
        </tr>
        {expand && (
          <tr>
            <td colSpan="100%">
              <table className="table mb-2">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>TotalPrice</th>
                  </tr>
                </thead>
                <tbody>
                  {state.products
                    ?.filter((product) =>
                      order.products.some(
                        (item) => item.product === product._id
                      )
                    )
                    .map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={`/img/products/${product.coverPhoto}`}
                            alt={product.name}
                            style={{ height: 50, width: 50 }}
                            className="shadow border"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>
                          $
                          {order.products.find(
                            (item) => item.product === product._id
                          ).price / 100}
                        </td>
                        <td>
                          {
                            order.products.find(
                              (item) => item.product === product._id
                            ).quantity
                          }
                        </td>
                        <td>
                          $
                          {order.products.find(
                            (item) => item.product === product._id
                          ).totalPrice / 100}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </td>
          </tr>
        )}
      </>
    );
}

export default Order
