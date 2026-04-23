import { Controller } from "@hotwired/stimulus"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export default class extends Controller {
  static targets = [
    "canvas",
    "aiSweetness", "aiAcidity", "aiBody", "aiAroma", "aiBitterness",
    "userSweetness", "userAcidity", "userBody", "userAroma", "userBitterness",
    "sweetnessValue", "acidityValue", "bodyValue", "aromaValue", "bitternessValue"
  ]

  connect() {
    this.chart = null;
    this.labels = ['甘味', '酸味', 'コク', '香り', '苦味/渋味'];

    // For show view
    if (this.element.dataset.chartAiData) {
      this.renderShowChart();
    } else {
      // For new/edit view
      this.renderEditChart();
    }
  }

  disconnect() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  // AI解析が完了したときにAnalyzerコントローラから呼ばれる
  update(event) {
    if (!this.chart) return;

    // UIの表示値を更新
    this.updateValueDisplays();

    // チャートを更新
    this.chart.data.datasets[0].data = this.getAiData();
    this.chart.data.datasets[1].data = this.getUserData();
    this.chart.update();
  }

  updateValueDisplays() {
    if (this.hasUserSweetnessTarget && this.hasSweetnessValueTarget) this.sweetnessValueTarget.textContent = this.userSweetnessTarget.value;
    if (this.hasUserAcidityTarget && this.hasAcidityValueTarget) this.acidityValueTarget.textContent = this.userAcidityTarget.value;
    if (this.hasUserBodyTarget && this.hasBodyValueTarget) this.bodyValueTarget.textContent = this.userBodyTarget.value;
    if (this.hasUserAromaTarget && this.hasAromaValueTarget) this.aromaValueTarget.textContent = this.userAromaTarget.value;
    if (this.hasUserBitternessTarget && this.hasBitternessValueTarget) this.bitternessValueTarget.textContent = this.userBitternessTarget.value;
  }

  getAiData() {
    if (!this.hasAiSweetnessTarget) return [3,3,3,3,3];
    return [
      parseFloat(this.aiSweetnessTarget.value) || 0,
      parseFloat(this.aiAcidityTarget.value) || 0,
      parseFloat(this.aiBodyTarget.value) || 0,
      parseFloat(this.aiAromaTarget.value) || 0,
      parseFloat(this.aiBitternessTarget.value) || 0
    ];
  }

  getUserData() {
    if (!this.hasUserSweetnessTarget) return [3,3,3,3,3];
    return [
      parseFloat(this.userSweetnessTarget.value) || 0,
      parseFloat(this.userAcidityTarget.value) || 0,
      parseFloat(this.userBodyTarget.value) || 0,
      parseFloat(this.userAromaTarget.value) || 0,
      parseFloat(this.userBitternessTarget.value) || 0
    ];
  }

  renderEditChart() {
    this.createChart(this.getAiData(), this.getUserData());
  }

  renderShowChart() {
    const aiData = JSON.parse(this.element.dataset.chartAiData);
    const userData = JSON.parse(this.element.dataset.chartUserData);
    this.createChart(aiData, userData);
  }

  createChart(aiData, userData) {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.canvasTarget.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'AIカタログ (標準)',
            data: aiData,
            backgroundColor: 'rgba(156, 163, 175, 0.2)', // Gray
            borderColor: 'rgba(156, 163, 175, 1)',
            pointBackgroundColor: 'rgba(156, 163, 175, 1)',
            borderWidth: 2,
            borderDash: [5, 5]
          },
          {
            label: 'マイデータ (主観)',
            data: userData,
            backgroundColor: 'rgba(79, 70, 229, 0.4)', // Indigo
            borderColor: 'rgba(79, 70, 229, 1)',
            pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { display: true },
            suggestedMin: 0,
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
              display: false // 軸の数値を非表示にしてスッキリさせる
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        }
      }
    });
  }
}
