import React from 'react';
import '../resources/auth.css'
import {Form, message} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';

const Register = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const onFinish = async(values) => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/users/register',values);
            dispatch(HideLoading())
            if(response.data.success){
                message.success(response.data.message)
                navigate('/login');
            }else{
                message.error(response.data.message)
            }
        } catch (error) {
            dispatch(HideLoading())
            message.error(error.message)

        }
    }




  return (
    <div className='h-screen d-flex justify-content-center align-items-center auth'>
        <div className='w-400 card p-3'>
            <h1 className='text-lg'>SheyBus - Register</h1>
            <hr />
            <Form layout='vertical' onFinish={onFinish} >
                <Form.Item label='Name' name='name' >
                    <input type='text' />
                </Form.Item>
                <Form.Item label='email' name='email' >
                    <input type='email' />
                </Form.Item>
                <Form.Item label='password' name='password' >
                    <input type='password' />
                </Form.Item>

                <div className="d-flex justify-content-between align-items-center my-3">
                    <Link to='/login'>Click here to  login</Link>
                    <button type='submit' className="secondary-btn">Register</button>
                </div>
                
            </Form>
        </div >
    </div >
  )
}

export default Register