import { useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import Insights from "../components/Insights";

export default function Dashboard() {
    const [refresh, setRefresh] = useState(false);

    return (
        <div>
            <h1>Salary Management Tool</h1>

            <EmployeeForm onSuccess={() => setRefresh(!refresh)} />
            <EmployeeList refresh={refresh} />
            <Insights />
        </div>
    );
}