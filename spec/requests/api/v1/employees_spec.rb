require 'rails_helper'

RSpec.describe "Api::V1::Employees", type: :request do
  let!(:employees) { create_list(:employee, 15) }
  let(:employee_id) { employees.first.id }

  let(:valid_params) do
    {
      employee: {
        first_name: "Diksha",
        last_name: "Kumawat",
        job_title: "Engineer",
        country: "India",
        salary: 50000,
        email: "diksha@test.com"
      }
    }
  end

  describe "GET /employees" do
    it "returns paginated employees" do
      get "/api/v1/employees", params: { page: 1 }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json["data"].length).to eq(10)
      expect(json["total"]).to eq(15)
    end
  end

  describe "POST /employees" do
    it "creates employee with valid params" do
      expect {
        post "/api/v1/employees", params: valid_params
      }.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "returns error for invalid params" do
      post "/api/v1/employees", params: { employee: { first_name: "" } }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "GET /employees/:id" do
    it "returns employee if exists" do
      get "/api/v1/employees/#{employee_id}"

      expect(response).to have_http_status(:ok)
    end

    it "returns 404 if not found" do
      get "/api/v1/employees/999999"

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PATCH /employees/:id" do
    it "updates employee with valid params" do
      patch "/api/v1/employees/#{employee_id}",
            params: { employee: { salary: 90000 } }

      expect(response).to have_http_status(:ok)
      expect(Employee.find(employee_id).salary).to eq(90000)
    end

    it "returns error for invalid update" do
      patch "/api/v1/employees/#{employee_id}",
            params: { employee: { salary: -1 } }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "DELETE /employees/:id" do
    it "deletes employee" do
      expect {
        delete "/api/v1/employees/#{employee_id}"
      }.to change(Employee, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end

  describe "GET /employees/insights" do
    it "returns insights for country" do
      get "/api/v1/employees/insights", params: { country: "India" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json).to have_key("min_salary")
      expect(json).to have_key("max_salary")
    end

    it "returns error if country missing" do
      get "/api/v1/employees/insights"

      expect(response).to have_http_status(:bad_request)
    end
  end
end