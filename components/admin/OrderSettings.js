import { useContext, useState } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import styled from 'styled-components';

function OrderSettings () {
    
  const { state } = useContext(GlobalContext);
  
  return (
    <div>
      {state.orders?.length > 0 ? (
        <div>
          <div className="d-lg-flex mx-0 align-items-center mb-3">
            <div className="col px-0">
              <button className="btn btn-dark mb-2 mr-2">
                <h6 className="mb-0">All(140)</h6>
              </button>
              <button className="btn btn-outline-dark mb-2 mr-2">
                <h6 className="mb-0">Pending paymnent(11)</h6>
              </button>
              <button className="btn btn-outline-dark mb-2 mr-2">
                <h6 className="mb-0">Processing(3)</h6>
              </button>
              <button className="btn btn-outline-dark mb-2 mr-2">
                <h6 className="mb-0">On hold(4)</h6>
              </button>
              <button className="btn btn-outline-dark mb-2 mr-2">
                <h6 className="mb-0">Cancelled(140)</h6>
              </button>
            </div>
            <div className="input-group col-lg-3 px-0">
              <input
                type="text"
                name="orderId"
                id="orderId"
                placeholder="order id"
                className="form-control"
              />
              <div className="input-group-append">
                <button className="btn btn-dark">Search</button>
              </div>
            </div>
          </div>
          <div className="d-md-flex">
            <div className="d-flex mb-2" style={{ width: 180 }}>
              <div className="input-group">
                <select name="action" id="action" className="form-control">
                  <option value="">Bulk actions</option>
                  <option value="delete">delete</option>
                </select>
                <div className="input-group-append">
                  <button className="btn btn-outline-dark">Apply</button>
                </div>
              </div>
            </div>
            <form className="col-md-5 input-group mb-2 ml-md-3 px-0">
              <input
                type="date"
                name="date"
                id="date"
                className="form-control"
              />
              <input
                type="text"
                name="customer"
                id="customer"
                className="form-control"
                placeholder="Search for a customer..."
              />
              <div className="input-group-append">
                <button className="btn btn-outline-dark">Filter</button>
              </div>
            </form>
            <div className="col d-flex justify-content-md-end align-items-center px-0">
              <p className="mb-0 mr-1">140 items</p>
              <button className="btn btn-outline-dark mr-1">
                <BsChevronLeft />
              </button>
              <div style={{ width: 40 }} className="mr-1">
                <InputNoArrows
                  type="number"
                  name="orderIndex"
                  id="orderIndex"
                  className="form-control text-center"
                />
              </div>
              <p className="mb-0 mr-1">of 7</p>
              <button className="btn btn-outline-dark">
                <BsChevronRight />
              </button>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">
                  <input type="checkbox" name="selectAll" id="selectAll" />
                </th>
                <th scope="col">Order</th>
                <th scope="col">Payment</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th scope="col">Total</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.orders.map((order) => (
                <tr key={order._id}>
                  <th scope="col">
                    <input type="checkbox" name={order._id} id={order._id} />
                  </th>
                  <td>
                    #{order._id} by {order.metadata.firstName}
                  </td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    <select name="orderStatus" id="orderStatus" className="form-control">
                      <option value="on hold">on hold</option>
                      <option value="processing">processing</option>
                      <option value="shipping">shipping</option>
                      <option value="canceled">canceled</option>
                      <option value="complete">complete</option>
                    </select>
                  </td>
                  <td>{order.date}</td>
                  <td>{order.totalAmount}</td>
                  <td className="d-flex">
                    <button className="btn btn-outline-dark d-flex align-items-center">
                      a
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h3>No orders for now.</h3>
      )}
    </div>
  );
}

export default OrderSettings

const InputNoArrows = styled.input`
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
  -moz-appearance: none;
  }
`