import { Col, message, Row } from 'antd';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import SeatSelection from '../components/SeatSelection';
import { axiosInstance } from '../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import StripeCheckout from 'react-stripe-checkout';

const BookNow = () => {
    const dispatch = useDispatch();
    const [bus, setBus] = useState(null);
    const params = useParams();
    const [selectedSeats, setSelectedSeats] = useState([])



    const getBus = async() => {
        try {
          dispatch(ShowLoading());
          const response = await axiosInstance.post('/api/buses/get-bus-by-id',{
            _id:params.id
          });
          dispatch(HideLoading());
          if(response.data.success){
            setBus(response.data.data);
          }else{
            dispatch(HideLoading());
            message.error(response.data.message)
          }
        } catch (error) {
          dispatch(HideLoading());
          message.error(error.message)
        }
      }

      const onToken = async(token) => {
        try {
          dispatch(ShowLoading());
          const response = await axiosInstance.post('/api/bookings/make-payment',{
            token,
            amount:selectedSeats.length * bus.fare * 100,
          })
          dispatch(HideLoading());
          if(response.data.success){
            message.success(response.data.message)
            bookNow(response.data.data.transactionId)
          }else{
            message.error(response.data.message)
          }
        } catch (error) {
          dispatch(HideLoading)
          message.error(error.message)
        }
      }

      const bookNow = async (transactionId) => {
        try {
          dispatch(ShowLoading());
          const response = await axiosInstance.post('/api/bookings/book-seat',{
            bus:bus._id,
            seats: selectedSeats,
            transactionId,
          })
          dispatch(HideLoading());
          if(response.data.success){
            message.success(response.data.message)
          }else{
            message.error(response.data.message)
          }
        } catch (error) {
          dispatch(HideLoading());
          message.error(error.message)
        }
      }

    useEffect(() => {
        getBus();
      }, [])
  return (
    <div>
        {bus && (
            <Row className='mt-3' gutter={[30,30]}>
            {/*  bus deatails area */}
            <Col lg={12} xs={24} sm={24} >
                <h1 className="text-xl primary-text">{bus.name}</h1>
                <h1 className="text-md">{bus.from} - {bus.to}</h1>
                <hr />
                <div className='flex flex-col gap-2' >
                    <p className='text-md'>Journey Date : {bus.journeyDate} </p>
                    <p className="text-md">Fare : ${bus.fare}/-</p>
                    <p className="text-md">Departure Time : {bus.departure}</p>
                    <p className="text-md">Arrival Time : {bus.arrival}</p>
                    <p className="text-md">Capacity : {bus.capacity}</p>
                    <p className="text-md">Seats Left : {bus.capacity-bus.seatsBooked.length}</p>
                </div>
                <hr />  
                <div className='flex flex-col gap-2 mt-2' >
                    <h1 className='text-2xl' > 
                        Selected Seats : {selectedSeats.join(',')}
                    </h1>
                    <h1 className='text-2xl'>Fare :  ₹ {bus.fare*selectedSeats.length}</h1>
                    <hr />
                    
                    <StripeCheckout 
                      billingAddress
                       token={onToken} 
                       amount={bus.fare * selectedSeats.length * 100}
                       currency='INR'
                      stripeKey="pk_test_51MazwsSC7dTkAVAN3UGsqb66BT1gLxI8lFqJ45gBMuQ6Fx8QjxxJ5Xk3G77f0xBg14SNAaY8R8NrTaN1RdHOZuHk00oAonMefT"
                    >
                    <button className={`btn secondary-btn ${selectedSeats.length === 0 && 'disabled-btn'}`} mt-3  disabled={selectedSeats.length=== 0} >Book Now</button>
                    </StripeCheckout>

                </div>
            </Col>

            {/* seat selection area */}
            <Col lg={12} xs={24} sm={24} >
                <SeatSelection selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} bus={bus} />
            </Col>
        </Row>
        )}
    </div>
  )
}

export default BookNow