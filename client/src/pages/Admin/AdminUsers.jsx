import React,{useState,useEffect} from 'react'
import BusForm from '../../components/BusForm';
import PageTitle from '../../components/PageTitle';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import { axiosInstance } from '../../helpers/axiosInstance';
import { message, Table } from 'antd';
import moment from 'moment';
 


const AdminUsers = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  
  const columns = [
    {
      title:'Name',
      dataIndex: 'name'
    },
    {
      title:'Email',
      dataIndex:'email'
    },
    {
      title:'Status',
      dataIndex:'',
      render:(data)=> {
        return data.isBlocked ? 'Blocked' : 'Active'
      }
    },
    {
      title:'Role',
      dataIndex:'',
      render:(data)=> {
        if(data?.isAdmin){
          return 'Admin'
        }else{
          return 'User'
        }
      }
    },
    {
      title:'Action',
      dataIndex:'action',
      render : (action,record)=> (
        <div className='d-flex gap-3' >
            {record?.isBlocked && <p className='underline' onClick={()=> updateUserPermitions(record,'unblock')} >Unblock</p>}
            {!record?.isBlocked && <p className='underline' onClick={()=> updateUserPermitions(record,'block')} >Block</p>}
            {record?.isAdmin && <p className='underline' onClick={()=> updateUserPermitions(record,'remove-admin')} >Remove Admin</p>}
            {!record?.isAdmin && <p className='underline' onClick={()=> updateUserPermitions(record,'make-admin')} >Make Admin</p>}
            <p className="underline">Delete</p>
        </div>
      )
    }
  ]

  const getUsers = async() => { 
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/users/get-all-users');
      console.log(response);
      dispatch(HideLoading());
      if(response.data.success){
        setUsers(response.data.data); 
        console.log(users);
      }else{
        dispatch(HideLoading());
        message.error(response.data.message)
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message)
    }
  }

  const updateUserPermitions = async(user,action) => {

    try {
      let payload = null;
      if(action === "make-admin"){
        payload ={
          ...user,
          isAdmin:true,
        }
      }else if(action === 'remove-admin'){
        payload = {
          ...user,
          isAdmin:false
        }
      }else if(action === 'block'){
        payload = {
          ...user,
          isBlocked:true,
        }
      }else if(action === 'unblock'){
        payload = {
          ...user,
          isBlocked:false
        }
      }
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/users/update-user-permitions', payload);
      dispatch(HideLoading())
      if(response.data.success){
        getUsers();
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
    getUsers();
  }, [])
  

  return (
    <div>
      <div className='d-flex justify-content-between' >
        <PageTitle tilte={"Users"}/>
        
      </div>
      <Table columns={columns} dataSource={users} />
      
      
    </div>
  )
}

export default AdminUsers