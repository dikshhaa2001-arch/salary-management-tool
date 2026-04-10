import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function EmployeeList({ refresh }) {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const perPage = 10;
    const totalPages = Math.ceil(total / perPage);

    // Fetch employees
    const fetchEmployees = async () => {
        try {
            setLoading(true);

            const res = await API.get(`/employees?page=${page}`);

            setEmployees(res.data.data || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error("Failed to fetch employees", err);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    // Delete employee
    const deleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        try {
            await API.delete(`/employees/${id}`);

            const updated = employees.filter(emp => emp.id !== id);
            setEmployees(updated);

            // 🔥 Edge case fix: if page becomes empty
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
        <div>
            <h2>Employee List</h2>

            {loading && <p>Loading...</p>}

            {!loading && employees.length === 0 && <p>No employees found</p>}

            {!loading && employees.length > 0 && (
                <>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Job</th>
                                <th>Country</th>
                                <th>Salary</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.first_name} {emp.last_name}</td>
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

                    {/* Pagination */}
                    <div style={{ marginTop: "15px" }}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Prev
                        </button>

                        <span style={{ margin: "0 10px" }}>
                            Page {page} of {totalPages || 1}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}