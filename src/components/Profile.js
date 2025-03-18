import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeaveHistory from './LeaveHistory';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [employee, setEmployee] = useState(null);
    const [manager, setManager] = useState(null);

    const navigate = useNavigate()
    // Fetch the selected employee from localStorage and the manager details if available
    useEffect(() => {
        const selectedEmployee = JSON.parse(localStorage.getItem('selectedEmployee'));

        if (selectedEmployee) {
            setEmployee(selectedEmployee);
            
            // Fetch manager details only if mgrId is not null or undefined
            if (selectedEmployee.mgrId != null) {
                fetchManagerDetails(selectedEmployee.mgrId);
            } else {
                console.log('No manager assigned');
            }
        } else {
            console.log('No employee data found');
        }
    }, []); // This effect runs once when the component mounts

    //Navigation handle
    const handleNavigate = () => {
        // Save the employee ID to localStorage (or send the employee object via state)
        localStorage.setItem('selectedEmployee', JSON.stringify(employee));

        // Navigate to the details page (can use another page or component)
        navigate('/applyleave'); // This is where we navigate to the details page
    };

    //For Subordinate Leaves
    const handleNavigateLeave = () => {
        localStorage.setItem('selectedEmployee', JSON.stringify(employee));
        navigate('/subordinateleave');
    };


    // Function to fetch manager details
    const fetchManagerDetails = async (mgrId) => {
        try {
            const response = await axios.get(`http://localhost:5249/api/Employees/${mgrId}`);
            setManager(response.data);  // Set the manager details
        } catch (error) {
            console.error('Error fetching manager data:', error);
            setManager(null);  // In case of an error, set manager to null
        }
    };

    if (!employee) {
        return <div>Loading...</div>;  // Show loading message until employee data is available
    }

    return (
        <div className="container text-center">
            <div className="row">
                {/* Left column: Employee details */}
                <div className="col">
                    <h2>Employee Profile</h2>
                    <p><strong>EmpId:</strong> {employee.empId}</p>
                    <p><strong>Employee Name:</strong> {employee.employName}</p>
                    <p><strong>Manager ID:</strong> {employee.mgrId || 'No Manager'}</p>
                    <p><strong>Leave Available:</strong> {employee.leaveAvail}</p>
                    <p><strong>Date of Birth:</strong> {employee.dateOfBirth}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Mobile:</strong> {employee.mobile}</p>
                    <br/>
                    <br/>
                    <button onClick={handleNavigate} className="btn btn-primary mt-4">
                Apply Leave
            </button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={handleNavigateLeave} className="btn btn-primary mt-4">
                Subordinate Pending Leaves
            </button>
                </div>

                {/* Right column: Manager details */}
                <div className="col">
                    <h3>Manager Info</h3>
                    {manager ? (
                        <>
                            <p><strong>EmpId:</strong> {manager.empId}</p>
                            <p><strong>Employee Name:</strong> {manager.employName}</p>
                            <p><strong>Manager ID:</strong> {manager.mgrId}</p>
                            <p><strong>Leave Available:</strong> {manager.leaveAvail}</p>
                            <p><strong>Date of Birth:</strong> {manager.dateOfBirth}</p>
                            <p><strong>Email:</strong> {manager.email}</p>
                            <p><strong>Mobile:</strong> {manager.mobile}</p>
                        </>
                    ) : (
                        <p>No manager information available</p>
                    )}
                </div>
            </div>
            <div>
                <h3>HIIIIIIII</h3>
                <LeaveHistory/>
            </div>
        </div>
    );
};

export default Profile;
