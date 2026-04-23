class CreateDrinkRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :drink_records do |t|
      t.string :title
      t.text :comment
      t.float :ai_sweetness
      t.float :ai_acidity
      t.float :ai_body
      t.float :ai_aroma
      t.float :ai_bitterness
      t.float :user_sweetness
      t.float :user_acidity
      t.float :user_body
      t.float :user_aroma
      t.float :user_bitterness

      t.timestamps
    end
  end
end
