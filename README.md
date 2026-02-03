# Za'atari Refugee Camp Data Visualization

An interactive data visualization project exploring population dynamics and shelter distribution at the Za'atari Refugee Camp in Jordan. Built with D3.js as part of the CS171 data visualization course.

demo: https://supergokou.github.io/Za-atari-Refugee-Camp/
---

## Overview

Za'atari is one of the largest refugee camps in the world, established in 2012 to host Syrian refugees fleeing the civil war. This project visualizes humanitarian data to understand:

- Population trends from January 2013 to November 2015
- Shelter type distribution across the camp
- The evolution of camp infrastructure over time

The visualizations use real population data showing the camp's growth, peak capacity of over 200,000 residents, and subsequent stabilization around 80,000 as conditions improved and some residents relocated.

---

## Project Structure

```
Za-atari-Refugee-Camp/
├── index.html              # Main visualization page
├── README.md               # Project documentation
├── css/
│   └── style.css           # Custom styles for charts
├── js/
│   └── main.js             # D3.js visualization logic
├── data/
│   └── zaatari-refugee-camp-population.csv
├── img/
│   └── example.jpg         # Header background image
├── fonts/
│   └── glyphicons-*        # Bootstrap icon fonts
└── hw/
    ├── implementation/     # Original homework submission
    ├── dear_data/          # Extra credit submission
    └── visual_vocabulary/  # Visual vocabulary exercise
```

---

## Visualizations

### Area Chart: Camp Population Over Time

Displays the number of registered refugees from January 2013 through November 2015.

**Features:**
- Time-series area chart with linear interpolation
- Orange line overlay highlighting the trend
- Interactive tooltips showing exact date and population on hover
- Formatted axis with quarterly tick marks
- D3 margin convention for proper layout

**Key Insights:**
- Peak population of ~203,000 in April 2013
- Gradual decline and stabilization around 79,000-84,000 by late 2014
- Data reflects both new arrivals and departures/relocations

### Bar Chart: Shelter Type Distribution

Shows the breakdown of shelter types used by camp residents.

**Categories:**
| Shelter Type | Percentage |
|-------------|------------|
| Caravans    | 79.68%     |
| Combination | 10.81%     |
| Tents       | 9.51%      |

**Features:**
- Ordinal bar chart with percentage scale
- Hover effect for visual feedback
- Labels positioned above each bar
- Y-axis formatted as percentages

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (recommended) or direct file access

### Running Locally

1. Clone or download this repository
2. Open `index.html` directly in a browser, or
3. Serve via a local server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (with http-server installed)
   npx http-server
   ```
4. Navigate to `http://localhost:8000`

---

## Technical Details

### Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| D3.js | v7 | Data visualization and DOM manipulation |
| Bootstrap | v5.1.1 | Responsive layout and base styling |

Both libraries are loaded via CDN, no local installation required.

### Data Source

The population dataset (`zaatari-refugee-camp-population.csv`) contains 283 records with two columns:
- `date`: Recording date in YYYY-MM-DD format
- `population`: Number of registered refugees

Data sampling is irregular (not daily), reflecting the humanitarian reporting schedule.

### Browser Compatibility

Tested and functional on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES6+ JavaScript support.

---

## Code Architecture

### JavaScript (main.js)

The visualization code follows D3 best practices:

- **Margin Convention**: Consistent padding using `margin` object
- **Scale Functions**: `scaleTime` for dates, `scaleLinear` for numeric values, `scaleBand` for categories
- **Data Binding**: D3 enter pattern for DOM element creation
- **Event Handling**: Mouse events for tooltip interactivity

Key functions:
- `drawAreaChart(data)` - Renders the population time series
- `drawBarChart(data)` - Renders the shelter distribution

### CSS (style.css)

Organized by component with CSS custom properties for consistent theming:

```css
:root {
    --color-primary: #327972;
    --color-accent: #ff4500;
    --color-gray-light: #ccc;
    --color-gray-dark: #333;
}
```

---

## Extra Credit

The `hw/dear_data/` folder contains the Dear Data exercise:
- Personal data collection over 5+ days
- Minimum 3 observations per day
- Each entry includes 5+ attributes (date, time, category, context, etc.)

---

## License

This project was created for educational purposes as part of CS171 coursework.

---

## Acknowledgments

- Course: CS171 - Visualization (Harvard)
- Data: UNHCR and humanitarian organizations operating in Jordan
- Background imagery: Camp photography resources
