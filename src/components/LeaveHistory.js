import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveHistory = () => {
    const selectedEmployee = JSON.parse(localStorage.getItem('selectedEmployee'));
    const [users, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ensure the selectedEmployee exists and has a valid empId
    useEffect(() => {
        const fetchData = async () => {
            if (selectedEmployee && selectedEmployee.empId) {
                try {
                    // Make the API request using the selectedEmployee's empId
                    const response = await axios.get(
                        `http://localhost:5249/api/LeaveHistories/searchLeavebyEmpId?empid=${selectedEmployee.empId}`
                    );
                    setData(response.data); // Set the response data to users state
                } catch (err) {
                    console.error('Error fetching leave history:', err);
                    setError('Error fetching leave history data.');
                } finally {
                    setLoading(false); // Stop the loading indicator
                }
            } else {
                setError('No employee data found.');
                setLoading(false);
            }
        };

        fetchData(); // Call fetchData when the component mounts
    }, [selectedEmployee]); // Run this effect only if selectedEmployee changes

    if (loading) {
        return <div>Loading leave history...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <table class="table table-striped table-bordered table-hover" align="center">
  <thead class="table-dark">
    <tr>
      <th>Start</th>
      <th>End</th>
      <th>Days</th>
      <th>Status</th>
      <th>Reason</th>
      <th>Manager Comments</th>
    </tr>
  </thead>
  <tbody>
    {users.length > 0 ? (
      users.map((item) => (
        <tr key={item.leaveId}>
          <td>{item.leaveStartDate}</td>
          <td>{item.leaveEndDate}</td>
          <td>{item.noOfDays}</td>
          <td>{item.leaveStatus}</td>
          <td>{item.leaveReason}</td>
          <td>{item.managerComments}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-center">No leave history available.</td>
      </tr>
    )}
  </tbody>
</table>

        </div>
    );
};

export default LeaveHistory;
