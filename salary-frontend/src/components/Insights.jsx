import { useState } from "react";
import API from "../api/api";

export default function Insights() {
    const [country, setCountry] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchInsights = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await API.get(`/employees/insights`, {
                params: {
                    country: country.trim(),
                    job_title: jobTitle.trim(),
                },
            });

            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch insights", err);
            setError("Failed to load insights. Please try again.");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Salary Insights</h2>

            <div style={styles.form}>
                <input
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />

                <input
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                />

                <button onClick={fetchInsights} disabled={loading}>
                    {loading ? "Loading..." : "Get Insights"}
                </button>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            {data && (
                <div style={styles.card}>
                    <p><b>Min Salary:</b> {data.min_salary}</p>
                    <p><b>Max Salary:</b> {data.max_salary}</p>
                    <p><b>Avg Salary:</b> {data.avg_salary}</p>
                    <p><b>Avg by Job:</b> {data.avg_by_job}</p>
                </div>
            )}
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
    },
    card: {
        marginTop: "15px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "6px"
    },
    error: {
        color: "red",
        marginTop: "10px"
    }
};