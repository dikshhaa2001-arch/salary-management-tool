import { useState } from "react";
import API from "../api/api";

export default function EmployeeForm({ onSuccess }) {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        job_title: "",
        country: "",
        salary: "",
        email: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post("/employees", { employee: form });
        setForm({
            first_name: "",
            last_name: "",
            job_title: "",
            country: "",
            salary: "",
            email: "",
        });
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Employee</h2>
            <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} />
            <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} />
            <input name="job_title" placeholder="Job Title" value={form.job_title} onChange={handleChange} />
            <input name="country" placeholder="Country" value={form.country} onChange={handleChange} />
            <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <button type="submit">Add</button>
        </form>
    );
}