import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EmployeeShow from "./components/EmployeeShow";
import EmployeeEdit from "./components/EmployeeEdit";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees/:id" element={<EmployeeShow />} />
        <Route path="/employees/:id/edit" element={<EmployeeEdit />} />
      </Routes>
    </Router>
  );
}

export default App;