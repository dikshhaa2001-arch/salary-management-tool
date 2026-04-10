import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function EmployeeList({ refresh }) {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const perPage = 10;
    const totalPages = Math.ceil(total / perPage);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await API.get(`/employees?page=${page}`);

            setEmployees(res.data.data || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error("Failed to fetch employees", err);
            setError("Failed to load employees");
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await API.delete(`/employees/${id}`);

            const updated = employees.filter(emp => emp.id !== id);
            setEmployees(updated);

            if (updated.length === 0 && page > 1) {
                setPage(prev => prev - 1);
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [refresh, page]);

    return (
        <div style={styles.container}>
            <h2>Employee List</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={styles.error}>{error}</p>}

            {!loading && employees.length === 0 && !error && (
                <p>No employees found</p>
            )}

            {!loading && employees.length > 0 && (
                <>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Job</th>
                                    <th>Country</th>
                                    <th>Salary</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp.id}>
                                        <td>{emp.id}</td>
                                        <td>
                                            {emp.first_name} {emp.last_name}
                                        </td>
                                        <td>{emp.job_title}</td>
                                        <td>{emp.country}</td>
                                        <td>{emp.salary}</td>
                                        <td>
                                            <button onClick={() => navigate(`/employees/${emp.id}`)}>
                                                View
                                            </button>{" "}
                                            <button onClick={() => navigate(`/employees/${emp.id}/edit`)}>
                                                Edit
                                            </button>{" "}
                                            <button onClick={() => deleteEmployee(emp.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={styles.pagination}>
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                            Prev
                        </button>

                        <span>
                            Page {page} of {totalPages || 1}
                        </span>

                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: "10px",
        maxWidth: "100%",
    },
    tableWrapper: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "700px",
    },
    pagination: {
        marginTop: "15px",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap",
    },
    error: {
        color: "red",
    },
};