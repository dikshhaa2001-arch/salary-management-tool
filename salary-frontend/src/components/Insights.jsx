import { useState } from "react";
import API from "../api/api";

export default function Insights() {
    const [country, setCountry] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [data, setData] = useState(null);

    const fetchInsights = async () => {
        const res = await API.get(`/employees/insights`, {
            params: { country, job_title: jobTitle },
        });
        setData(res.data);
    };

    return (
        <div>
            <h2>Salary Insights</h2>

            <input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
            <input placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />

            <button onClick={fetchInsights}>Get Insights</button>

            {data && (
                <div>
                    <p>Min Salary: {data.min_salary}</p>
                    <p>Max Salary: {data.max_salary}</p>
                    <p>Avg Salary: {data.avg_salary}</p>
                    <p>Avg by Job: {data.avg_by_job}</p>
                </div>
            )}
        </div>
    );
}