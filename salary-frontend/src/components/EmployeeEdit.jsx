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

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const res = await API.get(`/employees/${id}`);
            setForm(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.patch(`/employees/${id}`, {
                employee: form
            });

            navigate("/");
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    return (
        <div>
            <h2>Edit Employee</h2>

            <form onSubmit={handleSubmit}>
                <input name="first_name" value={form.first_name} onChange={handleChange} />
                <input name="last_name" value={form.last_name} onChange={handleChange} />
                <input name="job_title" value={form.job_title} onChange={handleChange} />
                <input name="country" value={form.country} onChange={handleChange} />
                <input name="salary" value={form.salary} onChange={handleChange} />

                <button type="submit">Update</button>
            </form>
        </div>
    );
}