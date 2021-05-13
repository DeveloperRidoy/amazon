import { useContext, useState } from "react"
import { GlobalContext } from "../../context/GlobalContext"

function OrderSettings () {
    
  const { state } = useContext(GlobalContext);

  return (
      <div>
      {state.orders?.length > 0
        ? (
          <div>
            {state.orders.map(order => <h4 key={order._id}>{order.user}</h4> )}
          </div>
        )
        : <h3>No orders for now.</h3>
      }
      </div>
  )
}

export default OrderSettings

