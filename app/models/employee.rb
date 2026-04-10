class Employee < ApplicationRecord
  before_validation :normalize_email

  validates :first_name, :last_name, :job_title, :country, :salary, :email, presence: true

  validates :email,
            format: { with: URI::MailTo::EMAIL_REGEXP },
            uniqueness: { case_sensitive: false }

  validates :salary, numericality: { greater_than: 0 }

  private


  def normalize_email
    self.email = email.to_s.downcase.strip
  end
end
