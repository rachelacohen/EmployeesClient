import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import Header from "../Header";
import Swal from "sweetalert2";
import *  as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import {useNavigate} from 'react-router-dom'

const Login=()=>{

  const navigate=useNavigate()
    const schema = yup.object({
        userName: yup.string().min(3, "השם צריך להכיל לפחות 3 תוים").required("הכנס שם משתמש תקין "),
        password: yup.string().min(4, "הסיסמא צריכה להכיל לפחות 4 תוים").required("כנס סיסמא תקינה").required('הכנס נתונים תקינים')})
        const { register, handleSubmit, formState: { errors } } = useForm({
            resolver: yupResolver(schema)
        });
    const onSubmit=(data)=>{
        console.log(data);
        axios.post("https://localhost:7181/api/Auth", data)
        .then((x)=>{
            console.log(x.data);
            localStorage.setItem('user', "true")
            Swal.fire({
                position: "center",
                icon: "success",
                title: "נכנסת בהצלחה",
                showConfirmButton: false,
                timer: 2000
            });
            navigate('/')
        }).catch((err)=>{
        //   Swal.fire({
        //     position: "center",
        //     icon: "error",
        //     title: "שם משתמש או סיסמא שגויים",
        //     showConfirmButton: false,
        //     timer: 2000
        // });
          console.log(err)
          localStorage.setItem('user', "false")
        })
    }

    return(
        <>
        <Header/>
    <div style={{position:'absolute', top: 200, right:500, width: '30vw'}}>
      <form  onSubmit={handleSubmit(onSubmit)} style={{display:'flex', flexDirection: 'column'}}>
      <TextField
       {...register('userName', {required:true})}
       style={{ border: errors.userName ? '1px solid red' : '0px solid black' }}
        label="שם משתמש"
        variant="outlined"
        placeholder='שם משתמש'
      />
    {errors.userName && <p style={{fontSize: '1vw'}}>שדה חובה</p>}
      <TextField
       {...register('password', {required:true})}
       style={{ border: errors.password ? '1px solid red' : '0px solid black' }}
        label="סיסמא"
        variant="outlined"
        placeholder='סיסמא'
        type="password"
      />
       {errors.password && <p style={{fontSize: '1vw'}}>שדה חובה</p>}
      
      <Button variant="outlined" color="secondary" type="submit">
        אישור
      </Button>
    </form>
 </div>
        </>
    )
}
export default Login;