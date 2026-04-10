import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function EmployeeEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        job_title: "",
        country: "",
        salary: ""
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/employees/${id}`);
            setForm(res.data || {});
        } catch (err) {
            console.error("Error fetching employee", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            await API.patch(`/employees/${id}`, {
                employee: form
            });

            navigate("/");
        } catch (err) {
            console.error("Update failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={styles.container}>
            <h2>Edit Employee</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                />

                <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                />

                <input
                    name="job_title"
                    value={form.job_title}
                    onChange={handleChange}
                    placeholder="Job Title"
                />

                <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country"
                />

                <input
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="Salary"
                    type="number"
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? "Updating..." : "Update"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: "15px",
        maxWidth: "500px",
        margin: "auto"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    }
};