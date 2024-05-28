import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from 'yup'

const Send = (props) => {

    // const location = useLocation();
    const email = props.props;
    console.log(email, "email");
    const schema = yup.object({
        to: yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "הכנס כתובת מייל תקינה").required('הכנס מייל תקין'),
        subject: yup.string(),
        body: yup.string(),
      })
        .required("must fill form");
        const { register, handleSubmit, formState: { errors } } = useForm({
            resolver: yupResolver(schema)
        });
    const onSubmit = (data) => {
        console.log(data, "data111111");
        data.to = email;
        axios.post("https://localhost:7181/SendEmail", data).then(
            x => {
                console.log(x.data);
                <>
                <p color="white">
                    נשלח בהצלחה
                </p>
                </>
                navigate('/')
            }
        ).catch(err => { console.log(err); })
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: '30vw', height: '15vw', position: 'absolute', top: '10vw', right: '30vw', backgroundColor: 'white', border: 'solid 2px black', padding: '2vw' }}>
            <TextField {...register('to')}
                style={{ border: errors.to ? '1px solid red' : '0px solid black', marginBottom: '8px', color: 'purple'  }}
                label="מייל העובד" variant="outlined"  defaultValue={email ? email : 'אין מייל במערכת נא  הכנס כתובת מייל ידנית'} />
                          {errors.to && <p style={{fontSize:'1vw'}}>{errors.to?.message}</p>}

                <TextField {...register('subject')} label="כותרת" variant="outlined" style={{ border: errors.subject ? '1px solid red' : '0px solid black', marginBottom: '8px', color: 'purple' }} />
                {errors.subject && <p style={{fontSize:'1vw'}}>{errors.subject?.message}</p>}
                <TextField {...register('body')} label="תוכן ההודעה" variant="outlined" style={{ border: errors.body ? '1px solid red' : '0px solid black', marginBottom: '8px', color: 'purple' }} />
                {errors.body && <p style={{fontSize:'1vw'}}>{errors.body?.message}</p>}
                <Button type="submit" variant="contained" style={{ backgroundColor: 'purple', color: 'white' }}>שלח</Button>
            </form>
        </>
    )
}
export default Send;