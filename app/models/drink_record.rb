class DrinkRecord < ApplicationRecord
  has_one_attached :image

  validates :title, presence: true

  # Ensure values are between 1.0 and 5.0 when present
  validates :ai_sweetness, :ai_acidity, :ai_body, :ai_aroma, :ai_bitterness,
            numericality: { greater_than_or_equal_to: 1.0, less_than_or_equal_to: 5.0 }, allow_nil: true
  validates :user_sweetness, :user_acidity, :user_body, :user_aroma, :user_bitterness,
            numericality: { greater_than_or_equal_to: 1.0, less_than_or_equal_to: 5.0 }, allow_nil: true
end
