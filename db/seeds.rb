
first_names = File.readlines("db/seeds/first_names.txt").map(&:strip)
last_names = File.readlines("db/seeds/last_names.txt").map(&:strip)

records = []

10000.times do |i|
  first = first_names.sample
  last = last_names.sample

  records << {
    first_name: first,
    last_name: last,
    job_title: ["Engineer", "Manager", "HR"].sample,
    country: ["India", "USA", "UK"].sample,
    salary: rand(30000..150000),
    email: "#{first.downcase}.#{last.downcase}#{i}@example.com", # ✅ unique
    created_at: Time.current,
    updated_at: Time.current
  }
end

Employee.insert_all(records)