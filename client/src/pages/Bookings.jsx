import React,{useState,useEffect, useRef} from 'react'
import PageTitle from '../components/PageTitle';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { axiosInstance } from '../helpers/axiosInstance';
import { message, Modal, Table } from 'antd';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';

const Bookings = () => {

    const [showPrintModel, setShowPrintModel] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([])
    const dispatch = useDispatch();

    const columns = [
        {
            title:"Bus Name",
            dataIndex:'name',
            key:'bus',
        },
        {
            title:"Bus Number",
            dataIndex:'number',
            key:'bus'
        },
        {
            title:"Journey Date",
            dataIndex:'journeyDate',
        },
        {
            title:"Journey Time",
            dataIndex:'departure',
            
        },
        {
            title:"Seats",
            dataIndex:'seats',
            render:(seats)=> {
                return seats.join(',')
            }
        },
        {
            title:'Action',
            dataIndex:'action',
            render: (text,record)=> (
                <div>
                    <h1 className="text-md underline" onClick={()=> {
                        setSelectedBooking(record);
                        setShowPrintModel(true);
                    }}>Print Ticket</h1>
                </div>
            )
        }
    ]
    

    const getBookings = async() => {
        try {
          dispatch(ShowLoading());
          const response = await axiosInstance.get('/api/bookings/get-bookings-by-user-id');
          console.log(response);
          dispatch(HideLoading());
          if(response.data.success){
            const mappedData = response.data.data.map((booking)=> {
                return {
                    ...booking,
                    ...booking.bus,
                    key:booking._id
                }
            })
            console.log(mappedData);
            setBookings(mappedData);
          }else{
            dispatch(HideLoading());
            message.error(response.data.message)
          }
        } catch (error) {
          dispatch(HideLoading());
          message.error(error.message)
        }
      }

    useEffect(() => { 
        getBookings();
      }, [])


    const componentRef = useRef();
    const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    });
      

  return (
    <div>
        <PageTitle tilte={'Bookings'} />
        <div className='mt-2' >
           <Table dataSource={bookings} columns={columns} />
        </div>

        {/* model */}
        {showPrintModel && (
            <Modal title='Print Ticket' onCancel={()=> {
                setSelectedBooking(null);
                setShowPrintModel(false);
              }} 
               open={showPrintModel}
               okText='Print'
               onOk={handlePrint}
            >
                <div className='d-flex flex-column p-5' ref={componentRef} >
                    <hr />
                    <h1 className="text-lg">Bus : {selectedBooking.name}</h1>
                    <h1 className="text-md text-secondary">{selectedBooking.from} - {selectedBooking.to}</h1>
                    <hr />
                    <p>
                        <span className='text-secondary' >Journey Date : </span>
                        {moment(selectedBooking.journeyDate).format('DD-MM-YYYY')}
                    </p>
                    <p>
                        <span className='text-secondary' >Journey Time : </span>
                        {selectedBooking.departure}
                    </p>
                    
                    <hr />
                    <p>
                        <span className='text-secondary text-lg' >Seat Number : </span><br />
                        {selectedBooking.seats.join(',')}
                    </p>
                    <hr />
                    <p>
                        <span className='text-secondary text-lg' >Total Amount : </span><br />
                        {selectedBooking.fare} /-
                        {/* {selectedBooking.fare * selectedBooking.seats.length} */}
                    </p>

                </div>

    
            </Modal>
        )}
    </div>
  )
}

export default Bookings