import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Header from "../Header";

const Details=()=>{
    const location = useLocation();
    const tz=location.state;
    const navigate=useNavigate();
    const employees=useSelector(state=>state.employees);
const dispatch=useDispatch()
    useEffect(() => {
        axios.get('https://localhost:7181/api/Employee')
          .then(response => {
            dispatch({ type: 'GET_EMPLOYEES', payload: response.data });
          })
          .catch(error => {
            console.error('Error fetching employees:', error);
          });
      }, []);

const employee=employees.filter(x=>x.tz==tz)[0];
console.log(employee?.roles, "rollllllllll");

const nav = (employee) => {
    navigate("/AddEditEmployee", { state: employee })
  }

  const delete1 = (employee) => {
    axios.delete(`https://localhost:7181/api/Employee/${employee.id}`).then(x => {
      console.log("deleted successfully");
window.location.reload();
    }).catch(err => { console.log(err + "not succeeded"); })
  }


return(
    <>
    <Header/>
    {localStorage.getItem('user')=="true"?
    <div style={{marginRight:"40vw"}}>
     <Card style={{ width: 300, margin: 10 }}>
      <CardContent>
        <Typography variant="h4">{employee?.name}</Typography>
        <Typography variant="h6">{employee?.familyName}</Typography>
        <Typography variant="body2">ת.ז.: {employee?.tz}</Typography>
        <Typography variant="body2">תאריך התחלה: {employee?.entryDate.split("T")[0]}</Typography>
        <Typography variant="body2">תאריך לידה: {employee?.birthDate.split("T")[0]}</Typography>
        <Typography variant="body2">מין: {employee?.kindOf==0?'זכר':'נקבה'}</Typography>
        <Typography variant="body2">תפקידים:</Typography>

        {employee?.roles.map((role, index) => (
          <Typography key={index} variant="body2">{role.role.name}</Typography>
        ))}
        <IconButton aria-label="edit" onClick={() => nav(employee)}>
          <Edit color="secondary" />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => delete1(employee)}>
          <Delete color="error" />
        </IconButton>
      </CardContent>
    </Card>
    
    </div>:<div>אין אפשרות לצפות בפרטי עובד למי שאינו מנהל אם הנך מנהל נא היכנס ונסה שוב</div>}
    </>
)

}
export default Details;