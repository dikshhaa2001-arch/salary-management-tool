import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import EmployeeEdit from "./EmployeeEdit";
import API from "../api/api";

/* ================= MOCK API ================= */
vi.mock("../api/api", () => ({
    default: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

/* ================= MOCK ROUTER ================= */
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "1" }),
    };
});

/* ================= MOCK DATA ================= */
const mockEmployee = {
    data: {
        first_name: "Abhi",
        last_name: "Kumar",
        job_title: "Engineer",
        country: "India",
        salary: "50000",
    },
};

/* ================= RENDER HELPER ================= */
const renderComponent = () =>
    render(
        <BrowserRouter>
            <EmployeeEdit />
        </BrowserRouter>
    );

/* ================= TESTS ================= */

describe("EmployeeEdit", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders form", () => {
        API.get.mockResolvedValueOnce(mockEmployee);

        renderComponent();

        expect(screen.getByText(/Edit Employee/i)).toBeInTheDocument();
    });

    it("fetches employee and fills form", async () => {
        API.get.mockResolvedValueOnce(mockEmployee);

        renderComponent();

        await waitFor(() => {
            expect(API.get).toHaveBeenCalledWith("/employees/1");
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue("Abhi")).toBeInTheDocument();
        });
    });

    it("updates input values on change", async () => {
        API.get.mockResolvedValueOnce(mockEmployee);

        renderComponent();

        // wait for form to load
        await waitFor(() => {
            expect(screen.getByDisplayValue("Abhi")).toBeInTheDocument();
        });

        const firstNameInput = screen.getByDisplayValue("Abhi");

        fireEvent.change(firstNameInput, {
            target: { name: "first_name", value: "John" },
        });

        expect(firstNameInput.value).toBe("John");
    });

    it("submits form and navigates", async () => {
        API.get.mockResolvedValueOnce(mockEmployee);
        API.patch.mockResolvedValueOnce({});

        renderComponent();

        await waitFor(() => {
            expect(screen.getByDisplayValue("Abhi")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Update/i));

        await waitFor(() => {
            expect(API.patch).toHaveBeenCalledWith("/employees/1", {
                employee: {
                    first_name: "Abhi",
                    last_name: "Kumar",
                    job_title: "Engineer",
                    country: "India",
                    salary: "50000",
                },
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("handles API error", async () => {
        API.get.mockRejectedValueOnce(new Error("fail"));

        renderComponent();

        await waitFor(() => {
            expect(API.get).toHaveBeenCalledWith("/employees/1");
        });

        expect(screen.getByText(/Edit Employee/i)).toBeInTheDocument();
    });
});