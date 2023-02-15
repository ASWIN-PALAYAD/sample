import React,{useState} from 'react'
import '../resources/layout.css'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

const DefaultLayout = ({children}) => {

    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false)
    const {user} = useSelector(state=> state.users)
    const userMenu = [
        {   
            name:'Home',
            path:'/',
            icon: 'ri-home-line'
        },
        {
            name: 'Bookings',
            path:'/bookings',
            icon:'ri-file-list-line'
        },
        {
            name:'Profile',
            path:'/profile',
            icon:'ri-user-line'
        },
        {
            name:'Logout',
            path:'/logout',
            icon:'ri-logout-box-line'
        }
    ];
    const adminMenu = [

        {   
            name:'Home',
            path:'/',
            icon: 'ri-home-line'
        },
        {
            name:'Buses',
            path:'/admin/buses',
            icon:'ri-bus-line'
        },
        {
            name:'Users',
            path:'/admin/users',
            icon:'ri-user-line'
        },
       
        {
            name: 'Bookings',
            path:'/bookings',
            icon:'ri-file-list-line'
        },
        {
            name:'Profile',
            path:'/profile',
            icon:'ri-user-line'
        },
        {
            name:'Logout',
            path:'/logout',
            icon:'ri-logout-box-line'
        }
    ];
    const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu
    let activeRoute = window.location.pathname;
    if(window.location.pathname.includes('book-now')){
        activeRoute = '/'
    }

    

  return (
    <div className="layout-parent">
        <div className="sidebar">
            <div className="sidebar-header">
                <h1 className='logo' >SB</h1>
                <h1 className='role'>{user?.name} <br /> role : { user?.isAdmin ? 'Admin' : 'User'}</h1>

            </div>
            <div className='d-flex flex-column gap-3 justify-content-start menu' >
                {menuToBeRendered.map((item,index)=>{
                    return (
                        <div key={index} className={`${activeRoute === item.path && 'active-menu-item'} menu-item`}>
                            <i className={item.icon}/>
                            {!collapsed && (
                            <span onClick={()=> {
                                if(item.path === '/logout'){
                                    localStorage.removeItem('token');
                                    navigate('/login')
                                }else{
                                    navigate(item.path)
                                }
                            }} >
                                {item.name}
                            </span>)}

                        </div>  
                    )
                })}
            </div>
            
        </div>
        <div className="body">
            <div className="header">
                {collapsed ? (
                <i onClick={()=> setCollapsed(!collapsed)} className="ri-menu-2-fill"></i>
                ) : (
                <i onClick={()=> setCollapsed(!collapsed)} className="ri-close-line"></i>
                )}
            </div>
            <div className="content">
                {children}
            </div>
        </div>
        
    </div>
  )
}

export default DefaultLayout