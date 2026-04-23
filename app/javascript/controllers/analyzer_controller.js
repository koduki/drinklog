import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "input", "preview", "form", "loader", "resultSection",
    "title", "aiSweetness", "aiAcidity", "aiBody", "aiAroma", "aiBitterness"
  ]

  connect() {
    console.log("Analyzer controller connected");
  }

  // ファイルが選択されたらプレビューを表示し、解析APIを叩く
  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewTarget.src = e.target.result;
      this.previewTarget.classList.remove("hidden");
    };
    reader.readAsDataURL(file);

    // 解析開始
    this.analyzeImage(file);
  }

  async analyzeImage(file) {
    this.loaderTarget.classList.remove("hidden");
    this.resultSectionTarget.classList.add("hidden");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

      const response = await fetch("/drink_records/analyze", {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken
        },
        body: formData
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      this.populateForm(data);

      // trigger custom event to update chart
      this.dispatch("analyzed", { detail: data });

    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("AI解析に失敗しました。手動で入力してください。");
    } finally {
      this.loaderTarget.classList.add("hidden");
      this.resultSectionTarget.classList.remove("hidden");
    }
  }

  populateForm(data) {
    if (data.name) this.titleTarget.value = data.name;
    if (data.sweetness) this.aiSweetnessTarget.value = data.sweetness;
    if (data.acidity) this.aiAcidityTarget.value = data.acidity;
    if (data.body) this.aiBodyTarget.value = data.body;
    if (data.aroma) this.aiAromaTarget.value = data.aroma;
    if (data.bitterness) this.aiBitternessTarget.value = data.bitterness;
  }
}
