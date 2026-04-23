require "base64"
require "net/http"
require "uri"
require "json"

class DrinkRecordsController < ApplicationController
  before_action :set_drink_record, only: %i[ show edit update destroy ]

  def index
    @drink_records = DrinkRecord.order(created_at: :desc)
  end

  def show
  end

  def new
    @drink_record = DrinkRecord.new
  end

  def create
    @drink_record = DrinkRecord.new(drink_record_params)

    if @drink_record.save
      redirect_to @drink_record, notice: "記録を保存しました。"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @drink_record.update(drink_record_params)
      redirect_to @drink_record, notice: "記録を更新しました。"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @drink_record.destroy
    redirect_to drink_records_url, notice: "記録を削除しました。"
  end

  # Sidecar APIに画像を投げて解析するアクション
  def analyze
    image = params[:image]
    if image.blank?
      render json: { error: "画像がありません" }, status: :unprocessable_entity
      return
    end

    # base64エンコード
    base64_image = Base64.strict_encode64(image.read)

    begin
      uri = URI.parse("http://localhost:5000/api/analyze")
      http = Net::HTTP.new(uri.host, uri.port)

      request = Net::HTTP::Post.new(uri.request_uri, { 'Content-Type' => 'application/json' })
      # Python側がダミーモードかどうかを判断できるようにする（本番なら不要）
      request.body = {
        image_base64: base64_image,
        dummy_mode: !Rails.env.production?
      }.to_json

      response = http.request(request)

      if response.is_a?(Net::HTTPSuccess)
        result = JSON.parse(response.body)
        render json: result
      else
        render json: { error: "AI解析に失敗しました。 (#{response.code})" }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "Sidecar error: #{e.message}"
      # 開発環境などでPythonサーバーが立ち上がっていない場合のフォールバック（ダミーデータ）
      render json: {
        name: "ダミー銘柄 (接続エラー)",
        sweetness: 3.0,
        acidity: 2.5,
        body: 4.0,
        aroma: 3.5,
        bitterness: 2.0,
        error: e.message
      }
    end
  end

  private

  def set_drink_record
    @drink_record = DrinkRecord.find(params[:id])
  end

  def drink_record_params
    params.require(:drink_record).permit(
      :title, :comment, :image,
      :ai_sweetness, :ai_acidity, :ai_body, :ai_aroma, :ai_bitterness,
      :user_sweetness, :user_acidity, :user_body, :user_aroma, :user_bitterness
    )
  end
end
