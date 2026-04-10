class Api::V1::EmployeesController < ApplicationController
  before_action :set_employee, only: [ :show, :update, :destroy ]

  PER_PAGE = 10

  # GET /employees
  def index
    page = params[:page].to_i
    page = 1 if page <= 0

    employees = Employee
                  .order(created_at: :desc)
                  .offset((page - 1) * PER_PAGE)
                  .limit(PER_PAGE)

    render json: {
      data: employees,
      total: Employee.count,
      page: page,
      per_page: PER_PAGE
    }, status: :ok
  end

  # POST /employees
  def create
    employee = Employee.new(employee_params)

    if employee.save
      render json: employee, status: :created
    else
      render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /employees/:id
  def show
    return unless @employee

    render json: @employee, status: :ok
  end

  # PATCH /employees/:id
  def update
    return unless @employee

    if @employee.update(employee_params)
      render json: @employee, status: :ok
    else
      render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /employees/:id
  def destroy
    return unless @employee

    @employee.destroy
    head :no_content
  end

  # GET /employees/insights
  def insights
    return render json: { error: "country is required" }, status: :bad_request unless params[:country].present?

    employees = Employee.where(country: params[:country])

    render json: {
      min_salary: employees.minimum(:salary),
      max_salary: employees.maximum(:salary),
      avg_salary: employees.average(:salary),
      avg_by_job: params[:job_title].present? ? employees.where(job_title: params[:job_title]).average(:salary) : nil
    }, status: :ok
  end

  private

  def set_employee
    @employee = Employee.find_by(id: params[:id])
    render json: { error: "Employee not found" }, status: :not_found unless @employee
  end

  def employee_params
    params.require(:employee).permit(
      :first_name,
      :last_name,
      :job_title,
      :country,
      :salary,
      :email
    )
  end
end
