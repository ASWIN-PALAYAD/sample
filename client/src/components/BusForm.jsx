import React from 'react'
import {Col, Form, message, Modal, Row} from 'antd';
import {useDispatch} from 'react-redux'
import { axiosInstance } from '../helpers/axiosInstance';
import {ShowLoading,HideLoading} from '../redux/alertsSlice'
import moment from 'moment'


const BusForm = ({showBusForm,setShowBusForm,type ='add', getData,selectedBus,setSelectedBus}) => {

  const dispatch = useDispatch();

  const onFinish = async(values) => {
    console.log(values);
    try {
        dispatch(ShowLoading())
        let response = null;
        if(type === 'add'){
          console.log('hai welcom');
        response = await axiosInstance.post('/api/buses/add-bus',values)
      }else{
        response = await axiosInstance.patch('/api/buses/update-bus',{
            ...values,
            _id:selectedBus._id,
        })
      }
      if(response.data.success){
        message.success(response.data.message)
      }else{
        message.error(response.data.message)
      }
      getData();
      setShowBusForm(false);
      setSelectedBus(null)
      dispatch(HideLoading())
    } catch (error) {
        console.log(error);
        message.error(error.message)
        dispatch(HideLoading())
    }
  }


  return (
    <Modal width={800} title={type === "add" ? 'Add Bus' : 'Edit Bus'} open={showBusForm} onCancel={()=>{setShowBusForm(false); setSelectedBus(null)}} footer={null} >
        <Form layout='vertical' onFinish={onFinish} initialValues={selectedBus} >
            <Row gutter={[10,10]}>
                <Col lg={24} xs={24} >
                    <Form.Item label='Bus Name' name='name' >
                        <input type='text' />
                    </Form.Item>
                </Col>

                <Col lg={12} xs={24} >
                    <Form.Item label='Bus Number' name='number' >
                        <input type='text' />
                    </Form.Item>
                </Col>

                <Col lg={12} xs={24} >
                    <Form.Item label='Bus Capacity' name='capacity' >
                        <input type='text' />
                    </Form.Item>
                </Col>

                <Col lg={12} xs={24} >
                    <Form.Item label='From' name='from' >
                        <input type='text' />
                    </Form.Item>
                </Col>

                <Col lg={12} xs={24} >
                    <Form.Item label='To' name='to' >
                        <input type='text' />
                    </Form.Item>
                </Col>
              
                <Col lg={8} xs={24} >
                    <Form.Item label='Journey Date' name='journeyDate' >
                        <input type='date' />
                    </Form.Item>
                </Col>

                <Col lg={8} xs={24} >
                    <Form.Item label='Departure' name='departure' >
                        <input type='time' />
                    </Form.Item>
                </Col>

                <Col lg={8} xs={24} >
                    <Form.Item label='Arrival' name='arrival' >
                        <input type='time' />
                    </Form.Item>
                </Col> 

                <Col lg={12} xs={24} >
                    <Form.Item label='Type' name='type' >
                        <select name="" id="">
                            <option value="AC" selected >AC</option>
                            <option value="AC Semi-sleeper">AC Semi-sleeper</option>
                            <option value="Sleeper-Non AC">Sleeper-Non AC</option>
                            <option value="Super Fast">Super Fast</option>
                        </select>
                    </Form.Item>
                </Col>

                <Col lg={12} xs={24} >
                    <Form.Item label='Fare' name='fare' >
                        <input type='text' />
                    </Form.Item>
                </Col> 

                <Col lg={12} xs={24} >
                    <Form.Item label='Bus Status' name='status' >
                        <select name="" id="">
                            <option value="Yet To Start" selected>Yet To Start</option>
                            <option value="Running">Running</option>
                            <option value="Completed">Completed</option> 
                        </select>
                    </Form.Item>
                </Col>              

            </Row>
            <div className="d-flex justify-content-end">
              <button className='primary-btn' type='submit' >Save</button>
            </div>
        </Form>
    </Modal>
  )
}

export default BusForm