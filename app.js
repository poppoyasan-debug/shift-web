// ===============================
// 勤務表 Web版 STEP3
// 泊まり・非番・自動進行 対応
// ===============================

// ---- 状態（SwiftUI @Published 相当）----
const state = {
  selectedGroup: "A2",
  selectedDateIndex: null,
  schedules: []
};

// ---- グループ定義（SwiftUI definitions）----
const definitions = {
  A1: ["C101", "C102", "C103", "C104", "C105", "C106", "C107"],
  A2: ["C111", "C112", "C113", "C114", "C115", "C116", "C117"],
  B1: ["C221", "C222", "C223", "C224", "C225", "C226", "C227", "C228"],
  B2: ["C231", "C232", "C233", "C234", "C235", "C236", "C237"],
  B3: ["C241", "C242", "C243", "C244", "C245", "C246", "C247"],
  予備: []
};

const groups = ["A1", "A2", "B1", "B2", "B3", "予備"];

// ---- 休日・その他 ----
const HOLIDAY_CODES = ["公休", "特休", "年休", "休日予定"];
const OTHER_CODES = ["非番", "臨時"];

// ===============================
// 初期化
// ===============================
init();

function init() {
  initDays();
  initGroupSelect();
  render();
}

// ===============================
// 日付生成（簡易：31日）
// ===============================
function initDays() {
  state.schedules = [];
  for (let d = 1; d <= 31; d++) {
    state.schedules.push({
      date: `1/${d}`,
      code: "",
    });
  }
}

// ===============================
// グループ選択
// ===============================
function initGroupSelect() {
  const select = document.getElementById("groupSelect");
  select.innerHTML = "";

  groups.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    select.appendChild(opt);
  });

  select.value = state.selectedGroup;
  select.onchange = () => {
    state.selectedGroup = select.value;
  };
}

// ===============================
// 描画
// ===============================
function render() {
  const ul = document.getElementById("dayList");
  ul.innerHTML = "";

  state.schedules.forEach((s, index) => {
    const li = document.createElement("li");
    li.textContent = `${s.date}　${s.code || "（未入力）"}`;
    li.onclick = () => openModal(index);
    ul.appendChild(li);
  });
}

// ===============================
// モーダル表示
// ===============================
function openModal(index) {
  state.selectedDateIndex = index;
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modalTitle").textContent =
    `${state.schedules[index].date} の勤務`;

  const box = document.getElementById("codeButtons");
  box.innerHTML = "";

  const codes =
    state.selectedGroup === "予備"
      ? Object.values(definitions).flat()
      : definitions[state.selectedGroup];

  // 勤務コード
  codes.forEach(code => {
    const btn = document.createElement("button");
    btn.textContent = code;
    btn.onclick = () => updateScheduleAndMove(code);
    box.appendChild(btn);
  });

  // 休日
  HOLIDAY_CODES.forEach(code => {
    const btn = document.createElement("button");
    btn.textContent = code;
    btn.style.background = "#e74c3c";
    btn.onclick = () => updateScheduleAndMove(code);
    box.appendChild(btn);
  });

  // その他
  OTHER_CODES.forEach(code => {
    const btn = document.createElement("button");
    btn.textContent = code;
    btn.style.background = "#2ecc71";
    btn.onclick = () => updateScheduleAndMove(code);
    box.appendChild(btn);
  });
}

// ===============================
// 核心：SwiftUI updateScheduleAndMove()
// ===============================
function updateScheduleAndMove(code) {
  const index = state.selectedDateIndex;
  if (index === null) return;

  // 当日セット
  state.schedules[index].code = code;

  // ---- 泊まり判定（簡易）----
  const isOvernight = isOvernightCode(code);

  // ---- 翌日を非番にする ----
  if (isOvernight && index + 1 < state.schedules.length) {
    state.schedules[index + 1].code = "非番";
  }

  render();

  // ---- 自動で次の日へ ----
  const step = isOvernight ? 2 : 1;
  const nextIndex = index + step;

  if (nextIndex < state.schedules.length) {
    setTimeout(() => {
      openModal(nextIndex);
    }, 150);
  } else {
    closeModal();
  }
}

// ===============================
// 泊まり判定（STEP3簡易版）
// ===============================
function isOvernightCode(code) {
  if (!code.startsWith("C")) return false;
  if (code === "C104" || code === "C112") return false;
  return true;
}

// ===============================
// モーダル閉じる
// ===============================
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  state.selectedDateIndex = null;
}

document.getElementById("closeModal").onclick = closeModal;