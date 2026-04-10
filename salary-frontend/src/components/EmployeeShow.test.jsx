import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import EmployeeShow from "./EmployeeShow";
import API from "../api/api";

vi.mock("../api/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "1" }),
    };
});

const mockEmployee = {
    data: {
        first_name: "Abhi",
        last_name: "Kumar",
        job_title: "Engineer",
        country: "India",
        salary: 50000,
    },
};

const renderComponent = () =>
    render(
        <BrowserRouter>
            <EmployeeShow />
        </BrowserRouter>
    );


describe("EmployeeShow", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading initially", () => {
        API.get.mockResolvedValueOnce(mockEmployee);

        renderComponent();

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it("fetches and displays employee details", async () => {
        API.get.mockResolvedValueOnce(mockEmployee);

        renderComponent();

        await waitFor(() => {
            expect(API.get).toHaveBeenCalledWith("/employees/1");
        });

        await waitFor(() => {
            expect(screen.getByText(/Abhi Kumar/i)).toBeInTheDocument();
            expect(screen.getByText(/Engineer/i)).toBeInTheDocument();
            expect(screen.getByText(/India/i)).toBeInTheDocument();
            expect(screen.getByText(/50000/i)).toBeInTheDocument();
        });
    });

    it("handles API error gracefully", async () => {
        API.get.mockRejectedValueOnce(new Error("fail"));

        renderComponent();

        await waitFor(() => {
            expect(API.get).toHaveBeenCalledWith("/employees/1");
        });

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it("navigates back when Back button clicked", async () => {
        API.get.mockResolvedValueOnce(mockEmployee);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Abhi Kumar/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Back/i));

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});