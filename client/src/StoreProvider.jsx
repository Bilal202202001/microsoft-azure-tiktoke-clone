import store from './store/store.js'
import React, { useEffect } from 'react'
import { Provider} from 'react-redux'

const StoreProvider = ({children}) => {

  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}

export default StoreProvider