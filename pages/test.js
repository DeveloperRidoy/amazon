import { useContext, useEffect, useState } from "react"
import Spinner from "../components/Spinners/Spinner";
import { GlobalContext } from "../context/GlobalContext";

function test() {
    const [state, setState] = useContext(GlobalContext);
    console.log(state);
    // useEffect(() => {
    //     setTimeout(() => {setState({ ...state, loading: false });}, 3000)
    // }, [])
    return (
      <div>
        {/* {state.loading && (
          <Spinner
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          />
        )} */}
      </div>
    );
}

export default test
