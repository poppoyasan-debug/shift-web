const app = document.getElementById("app");

app.innerHTML = `
  <h2>勤務表（Web）</h2>
  <div id="list"></div>
`;

const list = document.getElementById("list");

for (let day = 1; day <= 31; day++) {
  const row = document.createElement("div");
  row.style.marginBottom = "12px";

  const label = document.createElement("span");
  label.textContent = `1/${day} 未入力 `;
  label.style.marginRight = "8px";

  const btn = document.createElement("button");
  btn.textContent = "＋";

  // ★ ここが確認ポイント
  btn.onclick = () => {
    alert(`1/${day} を入力`);
  };

  row.appendChild(label);
  row.appendChild(btn);
  list.appendChild(row);
}
