let state = {
    data: [
        { id: 1, x: 1.0, dx: 0.1, y: 2.1, dy: 0.2 },
        { id: 2, x: 2.0, dx: 0.1, y: 3.9, dy: 0.2 },
        { id: 3, x: 3.0, dx: 0.1, y: 6.2, dy: 0.2 },
        { id: 4, x: 4.0, dx: 0.1, y: 8.1, dy: 0.2 },
        { id: 5, x: 5.0, dx: 0.1, y: 10.3, dy: 0.2 }
    ],
    nextId: 6,
    config: {
        xLabel: "Time (t)",
        xUnit: "s",
        yLabel: "Position (x)",
        yUnit: "m",
        zoomMode: "zero-both",
        showXError: true,
        showYError: true,
        forceZero: false,
        showBest: true,
        showMax: true,
        showMin: true,
        showCentroid: true
    }
};

// --- DOM Elements ---
const tableBody = document.getElementById('table-body');
const addRowBtn = document.getElementById('add-row');
const xLabelInput = document.getElementById('x-label');
const xUnitInput = document.getElementById('x-unit');
const yLabelInput = document.getElementById('y-label');
const yUnitInput = document.getElementById('y-unit');
const zoomModeSelect = document.getElementById('zoom-mode');
const showXErrorToggle = document.getElementById('show-x-error');
const showYErrorToggle = document.getElementById('show-y-error');
const forceZeroToggle = document.getElementById('force-zero');

const toggleBest = document.getElementById('toggle-best');
const toggleMax = document.getElementById('toggle-max');
const toggleMin = document.getElementById('toggle-min');
const toggleCentroid = document.getElementById('toggle-centroid');

const burgerMenu = document.getElementById('burger-menu');
const dataPanel = document.querySelector('.data-panel');
const mobileOverlay = document.getElementById('mobile-overlay');
const themeToggle = document.getElementById('theme-toggle');

// --- Initialization ---
function init() {
    renderTable();
    updateAnalysis();
    setupEventListeners();
}

function setupEventListeners() {
    addRowBtn.addEventListener('click', () => {
        state.data.push({ id: state.nextId++, x: 0, dx: 0.1, y: 0, dy: 0.1 });
        renderTable();
        updateAnalysis();
    });

    xLabelInput.addEventListener('input', (e) => { state.config.xLabel = e.target.value; updatePlot(); });
    xUnitInput.addEventListener('input', (e) => { state.config.xUnit = e.target.value; updatePlot(); updateDOMResults(); });
    yLabelInput.addEventListener('input', (e) => { state.config.yLabel = e.target.value; updatePlot(); });
    yUnitInput.addEventListener('input', (e) => { state.config.yUnit = e.target.value; updatePlot(); updateDOMResults(); });

    zoomModeSelect.addEventListener('change', (e) => { state.config.zoomMode = e.target.value; updatePlot(); });

    showXErrorToggle.addEventListener('change', (e) => {
        state.config.showXError = e.target.checked;
        document.querySelectorAll('.col-err-x').forEach(el => el.classList.toggle('hidden-col', !e.target.checked));
        updateAnalysis();
    });

    showYErrorToggle.addEventListener('change', (e) => {
        state.config.showYError = e.target.checked;
        document.querySelectorAll('.col-err-y').forEach(el => el.classList.toggle('hidden-col', !e.target.checked));
        updateAnalysis();
    });

    forceZeroToggle.addEventListener('change', (e) => { state.config.forceZero = e.target.checked; updateAnalysis(); });

    toggleBest.addEventListener('change', (e) => { state.config.showBest = e.target.checked; updatePlot(); });
    toggleMax.addEventListener('change', (e) => { state.config.showMax = e.target.checked; updatePlot(); });
    toggleMin.addEventListener('change', (e) => { state.config.showMin = e.target.checked; updatePlot(); });
    toggleCentroid.addEventListener('change', (e) => { state.config.showCentroid = e.target.checked; updatePlot(); });

    // Handle table inputs
    tableBody.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            const id = parseInt(e.target.dataset.id);
            const field = e.target.dataset.field;
            const value = parseFloat(e.target.value);
            
            const row = state.data.find(r => r.id === id);
            if (row) {
                row[field] = isNaN(value) ? 0 : value;
                updateAnalysis();
            }
        }
    });

    // Handle row deletion
    tableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-btn');
        if (btn) {
            const id = parseInt(btn.dataset.id);
            state.data = state.data.filter(r => r.id !== id);
            renderTable();
            updateAnalysis();
        }
    });

    // Mobile menu toggle
    burgerMenu.addEventListener('click', () => {
        dataPanel.classList.add('active');
        mobileOverlay.classList.add('active');
    });

    mobileOverlay.addEventListener('click', () => {
        dataPanel.classList.remove('active');
        mobileOverlay.classList.remove('active');
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        updatePlot();
    });
}

