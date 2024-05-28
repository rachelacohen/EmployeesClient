
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllEmployee from './employee/AllEmployees';
import AddEditEmployee from './employee/AddEditEmployee';
import AddRoleForm from './role/AddRole';
import Details from './employee/EmployeeDetails';
import Login from './login/Login';
import Send from './employee/Send';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllEmployee />} />
        <Route path="/AddEditEmployee" element={<AddEditEmployee/>} />
        <Route path="/AddEditEmployee" element={<AddEditEmployee />} />
        <Route path="/AddRole" element={<AddRoleForm />} />
        <Route path="/EmployeeDetails" element={<Details />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SendEmail" element={<Send />} />
      </Routes>
    </Router>
  );
}

export default App;
