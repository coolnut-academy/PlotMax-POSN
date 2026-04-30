<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success.svg?style=for-the-badge&color=06b6d4" alt="Status">
  <img src="https://img.shields.io/badge/Platform-Web-blue.svg?style=for-the-badge&color=3b82f6" alt="Platform">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge&color=a855f7" alt="License">
</div>

# 🌌 POSN Precision Plotter

**Advanced Linear Regression & Error Analysis Platform**  
Designed specifically for high-accuracy physics experiments and Physics Olympiad (POSN) laboratories.

---

## ⚡ Core Features

- **Standard OLS & POSN Max/Min Slopes:** Automatically calculates the Best Fit, Max Slope, and Min Slope lines passing through the centroid.
- **Dynamic Error Bars:** Supports independent error configurations ($\Delta X$, $\Delta Y$) for each data point.
- **Real-Time Data Engine:** Graph recalculates and redraws instantly as you type.
- **Data Sorting Engine:** Sort rows automatically by $X$ ascending or descending to maintain matrix structure without messing up the geometry.
- **Advanced Annotation Tools:**
  - Inject custom text onto the canvas dynamically.
  - Draw bounding boxes or lines for visualizing uncertainty rectangles.
  - Delete tools via the built-in Plotly modebar.
- **Responsive & Adaptive:** Fully responsive glassmorphism UI with one-click **Dark / Light Mode** switching.
- **I/O Operations:** Import and Export capabilities via standard `.csv` files.

---

## 🚀 Usage Guide

### 1. Data Configuration & Input
- Enter your $X$ and $Y$ values in the Data Points table. 
- You can add specific uncertainties ($\Delta X$, $\Delta Y$) for each individual point. 
- If your data is out of order, use the **`Sort X ↑`** or **`Sort X ↓`** buttons to sort the entire table dynamically.
- Modify the axis labels and units; the system will automatically format the final units for the Slope and Y-Intercept.

### 2. Toggling Modes
- **Force Intercept = 0:** Forces the regression line to pass through the origin $(0,0)$.
- **Graph Scale Mode:** Choose between 4 viewport modes:
  - *Original (Start from 0):* Locks the axes to $(0,0)$ to visualize intercepts clearly.
  - *Fit Both Axes:* Auto-scales X and Y to fit the data points precisely.
  - *Fit X / Fit Y:* Auto-scales one axis while locking the other to $0$.

### 3. Annotations & Drawing (Graph Tools)
- **Adding Text:** 
  1. Pick a color from the **Color Picker**.
  2. Click **`+ Add Text`**. 
  3. A new text element will appear on the graph. You can **drag** it anywhere and **click the text** to edit the string.
- **Drawing Shapes:** Hover over the graph to reveal the top-right toolbar. Select the **Rectangle / Line** tool to draw bounding boxes for Max/Min slopes.
- **Erasing:** Select the **Eraser** tool in the graph toolbar and click on any shape to remove it. (For text, use the **Clear Texts** button).

### 4. Import / Export (CSV)
- **Export:** Click `Export CSV` to save your table locally.
- **Import:** Click `Import CSV` and select a correctly formatted file (Columns: `X, dX, Y, dY`). The graph will update immediately.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3 (Vanilla, Glassmorphism Aesthetics)
- **Logic / Math:** JavaScript (ES6+)
- **Visualization:** [Plotly.js](https://plotly.com/javascript/)
- **Typography / Equations:** [MathJax](https://www.mathjax.org/) (LaTeX rendering)

---

<div align="center">
  <sub><b>Crafted with Precision by <a href="https://github.com/coolnut-academy">Mr. Satit Siriwach</a></b></sub><br>
  <sub><i>"Building the tools that power the next generation of physicists."</i></sub>
</div>
