import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Employees = () => {
    const navigate = useNavigate();
    const [users, setUserData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5249/api/Employees");
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        fetchData();
    }, []);

    const handleShowDetails = (item) => {

        localStorage.setItem('selectedEmployee', JSON.stringify(item));

        navigate("/profile");
    };

    return (
        <div>
            <table class="table table-striped table-bordered table-hover" align="center">
  <thead class="table-dark">
    <tr>
      <th>EmpId</th>
      <th>EmployName</th>
      <th>MgrId</th>
      <th>LeaveAvail</th>
      <th>DateOfBirth</th>
      <th>Email</th>
      <th>Mobile</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.map((item) => (
      <tr key={item.empId}>
        <td>{item.empId}</td>
        <td>{item.employName}</td>
        <td>{item.mgrId}</td>
        <td>{item.leaveAvail}</td>
        <td>{item.dateOfBirth}</td>
        <td>{item.email}</td>
        <td>{item.mobile}</td>
        <td>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleShowDetails(item)}
          >
            Show Details
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
    );
};

export default Employees;
