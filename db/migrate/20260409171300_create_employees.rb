class CreateEmployees < ActiveRecord::Migration[8.1]
  def change
    create_table :employees do |t|
      t.string  :first_name
      t.string  :last_name
      t.string :job_title
      t.string :country
      t.decimal :salary, precision: 10, scale: 2
      t.string :email
      t.timestamps
    end

    add_index :employees, :country
    add_index :employees, :job_title
    add_index :employees, [:country, :job_title]

  end
end
