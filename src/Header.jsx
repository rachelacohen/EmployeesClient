import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';



const Header = () => {
    const navigate= useNavigate();
    const toAdd=()=>{
        navigate('/AddEditEmployee')
      }

    const  toAll=()=>{
        navigate('/')
    }
    const toLogin=()=>{
        navigate('/Login')
    }
  return (
    <div className="header" style={{position: 'absolute', top: 0, right: 10}}>
      <Button variant="contained" color="secondary" style={{marginRight:'2vw'}} onClick={()=>toLogin()}>כניסה</Button>
      <Button variant="contained" color="secondary" style={{marginRight:'2vw'}} onClick={()=>toAll()}>לכל העובדים</Button>
      <Button variant="contained" color="secondary" style={{marginRight:'2vw'}} onClick={()=>toAdd()}>הוספת עובד</Button>
      <Button variant="contained" color="secondary" style={{marginRight:'2vw'}} onClick={()=>{localStorage.setItem("user", "false"), navigate('/'), window.location.reload()}}>התנתקות</Button>
   
    </div>  
  )
}
export default Header;