let fields = [null, null, null, null, null, null, null, null, null];

function init(){
    render();
}

function render() {
  let html = '<table class="board">';
  for (let i = 0; i < 3; i++) {
    html += "<tr>";
    for (let j = 0; j < 3; j++) {
      let index = i * 3 + j;
      let symbol = "";
      if (fields[index] === "circle") {
        symbol = "o";
      } else if (fields[index] === "cross") {
        symbol = "x";
      }
      html += `<td class="cell"> ${symbol}</td>`;
    }
    html += "</tr>";
  }
  html += "</table>";
  document.getElementById("content").innerHTML = html;
}
