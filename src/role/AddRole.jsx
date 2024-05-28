import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { CheckBox } from '@mui/icons-material';
import Swal from 'sweetalert2';


const AddRoleForm = () => {

    const { handleSubmit, control } = useForm();
    const dispatch = useDispatch();
    const onSubmit = (data) => {
        // data.entryDate=null
        axios.post("https://localhost:7181/api/Role", data).
            then(x => {
                console.log("added successfully");
               dispatch({ type: "ADD_ROLL", payload: data });     
            }).catch(err => console.log(err + "not succeed"))
    };

    return (
        <>
       {localStorage.getItem('user')=="true"? <div style={{width: '40vw', marginRight: '30vw', marginTop: '10vw', backgroundColor:'white', border:'solid 2px black', padding:'2vw'}}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="שם התפקיד"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="isAdministrative"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} />}
                                label="האם תפקיד מנהלי?"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                         startIcon={<SaveIcon />}
                    >
                          שמור תפקיד 
                    </Button>
                </Grid>
            </Grid>
        </form>
        </div> 
:<div>אין אפשרות להוסיף תפקיד למי שאינו מנהל אם הנך מנהל נא היכנס ונסה שוב</div>}


        </>
    );
};

export default AddRoleForm;
