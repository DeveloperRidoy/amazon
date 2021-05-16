import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import SubmitButton from "../Button/SubmitButton/SubmitButton";
import styled from 'styled-components';
import { cloneDeep } from 'lodash';
import axios from "axios";
import Order from "./Order";
import { motion } from "framer-motion";

function OrderSettings () {
    
  const { state, setState } = useContext(GlobalContext);
  const [filteredOrders, setFilteredOrders] = useState({orders: cloneDeep(state.orders),status: "",});
  const [selectedOrders, setSelectedOrders] = useState({orders:[], showAll: false});
  const [searchOrderId, setSearchOrderId] = useState('');
  const [bulkAction, setBulkAction] = useState({action: '', loading: false});

  useEffect(() => setFilteredOrders({...filteredOrders, orders: cloneDeep(state.orders)}) , [state.orders])

  const applyBulkaction = async () => {
    try {

      // for delete action
      if (bulkAction.action === "delete") {
        if (!confirm("delete these orders?")) return;
        setBulkAction({ ...bulkAction, loading: true });

        const res = await axios.delete(`/api/v1/orders`,
          {data: {$or: selectedOrders.orders.map(id => ({_id: id})) }});
        
        setBulkAction({ ...bulkAction, loading: false });
        setState({
          ...state,
          alert: { type: "success", message: res.data.message },
          orders: state.orders.filter((order) => selectedOrders.orders.every(id => id !== order._id)),
        });
        return;
      }

      // for rest of the actions
      setBulkAction({ ...bulkAction, loading: true });
      const res = await axios.patch("/api/v1/orders", {
        query: { $or: selectedOrders.orders.map((id) => ({ _id: id })) },
        data: { $set: { orderStatus: bulkAction.action } },
      });
      
      setBulkAction({ ...bulkAction, loading: false });

      setState({
        ...state,
        alert: { type: "success", message: res.data.message },
        orders: res.data.data.orders,
      });
    } catch (error) {
      setBulkAction({ ...bulkAction, loading: false });
      setState({...state, alert: {type: 'danger', message: error.response?.data?.message || error.message || 'Network Error'}})
    }
  }

  return (
    <div>
      {state.orders?.length > 0 ? (
        <div>
          <div className="d-lg-flex mx-0 align-items-center mb-3">
            <div className="col px-0">
              <button
                className={`btn btn-${
                  filteredOrders.status === null || filteredOrders.status
                    ? "outline-"
                    : ""
                }dark mb-2 mr-2`}
                onClick={() =>
                  setFilteredOrders({
                    orders: cloneDeep(state.orders),
                    status: "",
                  })
                }
              >
                <h6 className="mb-0">All({state.orders?.length})</h6>
              </button>
              <button
                className={`btn btn-${
                  filteredOrders.status === "unpaid" ? "" : "outline-"
                }dark mb-2 mr-2`}
                onClick={() =>
                  setFilteredOrders({
                    orders: cloneDeep(state.orders).filter(
                      (order) => order.paymentStatus === "unpaid"
                    ),
                    status: "unpaid",
                  })
                }
              >
                <h6 className="mb-0">
                  Pending paymnent(
                  {
                    state.orders?.filter(
                      (order) => order.paymentStatus === "unpaid"
                    ).length
                  }
                  )
                </h6>
              </button>
              <button
                className={`btn btn-${
                  filteredOrders.status === "processing" ? "" : "outline-"
                }dark mb-2 mr-2`}
                onClick={() =>
                  setFilteredOrders({
                    orders: cloneDeep(state.orders).filter(
                      (order) => order.orderStatus === "processing"
                    ),
                    status: "processing",
                  })
                }
              >
                <h6 className="mb-0">
                  Processing(
                  {
                    state.orders.filter(
                      (order) => order.orderStatus === "processing"
                    ).length
                  }
                  )
                </h6>
              </button>
              <button
                className={`btn btn-${
                  filteredOrders.status === "on hold" ? "" : "outline-"
                }dark mb-2 mr-2`}
                onClick={() =>
                  setFilteredOrders({
                    orders: cloneDeep(state.orders).filter(
                      (order) => order.orderStatus === "on hold"
                    ),
                    status: "on hold",
                  })
                }
              >
                <h6 className="mb-0">
                  On hold(
                  {
                    state.orders.filter(
                      (order) => order.orderStatus === "on hold"
                    ).length
                  }
                  )
                </h6>
              </button>
              <button
                className={`btn btn-${
                  filteredOrders.status === "cancelled" ? "" : "outline-"
                }dark mb-2 mr-2`}
                onClick={() =>
                  setFilteredOrders({
                    orders: cloneDeep(state.orders).filter(
                      (order) => order.paymentStatus === "cancelled"
                    ),
                    status: "cancelled",
                  })
                }
              >
                <h6 className="mb-0">
                  Cancelled(
                  {
                    state.orders.filter(
                      (order) => order.orderStatus === "cancelled"
                    ).length
                  }
                  )
                </h6>
              </button>
            </div>
            <div className="input-group col-lg-3 px-0">
              <input
                type="text"
                name="orderId"
                id="orderId"
                placeholder="order id"
                className="form-control"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    setSearchOrderId("");
                    setFilteredOrders({
                      ...filteredOrders,
                      orders: cloneDeep(state.orders).filter(
                        (item) => item._id.trim() === searchOrderId.trim()
                      ),
                      status: null,
                    });
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="d-md-flex">
            <div className="d-flex mb-2" style={{ width: 180 }}>
              <div className="input-group">
                <select
                  name="action"
                  id="action"
                  className="form-control font-weight-bold"
                  value={bulkAction.action}
                  onChange={(e) =>
                    setBulkAction({ ...bulkAction, action: e.target.value })
                  }
                >
                  <option value="">Bulk actions</option>
                  <option value="on hold">on hold</option>
                  <option value="processing">processing</option>
                  <option value="shipping">shipping</option>
                  <option value="cancelled">cancelled</option>
                  <option value="complete">complete</option>
                  <option value="delete">delete</option>
                </select>
                <div className="input-group-append">
                  <SubmitButton
                    className="btn bg-dark text-white"
                    spinColor="white"
                    loading={bulkAction.loading}
                    disabled={selectedOrders.orders.length === 0 || bulkAction.action === ''}
                    tooltip={
                      selectedOrders.orders.length === 0
                        ? "select orders to update"
                        : null
                    }
                    onClick={applyBulkaction}
                  >
                    Apply
                  </SubmitButton>
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
                <button className="btn btn-dark" onClick={applyBulkaction}>
                  Filter
                </button>
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
          <Table className="table shadow">
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    checked={selectedOrders.showAll}
                    onChange={() => {
                      selectedOrders.showAll
                        ? setSelectedOrders({ orders: [], showAll: false })
                        : setSelectedOrders({
                            orders: filteredOrders.orders.map(
                              (order) => order._id
                            ),
                            showAll: true,
                          });
                    }}
                  />
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
              {filteredOrders.orders.map((order) => (
                <Order
                  key={order._id + order.orderStatus}
                  order={order}
                  selectedOrders={selectedOrders}
                  setSelectedOrders={setSelectedOrders}
                />
              ))}
            </tbody>
          </Table>
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

const Table = styled(motion.table)`
  font-size: 13px;
  min-width: 1000px;
  overflow-x: auto;
  th, td {
    vertical-align: middle;
  }
  a:hover {
    color: black;
  }
`