import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Container, TextField, Button, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import AddRoleForm from '../role/AddRole';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import './AddEditEmployee.css'
import Swal from 'sweetalert2';

const EditEmployeeForm = () => {

    const [open, setOpen] = useState(false);
    const location = useLocation();
    const employee = location.state;
    const [selectedRolls, setSelectedRoles] = useState([])
    const roles = useSelector(state => state.roles);
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employees)
    const navigate=useNavigate();

    const schema = yup.object({
        name: yup.string().min(3, "השם צריך להכיל לפחות 3 תוים").required("הכנס שם תקין "),
        familyName: yup.string().min(2, "שם המשפחה צריך להכיל לפחות 2 תוים").required("הכנס שם משפחה תקין"),
        tz: yup.string().matches(/^\d{9}$/, 'תעודת זהות חייבת להיות בעלת 9 ספרות בדיוק').required("הכנס ת.ז. תקינה"),
        birthDate: yup.date("חייב להיות מסוג תאריך").required("הכנס תאריך תקין "),
        // min: yup.any().required("הכנס מין תקין "),
        // roles: yup.tuple().required("הכנס לפחות תפקיד אחד"),
        email: yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        entryDate: yup.date("חייב להיות מסוג תאריך").required("הכנס תאריך תקין ")})
        .required("must fill form");
        const { register, handleSubmit, formState: { errors } } = useForm({
            resolver: yupResolver(schema)
        });
        useEffect(() => {
            axios.get('https://localhost:7181/api/Employee')
            .then(response => {
                console.log(response.data, "dataaemployee");
                dispatch({ type: 'GET_EMPLOYEES', payload: response.data });
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    }, []);

    useEffect(() => {
        axios.get("https://localhost:7181/api/Role").then(
            (x) => {
                dispatch({ type: 'GET_ROLLS', payload: x.data })
            }
        )
    }, [])

    useEffect(() => {
        const tempRoles = [];
        if(employee!=null)
       { for (let item of employee?.roles) {
            tempRoles.push(item.role?.name)
        }
                setSelectedRoles(tempRoles)}
    }, [])

    const handleDelete = (value) => {
        console.log(value, "value");
        setSelectedRoles(selectedRolls.filter(x => x != value))
    }




    const onSubmit = (data) => {

        console.log(data, "data");
        data.roles = selectedRolls;
        for (let i = 0; i < data.roles.length; i++) {
            data.roles[i] = { role: { name: data.roles[i] }, startDate: new Date() }
        }
        const id = employees.filter(x => x.tz == data.tz)[0]?.id;
        data.kindOf == 'זכר' ? data.kindOf = 0 : data.kindOf = 1;
        console.log(data, "with updates");
        if(employee)
        axios.put(`https://localhost:7181/api/Employee/${id}`, data).then(
            (x) => {
                console.log("employee edited successfuly");
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "נערך בהצלחה",
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate('/');
                setTimeout(() => {
                    
                }, 2000);
                window.location.reload();
            }
        ).catch((err) => {
            console.log(err);
            alert(err)
        })
        else
        axios.post(`https://localhost:7181/api/Employee`, data).then(
            (x) => {
                console.log("employee added successfuly");
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "נוסף בהצלחה",
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate('/');
                setTimeout(() => {
                    
                }, 20000 );
                window.location.reload();
            }
        ).catch((err) => {
            console.log(err);
            alert(err.response.data)
        })
    }


    return (
        <>
            <Header />

          {localStorage.getItem('user')=="true"? <><div>
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <AddRoleForm />
                </Modal>
            </div><div className='allForm' style={{ marginRight: '30vw' }}>
                    <Container maxWidth="sm">
                        <h2 style={{ textAlign: 'center' }}>{employee && 'עריכת עובד'} {!employee && 'הוספת עובד'}</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                {...register('tz')}
                                style={{ border: errors.tz ? '1px solid red' : '0px solid black' }}
                                label="תעודת זהות"
                                defaultValue={employee?.tz}
                                fullWidth />
                            {errors.tz && <p>{errors.tz?.message}</p>}
                            <TextField
                                {...register('name')}
                                style={{ border: errors.name ? '1px solid red' : '0px solid black' }}
                                label="שם"
                                fullWidth
                                defaultValue={employee?.name} />
                            {errors.name && <p>{errors.name?.message}</p>}
                            <TextField
                                {...register('familyName')}
                                style={{ border: errors.familyName ? '1px solid red' : '0px solid black' }}
                                label="שם משפחה"
                                defaultValue={employee?.familyName}
                                fullWidth />
                            {errors.familyName && <p>{errors.familyName.message}</p>}
                            <TextField
                                {...register('email')}
                                style={{ border: errors.email ? '1px solid red' : '0px solid black' }}
                                label="כתובת מייל"
                                defaultValue={employee?.email}
                                fullWidth />
                            {errors.familyName && <p>{errors.email.message}</p>}

                            <TextField
                                {...register('entryDate')}
                                style={{ border: errors.entryDate ? '1px solid red' : '0px solid black' }}
                                type="date"
                                label="תאריך התחלה"
                                defaultValue={employee?.entryDate.split("T")[0]}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            {errors.entryDate && <p>{errors.entryDate.message}</p>}
                            <TextField
                                {...register('birthDate')}
                                style={{ border: errors.birthDate ? '1px solid red' : '0px solid black' }}
                                type="date"
                                label="תאריך לידה"
                                defaultValue={employee?.birthDate.split("T")[0]}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            {errors.birthDate && <p>{errors.birthDate.message}</p>}
                            <FormControl fullWidth>
                                <InputLabel>מין</InputLabel>
                                <Select
                                    {...register('kindOf')}
                                    // style={{ border: errors.min ? '1px solid red' : '0px solid black' }}
                                    label="מין"
                                    defaultValue={employee?.kindOf == 0 ? 'זכר' : employee?.kindOf == 1 ? 'נקבה' : ''}
                                    fullWidth
                                >
                                    {/* {errors.min && <p>{errors.min?.message}</p>} */}
                                    <MenuItem value="זכר">זכר</MenuItem>
                                    <MenuItem value="נקבה">נקבה</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>תפקידים</InputLabel>
                                <Select
                                    {...register('roles')}
                                    // style={{ border: errors.roles ? '1px solid red' : '0px solid black' }}
                                    multiple
                                    value={selectedRolls}
                                    onChange={(e) => setSelectedRoles([...selectedRolls, e.target.value[e.target.value.length - 1]])}
                                    label="תפקידים"
                                    fullWidth
                                >
                                    {/* {errors.roles && <p>{errors.roles?.message}</p>} */}
                                    {roles.map((role, index) => (
                                        <MenuItem key={index} value={role?.name}>{role?.name}</MenuItem>
                                    ))}
                                </Select>
                                <Button variant='secondary' onClick={() => setOpen(true)}>הוסף תפקיד לרשימת התפקידים</Button>
                            </FormControl>
                            <div style={{ marginTop: '1rem' }}>

                                {selectedRolls.map((role, i) => (
                                    <Chip key={i} label={role} onDelete={() => handleDelete(role)} style={{ margin: '0.5rem' }} />
                                ))}
                            </div>
                            <Button type="submit" variant="contained" color="secondary" fullWidth>{employee && 'אישור'}{!employee && 'הוספה'}</Button>
                        </form>
                    </Container>
                </div></>:<div>אין אפשרות להוסיף/לערוך עובד למי שאינו מנהל אם הנך מנהל נא היכנס ונסה שוב</div>}
        </>
    )
}

export default EditEmployeeForm;
