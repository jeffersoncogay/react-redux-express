const INITIAL_STATE = {
  list: null
}

const actionHandlers = {
  GET_USER_LIST: (state, action) => {
    return {
      ...state,
      list: action.payload
    }
  }
}

export default (state = INITIAL_STATE, action) => {
  console.log('reducer', action)
  if (actionHandlers.hasOwnProperty(action.type)) {
    return actionHandlers[action.type](state, action)
  }
  return state
}