// --- Render Table ---
function renderTable() {
    tableBody.innerHTML = state.data.map((row, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><input type="number" step="any" data-id="${row.id}" data-field="x" value="${row.x}"></td>
            <td class="col-err-x ${!state.config.showXError ? 'hidden-col' : ''}">
                <input type="number" step="any" min="0" data-id="${row.id}" data-field="dx" value="${row.dx}">
            </td>
            <td><input type="number" step="any" data-id="${row.id}" data-field="y" value="${row.y}"></td>
            <td class="col-err-y ${!state.config.showYError ? 'hidden-col' : ''}">
                <input type="number" step="any" min="0" data-id="${row.id}" data-field="dy" value="${row.dy}">
            </td>
            <td>
                <button class="btn danger delete-btn" data-id="${row.id}" title="Delete Row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// --- Physics Calculations ---
let currentResults = {};

function updateAnalysis() {
    // 1. Filter valid data
    const pts = state.data.filter(p => !isNaN(p.x) && !isNaN(p.y));
    if (pts.length < 2) return; // Need at least 2 points

    // Sort by X
    pts.sort((a, b) => a.x - b.x);

    const N = pts.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    pts.forEach(p => {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumX2 += p.x * p.x;
        sumY2 += p.y * p.y;
    });

    const xBar = sumX / N;
    const yBar = sumY / N;

    // Best fit (OLS)
    let mBest, cBest;
    if (state.config.forceZero) {
        mBest = sumXY / sumX2;
        cBest = 0;
    } else {
        const denominator = N * sumX2 - sumX * sumX;
        mBest = (N * sumXY - sumX * sumY) / denominator;
        cBest = (sumY - mBest * sumX) / N;
    }

    // R-squared
    let ssTot = 0, ssRes = 0;
    pts.forEach(p => {
        const yPred = mBest * p.x + cBest;
        ssTot += (p.y - yBar) ** 2;
        ssRes += (p.y - yPred) ** 2;
    });
    const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);

    // Standard Error of slope (simplification for general physics labs)
    const dm_stats = Math.abs(mBest) * Math.sqrt((1/r2 - 1)/(N-2));
    const dc_stats = dm_stats * Math.sqrt(sumX2 / N); // Approximate

    // POSN Max/Min Slope Method (using extreme points and error bars)
    // First point
    const p1 = pts[0];
    const eX1 = state.config.showXError ? p1.dx : 0;
    const eY1 = state.config.showYError ? p1.dy : 0;
    
    // Last point
    const pn = pts[N - 1];
    const eXn = state.config.showXError ? pn.dx : 0;
    const eYn = state.config.showYError ? pn.dy : 0;

    let mMax, mMin;

    if (mBest >= 0) {
        mMax = ((pn.y + eYn) - (p1.y - eY1)) / ((pn.x - eXn) - (p1.x + eX1));
        mMin = ((pn.y - eYn) - (p1.y + eY1)) / ((pn.x + eXn) - (p1.x - eX1));
    } else {
        mMax = ((pn.y + eYn) - (p1.y - eY1)) / ((pn.x + eXn) - (p1.x - eX1)); // Steepest negative
        mMin = ((pn.y - eYn) - (p1.y + eY1)) / ((pn.x - eXn) - (p1.x + eX1)); // Least steep negative
    }

    // Handle divide by zero edge cases
    if (!isFinite(mMax)) mMax = mBest;
    if (!isFinite(mMin)) mMin = mBest;

    // Force Max/Min lines to pass through centroid
    let cMax = state.config.forceZero ? 0 : yBar - mMax * xBar;
    let cMin = state.config.forceZero ? 0 : yBar - mMin * xBar;

    // POSN Uncertainty based on Max/Min lines
    const dm = Math.abs(mMax - mMin) / 2;
    const dc = Math.abs(cMax - cMin) / 2;

    currentResults = {
        mBest, cBest, r2,
        mMax, cMax,
        mMin, cMin,
        xBar, yBar,
        dm, dc,
        dm_stats, dc_stats,
        pts
    };

    updateDOMResults();
    updatePlot();
}

function formatNum(num) {
    if (isNaN(num)) return "0.000";
    return num.toFixed(3);
}

function formatEq(m, c) {
    const sign = c < 0 ? "-" : "+";
    const cStr = state.config.forceZero ? "" : ` ${sign} ${Math.abs(c).toFixed(3)}`;
    return `\\( y = ${m.toFixed(3)}x${cStr} \\)`;
}

function updateDOMResults() {
    const r = currentResults;
    if (!r.mBest) return;

    document.getElementById('val-m-best').innerText = formatNum(r.mBest);
    document.getElementById('val-c-best').innerText = formatNum(r.cBest);
    document.getElementById('val-r2').innerText = formatNum(r.r2);
    document.getElementById('eq-best').innerText = formatEq(r.mBest, r.cBest);

    document.getElementById('val-m-max').innerText = formatNum(r.mMax);
    document.getElementById('val-c-max').innerText = formatNum(r.cMax);
    document.getElementById('eq-max').innerText = formatEq(r.mMax, r.cMax);

    document.getElementById('val-m-min').innerText = formatNum(r.mMin);
    document.getElementById('val-c-min').innerText = formatNum(r.cMin);
    document.getElementById('eq-min').innerText = formatEq(r.mMin, r.cMin);

    document.getElementById('val-dm').innerText = "±" + formatNum(r.dm_stats);
    document.getElementById('val-dc').innerText = "±" + formatNum(r.dc_stats);
    document.getElementById('val-centroid').innerText = `(${formatNum(r.xBar)}, ${formatNum(r.yBar)})`;

    // Final Experimental Summary
    document.getElementById('final-slope').innerText = `${formatNum(r.mBest)} ± ${formatNum(r.dm)}`;
    document.getElementById('final-intercept').innerText = `${formatNum(r.cBest)} ± ${formatNum(r.dc)}`;

    // Units
    const xUnit = state.config.xUnit.trim();
    const yUnit = state.config.yUnit.trim();
    let slopeUnit = "";
    if (yUnit && xUnit) slopeUnit = `${yUnit} / ${xUnit}`;
    else if (yUnit) slopeUnit = yUnit;
    else if (xUnit) slopeUnit = `1 / ${xUnit}`;

    document.getElementById('unit-slope').innerText = slopeUnit;
    document.getElementById('unit-intercept').innerText = yUnit;

    // Re-render MathJax
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

// --- Plotting ---
function updatePlot() {
    if (!currentResults.pts) return;
    const r = currentResults;
    const pts = r.pts;

    const xData = pts.map(p => p.x);
    const yData = pts.map(p => p.y);
    const xErr = state.config.showXError ? pts.map(p => p.dx) : null;
    const yErr = state.config.showYError ? pts.map(p => p.dy) : null;

    const minX = Math.min(...xData) - (xErr ? Math.max(...xErr) : 0) - 1;
    const maxX = Math.max(...xData) + (xErr ? Math.max(...xErr) : 0) + 1;
    
    let lineStartX = minX;
    if (state.config.zoomMode === 'zero-both' || state.config.zoomMode === 'fit-y') {
        // X axis starts at 0, so line should extend to 0 to show Y-intercept
        if (lineStartX > 0) lineStartX = 0;
    }

    const xLine = [lineStartX, maxX];

    const isLight = document.body.classList.contains('light-theme');
    const textColor = isLight ? '#0f172a' : '#f0f4f8';
    const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

    const traces = [];

    // 1. Data Points with Error Bars
    traces.push({
        x: xData,
        y: yData,
        error_x: xErr ? { type: 'data', array: xErr, visible: true, color: textColor } : { visible: false },
        error_y: yErr ? { type: 'data', array: yErr, visible: true, color: textColor } : { visible: false },
        mode: 'markers',
        type: 'scatter',
        name: 'Data Points',
        marker: { size: 8, color: textColor }
    });

    // 2. Best Fit Line
    if (state.config.showBest) {
        traces.push({
            x: xLine,
            y: xLine.map(x => r.mBest * x + r.cBest),
            mode: 'lines',
            type: 'scatter',
            name: 'Best Fit',
            line: { color: '#06b6d4', width: 2 } // Cyan
        });
    }

    // 3. Max Slope Line
    if (state.config.showMax) {
        traces.push({
            x: xLine,
            y: xLine.map(x => r.mMax * x + r.cMax),
            mode: 'lines',
            type: 'scatter',
            name: 'Max Slope',
            line: { color: '#ec4899', width: 2, dash: 'dash' } // Pink
        });
    }

    // 4. Min Slope Line
    if (state.config.showMin) {
        traces.push({
            x: xLine,
            y: xLine.map(x => r.mMin * x + r.cMin),
            mode: 'lines',
            type: 'scatter',
            name: 'Min Slope',
            line: { color: '#eab308', width: 2, dash: 'dash' } // Yellow
        });
    }

    // 5. Centroid Point
    if (state.config.showCentroid && !state.config.forceZero) {
        traces.push({
            x: [r.xBar],
            y: [r.yBar],
            mode: 'markers',
            type: 'scatter',
            name: 'Centroid',
            marker: { size: 10, color: '#a855f7', symbol: 'cross' } // Purple
        });
    }

    let xRangeMode = 'tozero';
    let yRangeMode = 'tozero';

    if (state.config.zoomMode === 'fit-both') {
        xRangeMode = 'normal';
        yRangeMode = 'normal';
    } else if (state.config.zoomMode === 'fit-x') {
        xRangeMode = 'normal';
        yRangeMode = 'tozero';
    } else if (state.config.zoomMode === 'fit-y') {
        xRangeMode = 'tozero';
        yRangeMode = 'normal';
    }

    const layout = {
        title: { text: 'Linear Analysis', font: { color: textColor } },
        xaxis: { 
            title: `${state.config.xLabel} ${state.config.xUnit ? `(${state.config.xUnit})` : ''}`.trim(), 
            color: '#9ba3b5', 
            gridcolor: gridColor,
            rangemode: xRangeMode
        },
        yaxis: { 
            title: `${state.config.yLabel} ${state.config.yUnit ? `(${state.config.yUnit})` : ''}`.trim(), 
            color: '#9ba3b5', 
            gridcolor: gridColor,
            rangemode: yRangeMode
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Inter, sans-serif' },
        margin: { t: 40, r: 20, b: 40, l: 50 },
        legend: { font: { color: textColor }, bgcolor: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
    };

    const config = { responsive: true, displayModeBar: true };

    Plotly.newPlot('plot', traces, layout, config);
}

// CSV Export/Import functionality
const importBtn = document.getElementById('import-csv');
const fileInput = document.getElementById('csv-file-input');

importBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        
        if (lines.length > 1) {
            const newData = [];
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',').map(c => parseFloat(c.trim()));
                if (cols.length >= 4) {
                    newData.push({
                        id: state.nextId++,
                        x: isNaN(cols[0]) ? 0 : cols[0],
                        dx: isNaN(cols[1]) ? 0 : cols[1],
                        y: isNaN(cols[2]) ? 0 : cols[2],
                        dy: isNaN(cols[3]) ? 0 : cols[3]
                    });
                }
            }
            if (newData.length > 0) {
                state.data = newData;
                renderTable();
                updateAnalysis();
            } else {
                alert("No valid data found in CSV. Expected format: X, dX, Y, dY");
            }
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset
});

document.getElementById('export-csv').addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "X,dX,Y,dY\n";
    state.data.forEach(row => {
        csvContent += `${row.x},${row.dx},${row.y},${row.dy}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "posn_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Start the application
init();
