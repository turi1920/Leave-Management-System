import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplyLeave = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [leaveType, setLeaveType] = useState('Sick Leave');
    const [reason, setReason] = useState('');
    const [managerComments, setManagerComments] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [noOfDays, setNoOfDays] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [empId, setEmpId] = useState(null);
    const [leaveAvail, setLeaveAvail] = useState(0); // Track leave available from localStorage

    useEffect(() => {
        const selectedEmployee = JSON.parse(localStorage.getItem('selectedEmployee'));
        if (selectedEmployee && selectedEmployee.empId) {
            setEmpId(selectedEmployee.empId);
            setLeaveAvail(selectedEmployee.leaveAvail);  // Set the leave available from localStorage
        } else {
            setErrorMessage('Employee data not found in localStorage');
        }
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (start > end) {
                setErrorMessage('End date must be later than the start date.');
                setNoOfDays(0);
                return;
            }
            if (start < today) {
                setErrorMessage('Start date must be greater than today\'s date.');
                setNoOfDays(0);
                return;
            }

            const timeDiff = end - start;
            const diffInDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            setNoOfDays(diffInDays);
            setErrorMessage('');
        }
    }, [startDate, endDate]);

    const handleApply = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate || !reason || !empId) {
            setErrorMessage('Please fill in all the required fields.');
            return;
        }

        // Check if the employee has enough leave available
        if (noOfDays > leaveAvail) {
            setErrorMessage('Insufficient leave balance.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        // Prepare the leave application data
        const leaveData = {
            leaveId: 0,
            empId,
            leaveStartDate: startDate,
            leaveEndDate: endDate,
            noOfDays,
            leaveStatus: "Pending",
            leaveReason: reason,
            managerComments: managerComments || ""
        };

        try {
            // Submit the leave application request to the backend
            const leaveResponse = await axios.post("http://localhost:5249/api/LeaveHistories", leaveData);
            console.log('Leave application submitted:', leaveResponse.data);
            alert("Leave application submitted successfully!");

            // Now update the employee's leave availability in the employee table
            const updatedLeaveAvail = leaveAvail - noOfDays;  // Subtract days taken from available leave

            const empData = {
                empId,
                noOfDays, // Number of days to deduct
            };

            // Send the request to update the leave availability in the employee table
            const updateResponse = await axios.put("http://localhost:5249/api/Employees/updateLeaveAvail", empData);
            console.log('Leave availability updated:', updateResponse.data);

        } catch (error) {
            console.error('Error submitting leave request:', error);
            setErrorMessage('An error occurred while submitting the leave request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setStartDate('');
        setEndDate('');
        setNoOfDays(0);
        setLeaveType('Sick Leave');
        setReason('');
        setManagerComments('');
        setErrorMessage('');
    };

    if (!empId) {
        return <div>Loading employee data...</div>;
    }

    return (
        <div className="container">
            <h3>Apply for Leave</h3>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleApply}>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Number of Days</label>
                    <p>{noOfDays} day{noOfDays !== 1 ? 's' : ''}</p>
                </div>

                <div className="form-group">
                    <label htmlFor="leaveType">Leave Type</label>
                    <select
                        id="leaveType"
                        className="form-control"
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                    >
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Personal">Personal</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="reason">Reason</label>
                    <textarea
                        id="reason"
                        className="form-control"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows="4"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="managerComments">Manager Comments</label>
                    <textarea
                        id="managerComments"
                        className="form-control"
                        value={managerComments}
                        onChange={(e) => setManagerComments(e.target.value)}
                        rows="2"
                    ></textarea>
                </div>

                <div className="form-group">
                    <button type="submit" className="btn btn-primary mr-2" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Apply'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplyLeave;
