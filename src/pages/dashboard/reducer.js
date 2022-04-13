import { SET_STOCK_DATA } from "../../store/actionsConstants"


const initialState = {
    stockData: []
}

const dashboardReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_STOCK_DATA: {
            return {...state, stockData: action.payload}
        }
        default:
            return state;
    }
}

export default dashboardReducer;