import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EmployeeList from "./EmployeeList";
import API from "../api/api";
import { vi } from "vitest";

// ✅ FIX 1: Proper API mock
vi.mock("../api/api", () => ({
    default: {
        get: vi.fn(),
        delete: vi.fn(),
    },
}));

// mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// helper render
const renderComponent = () =>
    render(
        <BrowserRouter>
            <EmployeeList refresh={false} />
        </BrowserRouter>
    );

// mock data
const mockEmployeesPage1 = {
    data: {
        data: [
            {
                id: 1,
                first_name: "Abhi",
                last_name: "Kumar",
                job_title: "Engineer",
                country: "India",
                salary: 50000,
            },
        ],
        total: 20,
    },
};

const mockEmployeesPage2 = {
    data: {
        data: [
            {
                id: 2,
                first_name: "John",
                last_name: "Doe",
                job_title: "Engineer",
                country: "India",
                salary: 60000,
            },
        ],
        total: 20,
    },
};

describe("EmployeeList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders heading", async () => {
        API.get.mockResolvedValueOnce(mockEmployeesPage1);

        renderComponent();

        expect(screen.getByText(/Employee List/i)).toBeInTheDocument();
    });

    it("shows loading state", async () => {
        API.get.mockResolvedValueOnce(mockEmployeesPage1);

        renderComponent();

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        });
    });

    it("fetches and displays employees", async () => {
        API.get.mockResolvedValueOnce(mockEmployeesPage1);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Abhi Kumar/i)).toBeInTheDocument();
        });
    });

    it("shows empty message when no employees", async () => {
        API.get.mockResolvedValueOnce({
            data: { data: [], total: 0 },
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/No employees found/i)).toBeInTheDocument();
        });
    });

    it("goes to next page", async () => {
        // ✅ FIX 2: pagination needs 2 API calls
        API.get
            .mockResolvedValueOnce(mockEmployeesPage1)
            .mockResolvedValueOnce(mockEmployeesPage2);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Abhi Kumar/i)).toBeInTheDocument();
        });

        // click next
        await act(async () => {
            fireEvent.click(screen.getByText(/Next/i));
        });

        await waitFor(() => {
            expect(API.get).toHaveBeenCalledWith("/employees?page=2");
        });
    });

    it("deletes employee", async () => {
        API.get.mockResolvedValueOnce(mockEmployeesPage1);
        API.delete.mockResolvedValueOnce({});

        window.confirm = vi.fn(() => true);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Abhi Kumar/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Delete/i));

        await waitFor(() => {
            expect(API.delete).toHaveBeenCalledWith("/employees/1");
        });
    });

    it("does not delete if user cancels", async () => {
        API.get.mockResolvedValueOnce(mockEmployeesPage1);

        window.confirm = vi.fn(() => false);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Abhi Kumar/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Delete/i));

        expect(API.delete).not.toHaveBeenCalled();
    });

    it("navigates to employee show page", async () => {
        API.get.mockResolvedValueOnce(mockEmployeesPage1);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Abhi Kumar/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/View/i));

        expect(mockNavigate).toHaveBeenCalledWith("/employees/1");
    });

    it("navigates to edit page", async () => {
        API.get.mockResolvedValueOnce(mockEmployeesPage1);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Abhi Kumar/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Edit/i));

        expect(mockNavigate).toHaveBeenCalledWith("/employees/1/edit");
    });

    it("disables prev button on first page", async () => {
        API.get.mockResolvedValueOnce(mockEmployeesPage1);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Abhi Kumar/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/Prev/i)).toBeDisabled();
    });
});