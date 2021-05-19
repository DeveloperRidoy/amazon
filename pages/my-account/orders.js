
import { useContext } from "react"
import Order from "../../components/my-orders/Order";
import { GlobalContext } from "../../context/GlobalContext"
import styled from 'styled-components';

function MyOrders () {
    
    const { state, setState } = useContext(GlobalContext);

    const orders = state.orders.filter(order => order.user === state.user?._id);

    return (
      <div className="p-5">
        <h3 className="mb-3">My orders</h3>
        {orders.length > 0 ? (
          <Table className="table col-md-10 shadow-lg">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
                {orders.map(order => <Order order={order} key={order._Id}/>)}
            </tbody>
          </Table>
        ) : (
          <h3>Nor orders yet</h3>
        )}
      </div>
    ); 
}

export default MyOrders

const Table = styled.table`
    font-size: 15px;
    overflow-x: auto;
    min-width: 1000px;
    th, td {
        vertical-align: middle;
    }
`