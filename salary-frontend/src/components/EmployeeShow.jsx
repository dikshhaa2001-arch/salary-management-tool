import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function EmployeeShow() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const res = await API.get(`/employees/${id}`);
            setEmployee(res.data);
        } catch (err) {
            console.error("Error fetching employee", err);
        }
    };

    if (!employee) return <p>Loading...</p>;

    return (
        <div>
            <h2>Employee Details</h2>

            <p><b>Full Name:</b> {employee.first_name} {employee.last_name}</p>
            <p><b>Job:</b> {employee.job_title}</p>
            <p><b>Country:</b> {employee.country}</p>
            <p><b>Salary:</b> {employee.salary}</p>

            <button onClick={() => navigate("/")}>Back</button>
        </div>
    );
}