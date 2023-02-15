import React,{useState,useEffect} from 'react'
import BusForm from '../../components/BusForm';
import PageTitle from '../../components/PageTitle';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import { axiosInstance } from '../../helpers/axiosInstance';
import { message, Table } from 'antd';
import moment from 'moment';
 


const AdminBuses = () => {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null)
  
  const columns = [
    {
      title:'Name',
      dataIndex: 'name'
    },
    {
      title:'Number',
      dataIndex:'number'
    },
    {
      title:'From',
      dataIndex:'from'
    },
    {
      title:'To',
      dataIndex:'to'
    },
    {
      title:'Journey Date',
      dataIndex:'journeyDate',
    },
    {
      title:'Status',
      dataIndex:'status'
    },
    {
      title:'Action',
      dataIndex:'action',
      render : (action,record)=> (
        <div className='d-flex gap-3' >

          <i class="ri-edit-2-fill" onClick={()=> {
            setSelectedBus(record);
            setShowBusForm(true)
          }} ></i>
          
          <i class="ri-delete-bin-line" onClick={()=> {
            deleteBus(record._id)
          }} ></i>
        </div>
      )
    }
  ]

  const getBuses = async() => { 
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/buses/get-all-buses');
      console.log(response);
      dispatch(HideLoading());
      if(response.data.success){
        setBuses(response.data.data);
      }else{
        dispatch(HideLoading());
        message.error(response.data.message)
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message)
    }
  }

  const deleteBus = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/buses/delete-bus',{
        _id : id,
      });
      getBuses()
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
    getBuses();
  }, [])
  

  return (
    <div>
      <div className='d-flex justify-content-between' >
        <PageTitle tilte={"Buses"}/>
        <button onClick={()=> setShowBusForm(true)} className='primary-btn' >Add Bus</button>
      </div>
      <Table columns={columns} dataSource={buses} />
      {showBusForm && <BusForm showBusForm={showBusForm} setShowBusForm={setShowBusForm} type={selectedBus ? 'edit' : 'add'} 
      selectedBus = {selectedBus} setSelectedBus={setSelectedBus} getData = {getBuses}
      />}
    </div>
  )
}

export default AdminBuses