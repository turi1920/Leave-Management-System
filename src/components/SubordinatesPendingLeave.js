import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubordinateLeaveHistory = () => {
    const selectedEmployee = JSON.parse(localStorage.getItem('selectedEmployee'));
    const [users, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedEmployee && selectedEmployee.empId) {
                try {
                    const response = await axios.get(`http://localhost:5249/api/LeaveHistories/pendingLeaves?empId=${selectedEmployee.empId}`);
                    setData(response.data);
                } catch (err) {
                    console.error('Error fetching leave history:', err);
                    setError('Error fetching leave history data.');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('No employee data found.');
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedEmployee]);
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
      <th>EmpID</th>
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
          <td>{item.empId}</td>
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
export default SubordinateLeaveHistory;

//http://localhost:5249/api/LeaveHistories/pendingLeaves?empId=2000
