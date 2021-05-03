const axios = require("axios");
const { useContext } = require("react");
const { GlobalContext } = require("../context/GlobalContext");

module.exports = async () => {
    
    const { setState } = useContext(GlobalContext);
    try {
        
    } catch (error) {
      setState(prevState => ({ ...prevState, alert: { type: 'danger', message: error.response
                ? error.response.status === 500
                    ? 'Server Error'
                    : error.response.data.message
                : 'Network Error' } }));
    }
}