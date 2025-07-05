# Arc Tracker

Arc Tracker is a Chrome extension that helps users monitor their daily browser activity. 
It tracks time spent on various websites, provides visualizations, categorizes browsing behavior 
as either productive or entertainment-based, and presents a summary dashboard for self-assessment.

---

## Features

- **Real-Time Clock**: Displays the current time in the header.
- **Domain-Level Tracking**: Logs time spent on each visited domain.
- **Top Sites Summary**: Highlights the top 3 most visited domains.
- **Time Visualization**: Pie chart representation of time distribution.
- **Mood Score & Arc Mapping**: Scores productivity level (0 to 10) and assigns a corresponding personal "arc" based on usage patterns.
- **Category Tagging**: Users can tag domains manually as "productive" or "entertainment".
- **Data Export**: One-click CSV download of usage logs.
- **Storage Management**: Reset button clears all saved data.
- **Persistent Data**: Uses `chrome.storage.local` for browser-based persistence and `localStorage` for user-defined tags.

---
## Arc & Mood Mapping

Each mood score (0–10) is mapped to a specific "arc" that reflects overall productivity for the day:

| Score | Arc Name               | Description                                           |
|-------|------------------------|-------------------------------------------------------|
| 10    | Villain Arc            | Highly productive with zero distraction.             |
| 9     | Winter Arc             | Near-peak performance, strong discipline.            |
| 8     | Hustle Arc             | Strong work ethic and focused attention.             |
| 7     | Discipline Arc         | Maintains good balance with high productive output.  |
| 6     | Rise Arc               | Trending productive, moderate distractions.          |
| 5     | Equilibrium Arc        | Balanced between work and leisure.                   |
| 4     | Redemption Arc         | Attempting recovery from distractions.               |
| 3     | Procrastination Arc    | More time spent on non-productive activities.        |
| 2     | Denial Arc             | Heavily entertainment-focused with minor effort.     |
| 1     | Recovery Arc           | Very low productivity, but some effort made.         |
| 0     | Rock Bottom Arc        | Entirely distracted, no productive time recorded.    |

---

## Installation

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer Mode" in the top right.
4. Click "Load unpacked" and select the project folder.
5. Pin the Arc Tracker extension to the toolbar for easy access.

---

## Usage

- Open the extension via the popup icon.
- Click **"Open Dashboard"** to view detailed usage analytics.
- Manually tag domains as "productive" or "entertainment" using the input field.
- Export your data via the "Export CSV" button.
- Reset the data store anytime using the "Reset" button.

---
