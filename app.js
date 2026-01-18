const state = {
  selectedGroup: "A1",
  selectedDay: null,
  schedules: {}
};

const GROUPS = ["A1", "A2", "B1", "B2", "B3"];

const CODES = {
  A1: ["C101", "C102", "C103"],
  A2: ["C111", "C112"],
  B1: ["C221", "C222"],
  B2: ["C231"],
  B3: ["C241"]
};

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const app = document.getElementById("app");

function render() {
  app.innerHTML = "";

  // ヘッダー
  const header = document.createElement("header");
  header.textContent = "勤務表（Web）";
  app.appendChild(header);

  // グループ
  const groupDiv = document.createElement("div");
  groupDiv.id = "groups";
  GROUPS.forEach(g => {
    const b = document.createElement("button");
    b.textContent = g;
    if (g === state.selectedGroup) b.classList.add("active");
    b.onclick = () => {
      state.selectedGroup = g;
      render();
    };
    groupDiv.appendChild(b);
  });
  app.appendChild(groupDiv);

  // 日付
  const daysDiv = document.createElement("div");
  daysDiv.id = "days";

  DAYS.forEach(d => {
    const row = document.createElement("div");
    row.className = "day-row";

    const label = document.createElement("div");
    label.textContent = `1/${d} ${state.schedules[d] ?? "未入力"}`;

    const btn = document.createElement("button");
    btn.textContent = "+";
    btn.onclick = () => openPicker(d);

    row.appendChild(label);
    row.appendChild(btn);
    daysDiv.appendChild(row);
  });

  app.appendChild(daysDiv);
}

function openPicker(day) {
  state.selectedDay = day;
  closePicker();

  const picker = document.createElement("div");
  picker.id = "picker";

  CODES[state.selectedGroup].forEach(code => {
    const b = document.createElement("button");
    b.textContent = code;
    b.onclick = () => {
      state.schedules[day] = code;   // ← ★確定処理
      state.selectedDay = null;
      closePicker();
      render();                      // ← ★再描画
    };
    picker.appendChild(b);
  });

  const close = document.createElement("button");
  close.textContent = "閉じる";
  close.onclick = closePicker;
  picker.appendChild(close);

  document.body.appendChild(picker);
}

function closePicker() {
  const old = document.getElementById("picker");
  if (old) old.remove();
}

render();
