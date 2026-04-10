import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function EmployeeShow() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/employees/${id}`);
            setEmployee(res.data);
        } catch (err) {
            console.error("Error fetching employee", err);
            setEmployee(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    if (!employee) return <p>No employee found</p>;

    return (
        <div style={styles.container}>
            <h2>Employee Details</h2>

            <div style={styles.card}>
                <p><b>Full Name:</b> {employee.first_name} {employee.last_name}</p>
                <p><b>Job:</b> {employee.job_title}</p>
                <p><b>Country:</b> {employee.country}</p>
                <p><b>Salary:</b> {employee.salary}</p>
            </div>

            <button style={styles.button} onClick={() => navigate("/")}>
                Back
            </button>
        </div>
    );
}

const styles = {
    container: {
        padding: "15px",
        maxWidth: "600px",
        margin: "auto",
    },
    card: {
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "15px",
        backgroundColor: "#f9f9f9",
    },
    button: {
        padding: "8px 12px",
        cursor: "pointer",
    }
};