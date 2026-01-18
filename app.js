// ================================
// 勤務表 Web（localStorage対応）
// ================================

// 保存キー
const STORAGE_KEY = "shift-web-schedules";

// 状態
let state = {
  selectedGroup: "B1",
  schedules: {}
};

// グループ定義
const groups = ["A1", "A2", "B1", "B2", "B3"];

const definitions = {
  A1: ["C101", "C102", "C103"],
  A2: ["C111", "C112", "C113"],
  B1: ["C221", "C222"],
  B2: ["C231", "C232"],
  B3: ["C241", "C242"]
};

const HOLIDAY_CODES = ["公休", "年休", "特休"];
const OTHER_CODES = ["非番", "臨時"];

// ----------------
// localStorage
// ----------------
function saveSchedules() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.schedules));
}

function loadSchedules() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    state.schedules = JSON.parse(data);
  }
}

// ----------------
// 初期化
// ----------------
document.addEventListener("DOMContentLoaded", () => {
  loadSchedules();
  render();
});

// ----------------
// 描画
// ----------------
function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // グループボタン
  const groupRow = document.createElement("div");
  groupRow.className = "group-row";

  groups.forEach(g => {
    const btn = document.createElement("button");
    btn.textContent = g;
    btn.className = g === state.selectedGroup ? "group active" : "group";
    btn.onclick = () => {
      state.selectedGroup = g;
      render();
    };
    groupRow.appendChild(btn);
  });

  app.appendChild(groupRow);

  // 日付リスト（1〜31）
  for (let day = 1; day <= 31; day++) {
    const row = document.createElement("div");
    row.className = "day-row";

    const label = document.createElement("div");
    label.textContent = `1/${day} ${state.schedules[day] ?? "未入力"}`;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.onclick = () => openPicker(day);

    row.appendChild(label);
    row.appendChild(plus);
    app.appendChild(row);
  }
}

// ----------------
// 選択モーダル
// ----------------
function openPicker(day) {
  const modal = document.createElement("div");
  modal.className = "modal";

  const box = document.createElement("div");
  box.className = "modal-box";

  const title = document.createElement("h3");
  title.textContent = `1/${day}`;
  box.appendChild(title);

  [...definitions[state.selectedGroup], ...HOLIDAY_CODES, ...OTHER_CODES]
    .forEach(code => {
      const btn = document.createElement("button");
      btn.textContent = code;
      btn.onclick = () => {
        state.schedules[day] = code;
        saveSchedules();
        document.body.removeChild(modal);
        render();
      };
      box.appendChild(btn);
    });

  const close = document.createElement("button");
  close.textContent = "閉じる";
  close.onclick = () => document.body.removeChild(modal);

  box.appendChild(close);
  modal.appendChild(box);
  document.body.appendChild(modal);
}
