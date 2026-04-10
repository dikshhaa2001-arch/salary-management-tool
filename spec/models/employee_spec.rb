require 'rails_helper'

RSpec.describe Employee, type: :model do
  it "is valid with valid attributes" do
    employee = build(:employee)
    expect(employee).to be_valid
  end

  it "is invalid without email" do
    employee = build(:employee, email: nil)
    expect(employee).not_to be_valid
  end

  it "is invalid with wrong email format" do
    employee = build(:employee, email: "invalid_email")
    expect(employee).not_to be_valid
  end

  it "is invalid with duplicate email" do
    create(:employee, email: "test@mail.com")
    employee = build(:employee, email: "test@mail.com")

    expect(employee).not_to be_valid
  end
end