import { message } from 'antd';
import axios from 'axios';
import React, { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { SetUser } from '../redux/userSllice';
import DefaultLayout from './DefaultLayout';

const ProtectedRoute = ({children}) => {

  const dispatch = useDispatch();

    const {user} = useSelector(state=> state.users)
    const navigate = useNavigate();
    const validateToken = async() => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/users/get-user-by-id',{},{
                headers:{
                    Authorization : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success){
                dispatch(HideLoading())
                dispatch(SetUser(response.data.data))
            }else{
                dispatch(HideLoading())
                localStorage.removeItem('token');
                message.error(response.data.message)
                navigate('/login')
            }
        } catch (error) {
            dispatch(HideLoading())
            localStorage.removeItem('token');
            message.error(error.message)
            navigate('/login')
        }
    }

    useEffect(() => {
      if(localStorage.getItem('token')){
        validateToken()
      }else{
        navigate('/login')
      }
    }, [])
    

  return (
    <div>
        {user &&  <div><DefaultLayout>{children}</DefaultLayout></div>}
    </div>
  )
}

export default ProtectedRoute