import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Button, Input, TableCell, TableRow, TableHead, TableContainer, Table, TableBody, Modal, Tooltip } from '@mui/material';
import { Delete, Edit, Email, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import './AllEmployees.css'
import Header from "../Header";
import Send from "./Send";

const AllEmployee = () => {

  const employees = useSelector(state => state?.employees);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [employeesToShow, setEmployeesToShow] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [toShow, setToShow] = useState(true);

  useEffect(() => {
    axios.get('https://localhost:7181/api/Employee')
      .then(response => {
        dispatch({ type: 'GET_EMPLOYEES', payload: response.data });
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  useEffect(() => {
    setEmployeesToShow(employees)
  }, employees)

  useEffect(() => {
    setToShow(localStorage.getItem('user') != "true")
  }, [])

  const downloadCSV = () => {
    const csvData = arrayToCsv(employees);
    const csvContent = "\uFEFF" + csvData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "employees.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };



  const arrayToCsv = (data) => {
    if (!data || !data.length) {
      return null;
    }

    const separator = ',';
    const keys = Object.keys(data[0]);

    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const columns = ['TZ', 'Name', 'FamilyName', 'BirthDate', 'KindOf', 'EntryDate', 'Roles'];

    const csvContent = [
      columns.join(separator),
      ...data.map(item => {
        return [
          item.tz,
          item.name,
          item.familyName,
          formatDate(item.birthDate),
          item.KindOf == 0 ? 'זכר' : 'נקבה',
          formatDate(item.entryDate),
          item.roles.map(x => x.role?.name).join(separator)
        ].join(separator);
      })
    ].join('\n');

    return csvContent;
  };



  const nav = (employee) => {
    navigate("/AddEditEmployee", { state: employee })
  }

  const delete1 = (employee) => {
    axios.delete(`https://localhost:7181/api/Employee/${employee.id}`).then(x => {
      console.log("deleted successfully");
      window.location.reload();
    }).catch(err => { console.log(err + "not succeeded"); })
  }

  const filtering = (word) => {
    setEmployeesToShow([...employees])
    let filteredEmployees = [...employees]
    if (word !== "") {
      filteredEmployees = filteredEmployees.filter(employee =>
        employee.name?.includes(word) ||
        employee.familyName?.includes(word) ||
        employee.tz?.includes(word) ||
        employee.startDate?.includes(word) ||
        employee.roles?.some(role => role.role?.name?.includes(word))
      );
    }

    setEmployeesToShow(filteredEmployees);
  }

  const toEdit = (id) => {
    navigate('/EmployeeDetails', { state: id })
  }

  return (
    <>

      <Header />
     { toShow&&<div class="alert">
        <span class="closebtn" onClick={()=>setToShow(false)}>&times;</span>
        אינך רשום כמנהל, אינך רשאי לבצע פעולות, אם הנך מנהל הכנס בכפתור "כניסה" ונסה שוב
      </div>}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Send props={email} />
      </Modal>

      <div style={{ display: 'flex', flexDirection: 'column', width: "80vw", position: "absolute", top: "10vw" }}>
        <div className="top" style={{ marginBottom: 20, marginLeft: 200 }}>
          <Button style={{ marginBottom: 20, border: "2px solid purple" }} color="secondary" onClick={downloadCSV} disabled={localStorage.getItem('user') != "true"}>הורד קובץ CSV</Button>
          <IconButton>
            <Search color="secondary" />
          </IconButton>
          <Input className="search" color="secondary" onChange={(event) => filtering(event.target.value)} placeholder="הקלד כדי לחפש..." />
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bolder" }}>שם</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>שם משפחה</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>ת.ז.</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>תאריך התחלה</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeesToShow.map((employee, i) => (
                employee.status && (
                  <TableRow key={i}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.familyName}</TableCell>
                    <TableCell>{employee.tz}</TableCell>
                    <TableCell>{employee.entryDate.split('T')[0]}</TableCell>
                    <TableCell>
                      <Tooltip title="עריכת פרטים">
                        <IconButton aria-label="edit" onClick={() => nav(employee)} disabled={localStorage.getItem('user') != "true"}>
                          <Edit color="secondary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחיקה">
                        <IconButton aria-label="delete" onClick={() => delete1(employee)} disabled={localStorage.getItem('user') != "true"}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="שליחת אימייל">
                        <IconButton onClick={() => { setEmail(employee.email), setOpen(true) }} disabled={localStorage.getItem('user') != "true"}>
                          <Email color="secondary" />
                        </IconButton>
                      </Tooltip>
                      <Button color="secondary" onClick={() => toEdit(employee.tz)} disabled={localStorage.getItem('user') != "true"}>פרטי העובד</Button>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default AllEmployee;