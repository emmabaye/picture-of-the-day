import moment from "moment";

export const initialState: IAppState  = {
  currentDate: moment(Date.now()).format('YYYY-MM-DD'),
  isLoading: false,
}

export const pictureReducer =  (state: IAppState = initialState , action: IAction) => {
  action.payload && localStorage.setItem(action.payload.date, JSON.stringify(action.payload));
  switch (action.type) {
    case 'GET_PICTURE':
      return {
        ...state,
        currentDate: action.payload.date,
      }
      case 'LOADING':
        return {
          ...state,
          isLoading: action.payload.isLoading,
        }
    case 'RENDER':
      return state
    default:
      return state
  }
}

export default pictureReducer;