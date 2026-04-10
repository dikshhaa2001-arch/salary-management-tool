FactoryBot.define do
  factory :employee do
    first_name { "Test" }
    last_name  { "User" }
    job_title  { "Engineer" }
    country    { "India" }
    salary     { 50000 }
    sequence(:email) { |n| "user#{n}@test.com" }
  end
end