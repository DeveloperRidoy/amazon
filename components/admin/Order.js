import { FaCheck, FaEye, FaTimes, FaTrash } from "react-icons/fa";
import SubmitButton from "../Button/SubmitButton/SubmitButton";
import axios from "axios";
import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";

function Order({ order, selectedOrders, setSelectedOrders }) {
    
    const { state, setState } = useContext(GlobalContext);
    const [orderData, setOrderData] = useState({ orderStatus: order.orderStatus });
    const [loading, setLoading] = useState(false);
    const [expand, setExpand] = useState(false);
    
    const deleteOrder = async (id) => {
    try {
      if (!confirm("delete this order?")) return;
      const res = await axios.delete(`/api/v1/orders/${order._id}`);
      setState({
        ...state,
        alert: { type: "success", message: res.data.message },
        orders: state.orders.filter((order) => order._id !== id),
      });
    } catch (error) {
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

    const updateOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.patch(`/api/v1/orders/${order._id}`, orderData);
        setLoading(false);
        setState({
          ...state,
          alert: { type: "success", message: res.data.message },
          orders: state.orders.map((item) =>
            item._id === res.data.data.order._id
              ? (item = res.data.data.order)
              : item
          ),
        });
      } catch (error) {
        setLoading(false);
        setState({
          ...state,
          alert: {
            type: "danger",
            message:
              error.response?.data?.messgae || error.message || "Network Error",
          },
        });
      }
    };
    
  return (
    <>
      <tr>
        <th scope="col">
          <input
            type="checkbox"
            name={order._id}
            id={order._id}
            checked={
              selectedOrders.orders.find((item) => item === order._id)
                ? true
                : false
            }
            onChange={() => {
              const selected = selectedOrders.orders.find(
                (item) => item === order._id
              );
              selected
                ? setSelectedOrders({
                    ...selectedOrders,
                    orders: selectedOrders.orders.filter(
                      (item) => item !== order._id
                    ),
                  })
                : setSelectedOrders({
                    ...selectedOrders,
                    orders: [order._id, ...selectedOrders.orders],
                  });
            }}
          />
        </th>
        <td>
          <b>#{order._id}</b> by {order.metadata.firstName}
        </td>
        <td>{order.paymentStatus}</td>
        <td>
          <select
            name="orderStatus"
            id="orderStatus"
            className="form-control"
            value={orderData.orderStatus}
            onChange={(e) =>
              setOrderData({ ...orderData, orderStatus: e.target.value })
            }
          >
            <option value="on hold">on hold</option>
            <option value="processing">processing</option>
            <option value="shipping">shipping</option>
            <option value="cancelled">cancelled</option>
            <option value="complete">complete</option>
          </select>
        </td>
        <td>{new Date(order.date_ms).toDateString()}</td>
        <td>
          <b>
            <i>${order.totalAmount / 100}</i>
          </b>
        </td>
        <td>
          <div className="d-flex">
            <div tooltip="apply changes">
              <SubmitButton
                className="btn bg-dark text-white mr-1"
                spinColor="white"
                loading={loading}
                onClick={updateOrder}
              >
                {!loading && <FaCheck />}
              </SubmitButton>
            </div>
            <button
              className={`btn btn${!expand ? "-outline" : ""}-dark mr-1`}
              tooltip="view"
              onClick={(e) => {
                e.stopPropagation();
                setExpand(!expand);
              }}
            >
              <FaEye />
            </button>
            <button
              className="btn btn-outline-dark"
              tooltip="delete"
              onClick={() => deleteOrder(order._id)}
            >
              <FaTrash />
            </button>
          </div>
        </td>
      </tr>
      {expand && (
        <tr className="shadow">
          <td colSpan="100%">
            <h5>
              <b>Customer</b>
            </h5>
            {Object.keys(order.metadata).map((key, i) => (
              <div key={i}>
                <h5>
                  {key}: {order.metadata[key]}
                </h5>
              </div>
            ))}
            <h5 className="mt-3">
              <b>Products</b>
            </h5>
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
                    order.products.some((item) => item.product === product._id)
                  )
                  .map((product) => (
                    <tr key={product._id} className="font-weight-bold">
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
                        {
                          order.products.find(
                            (item) => item.product === product._id
                          ).totalPrice / 100
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button
              className="btn btn-dark d-block ml-auto"
              onClick={() => setExpand(false)}
            >
              close
            </button>
          </td>
        </tr>
      )}
    </>
  );
}

export default Order;
