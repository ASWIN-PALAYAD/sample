import React from 'react'
import {HashLoader} from 'react-spinners'

const Loader = () => {
  return (
    <div className='spinner-parent' >
        <HashLoader color="#364ed6" size={150} />
    </div>
  )
}

export default Loader