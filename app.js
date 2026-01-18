// ===============================
// 勤務表 Web 完成版 app.js
// ===============================

const state = {
  selectedGroup: "A1",
  selectedDateIndex: null,
  schedules: {}
};

// 勤務定義
const definitions = {
  A1: ["C101","C102","C103","C104","C105","C106","C107"],
  A2: ["C111","C112","C113","C114","C115","C116","C117"],
  B1: ["C221","C222","C223","C224","C225","C226","C227","C228"],
  B2: ["C231","C232","C233","C234","C235","C236","C237"],
  B3: ["C241","C242","C243","C244","C245","C246","C247"],
};

const OTHER_CODES = ["公休","年休","特休","非番","臨時"];

// ---------- 初期描画 ----------
document.addEventListener("DOMContentLoaded", () => {
  restore();
  renderGroups();
  renderDays();
  renderPicker();
});

// ---------- グループ ----------
function renderGroups() {
  const area = document.getElementById("groups");
  area.innerHTML = "";
  Object.keys(definitions).forEach(g => {
    const btn = document.createElement("button");
    btn.textContent = g;
    btn.className = g === state.selectedGroup ? "active" : "";
    btn.onclick = () => {
      state.selectedGroup = g;
      save();
      renderGroups();
      renderPicker();
    };
    area.appendChild(btn);
  });
}

// ---------- 日付 ----------
function renderDays() {
  const list = document.getElementById("days");
  list.innerHTML = "";
  for (let d = 1; d <= 31; d++) {
    const row = document.createElement("div");
    row.className = "day-row";

    const label = document.createElement("span");
    label.textContent = `1/${d} ${state.schedules[d] || "未入力"}`;

    const btn = document.createElement("button");
    btn.textContent = "+";
    btn.onclick = () => {
      state.selectedDateIndex = d;
      renderPicker();
    };

    row.appendChild(label);
    row.appendChild(btn);
    list.appendChild(row);
  }
}

// ---------- ピッカー ----------
function renderPicker() {
  const picker = document.getElementById("picker");
  picker.innerHTML = "";

  if (state.selectedDateIndex === null) return;

  const codes = [
    ...definitions[state.selectedGroup],
    ...OTHER_CODES
  ];

  codes.forEach(code => {
    const btn = document.createElement("button");
    btn.textContent = code;
    btn.onclick = () => {
      state.schedules[state.selectedDateIndex] = code;
      state.selectedDateIndex = null;
      save();
      renderDays();
      renderPicker();
    };
    picker.appendChild(btn);
  });

  const close = document.createElement("button");
  close.textContent = "閉じる";
  close.onclick = () => {
    state.selectedDateIndex = null;
    renderPicker();
  };
  picker.appendChild(close);
}

// ---------- 保存 ----------
function save() {
  localStorage.setItem("shiftState", JSON.stringify(state));
}

function restore() {
  const saved = localStorage.getItem("shiftState");
  if (saved) {
    Object.assign(state, JSON.parse(saved));
  }
}
