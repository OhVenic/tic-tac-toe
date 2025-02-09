let fields = [null, null, null, null, null, null, null, null, null];  // Anfangszustand des Spiels
let currentPlayer = "circle";  // Startspieler (circle)
let gameOver = false;  // Flag, um zu prüfen, ob das Spiel vorbei ist
let winningCombination = [];  // Array für die Indizes der Gewinnerfelder

function init() {
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
                symbol = generateCircleSVG();
            } else if (fields[index] === "cross") {
                symbol = generateCrossSVG();
            }
            html += `<td class="cell" onclick="handleCellClick(${index}, this)">${symbol}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("content").innerHTML = html;

    // Wenn das Spiel vorbei ist, füge eine Linie mit kleiner Verzögerung hinzu
    if (gameOver) {
        setTimeout(drawWinningLine, 50);  // Kleine Verzögerung, um das Layout zu stabilisieren
    }
}

// Funktion für den Klick auf ein <td>-Element
function handleCellClick(index, cell) {
  if (fields[index] !== null || gameOver) {
      return; // Wenn das Feld bereits belegt ist oder das Spiel vorbei ist, wird nichts getan
  }

  fields[index] = currentPlayer;  // Das Symbol (circle oder cross) im Array speichern

  // HTML-Code für das Symbol in das <td> einfügen
  if (currentPlayer === "circle") {
      cell.innerHTML = generateCircleSVG();
  } else {
      cell.innerHTML = generateCrossSVG();
  }

  // Wechseln zum nächsten Spieler
  currentPlayer = (currentPlayer === "circle") ? "cross" : "circle";

  // Überprüfe, ob das Spiel zu Ende ist
  if (checkWinner()) {
      gameOver = true;
      drawWinningLine();  // Zeichne die Linie (wir verwenden jetzt eine einfache Linie)
  }

  // Entferne das onclick-Attribut, um zu verhindern, dass der Spieler auf das gleiche Feld klickt
  cell.removeAttribute("onclick");
}
// Überprüft, ob ein Spieler gewonnen hat
let winningCells = []; // Array für die gewonnenen Felder

function checkWinner() {
    // Gewinnbedingungen
    const winConditions = [
        [0, 1, 2], // Erste Reihe
        [3, 4, 5], // Zweite Reihe
        [6, 7, 8], // Dritte Reihe
        [0, 3, 6], // Erste Spalte
        [1, 4, 7], // Zweite Spalte
        [2, 5, 8], // Dritte Spalte
        [0, 4, 8], // Diagonale
        [2, 4, 6]  // Diagonale
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            winningCells = [a, b, c]; // Speichert die gewonnenen Zellen
            return true;
        }
    }

    return false;
}

function drawWinningLine() {
  if (winningCells.length === 0) return;

  const tdElements = document.querySelectorAll(".board .cell");
  const [first, second, third] = winningCells;

  const firstCell = tdElements[first];
  const secondCell = tdElements[second];
  const thirdCell = tdElements[third];

  const firstRect = firstCell.getBoundingClientRect();
  const secondRect = secondCell.getBoundingClientRect();
  const thirdRect = thirdCell.getBoundingClientRect();

  // Berechne die Position der Linie für die richtige Ausrichtung
  const x1 = firstRect.left + firstRect.width / 2;
  const y1 = firstRect.top + firstRect.height / 2;
  const x2 = thirdRect.left + thirdRect.width / 2;
  const y2 = thirdRect.top + thirdRect.height / 2;

  // Berechne die Länge der Linie und die Drehung
  const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  // Berechne den Mittelpunkt der Linie
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  // Erstelle die Linie
  const line = document.createElement('div');
  line.style.position = 'absolute';
  line.id = "line"
  line.style.top = `${centerY - 2}px`; // Vertikale Ausrichtung der Linie
  line.style.left = `${centerX - lineLength / 2}px`; // Horizontale Ausrichtung der Linie (verschiebt die Linie so, dass sie perfekt zwischen den Zellen liegt)
  line.style.width = `${lineLength}px`;
  line.style.height = '5px'; // Dicke der Linie
  line.style.backgroundColor = 'white'; // Weiße Linie
  line.style.transformOrigin = 'center'; // Die Linie dreht sich um ihren Mittelpunkt
  line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`; // Dreht die Linie entsprechend der Koordinaten der Zellen

  document.body.appendChild(line);  // Füge die Linie dem Dokument hinzu
}
function generateCircleSVG() {
  const svgCode = `
    <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70">
      <!-- Hintergrundkreis (grau) -->
      <circle cx="35" cy="35" r="30" fill="none" stroke="#ccc" stroke-width="5"/>
      
      <!-- Animierter Kreis (Randaufbau von außen nach innen) -->
      <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="5" 
        stroke-dasharray="188.495" stroke-dashoffset="188.495">
        <animate attributeName="stroke-dashoffset" from="188.495" to="0" dur="0.2s" 
          keyTimes="0;1" values="188.495;0" fill="freeze"/>
      </circle>
    </svg>
  `;
  return svgCode;
}

function generateCrossSVG() {
  const svgCode = `
    <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70">
      <!-- Hintergrund (Kreuz) -->
      <line x1="10" y1="10" x2="60" y2="60" stroke="#ccc" stroke-width="5"/>
      <line x1="10" y1="60" x2="60" y2="10" stroke="#ccc" stroke-width="5"/>
      
      <!-- Animiertes Kreuz mit der Farbe FFC000 -->
      <line x1="10" y1="10" x2="60" y2="60" stroke="#FFC000" stroke-width="5">
        <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="0.2s" fill="freeze"/>
        <animate attributeName="stroke" from="transparent" to="#FFC000" dur="0.2s" fill="freeze"/>
      </line>
      <line x1="10" y1="60" x2="60" y2="10" stroke="#FFC000" stroke-width="5">
        <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="0.2s" fill="freeze"/>
        <animate attributeName="stroke" from="transparent" to="#FFC000" dur="0.2s" fill="freeze"/>
      </line>
    </svg>
  `;
  return svgCode;
}

function resetGame() {
  fields = [null, null, null, null, null, null, null, null, null]; 
  gameOver = false
  line = document.getElementById("line")
  line.parentNode.removeChild(line)
  render()
}
