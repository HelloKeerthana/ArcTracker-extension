// 🕒 Live Clock
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// 🌐 Load category tags from localStorage
function getCustomTags() {
  const tags = localStorage.getItem("domainTags");
  return tags ? JSON.parse(tags) : {};
}

function saveCustomTag(domain, category) {
  const tags = getCustomTags();
  tags[domain] = category;
  localStorage.setItem("domainTags", JSON.stringify(tags));
}

// Load Data and Render
function loadData() {
  chrome.storage.local.get(null, (data) => {
    const dataList = document.getElementById("data-list");
    const labels = [], values = [], entries = [];
    let totalSeconds = 0;
    let entertainmentTime = 0, productiveTime = 0;

    const customTags = getCustomTags();

    const CATEGORIES = {
      entertainment: [
        "youtube.com", "netflix.com", "instagram.com", "twitter.com",
        "tiktok.com", "discord.com", "hotstar.com"
      ],
      productive: [
        "chatgpt.com", "github.com", "docs.google.com", "notion.so",
        "stackoverflow.com", "wikipedia.org"
      ]
    };

    dataList.innerHTML = "";

    for (let domain in data) {
      if (domain.startsWith("chrome-extension") || /^[a-z0-9]{32}$/.test(domain)) continue;

      const seconds = Math.round(data[domain]);
      entries.push({ domain, seconds });
      labels.push(domain);
      values.push(seconds);
      totalSeconds += seconds;

      const category = customTags[domain] ||
        (CATEGORIES.entertainment.find(d => domain.includes(d)) ? "entertainment" :
        CATEGORIES.productive.find(d => domain.includes(d)) ? "productive" : null);

      if (category === "entertainment") entertainmentTime += seconds;
      if (category === "productive") productiveTime += seconds;

      const li = document.createElement("li");
      li.innerHTML = `<span>${domain}</span> <span>${seconds} sec</span>`;
      dataList.appendChild(li);
    }

    // 🎯 Top 3 Sites
    const topList = entries.sort((a, b) => b.seconds - a.seconds).slice(0, 3);
    document.getElementById("top-sites").innerHTML = topList.map((e, i) =>
      `#${i + 1} ${e.domain} (${e.seconds}s)`
    ).join("<br>");

    // 📆 Totals
    const dailyMins = Math.round(totalSeconds / 60);
    const weeklyMins = Math.round(totalSeconds / 60); // simulated
    document.getElementById("totals").textContent = `Today: ${dailyMins} mins | This week: ${weeklyMins} mins`;

    // 💀 Mood Indicator (10 = slayed, 0 = cooked)
    const cookedScale = entertainmentTime === 0 && productiveTime > 0
      ? 10
      : productiveTime === 0
        ? 0
        : Math.min(10, Math.round((productiveTime / (productiveTime + entertainmentTime)) * 10));
    const moodData = getMoodMessage(cookedScale);
    document.getElementById("mood").innerHTML = `Mood: ${cookedScale}/10<br>${moodData.mood}`;
    document.getElementById("arc-label").textContent = moodData.arc;

    // 📊 Pie Chart
    if (labels.length > 0) {
      const ctx = document.getElementById("timePie").getContext("2d");
      if (window.pieChart) window.pieChart.destroy();
      window.pieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: [
              '#60a5fa','#34d399','#fbbf24','#f87171','#a78bfa',
              '#f472b6','#fcd34d','#4ade80','#38bdf8','#c084fc'
            ]
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#fff', font: { size: 14 } }
            },
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const val = ctx.raw;
                  const percent = ((val / total) * 100).toFixed(1);
                  return `${ctx.label}: ${val}s (${percent}%)`;
                }
              }
            }
          }
        }
      });
    }
  });
}

// 🍳 Mood Messages (0 = cooked, 10 = slayed)
function getMoodMessage(scale) {
  const arcs = {
    0: "🥵 Rock Bottom Arc",
    1: "🔥 Recovery Arc",
    2: "🧩 Denial Arc",
    3: "⏳ Procrastination Arc",
    4: "🥱 Redemption Arc",
    5: "⚖️ Equilibrium Arc",
    6: "📈 Rise Arc",
    7: "🛠️ Discipline Arc",
    8: "🌪️ Hustle Arc",
    9: "❄️ Winter Arc",
    10: "🦹‍♀️ Villain Arc"
  };

  const messages = {
    0: "💀 Got cooked! Pure entertainment. Touch grass immediately.",
    1: "🔥 Still very cooked. Try doing something productive.",
    2: "🥴 Mostly cooked... maybe watch fewer edits now.",
    3: "🫠 A bit too much scrolling. Time to switch gears.",
    4: "🧂 Mid cooked. You're not totally doomed.",
    5: "🧘‍♀️ Balanced-ish. Walk the fine line of peace and chaos.",
    6: "🔄 Slightly slaying. You're on the rise.",
    7: "👩‍💻 You're slaying! Great productivity today.",
    8: "🚀 High slay rate. You ate that grind.",
    9: "🎯 Peak slay mode. You deserve an anime break.",
    10: "👑 You slayed! 100% productive. Guilt-free scrolling unlocked."
  };

  return { mood: messages[scale], arc: arcs[scale] };
}


// 🗑️ Reset
document.getElementById("clear-btn").addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    alert("Data reset successfully!");
    loadData();
  });
});

// 📤 Export CSV
document.getElementById("export-btn").addEventListener("click", () => {
  chrome.storage.local.get(null, (data) => {
    let csv = "Domain,Time(seconds)\n";
    for (let domain in data) {
      if (domain.startsWith("chrome-extension") || /^[a-z0-9]{32}$/.test(domain)) continue;
      csv += `${domain},${Math.round(data[domain])}\n`;
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arc-tracker.csv";
    a.click();
    URL.revokeObjectURL(url);
  });
});

// 🏷️ Add custom domain category
document.getElementById("add-tag").addEventListener("click", () => {
  const domain = document.getElementById("custom-domain").value.trim();
  const category = document.getElementById("custom-category").value;
  if (domain && category) {
    saveCustomTag(domain, category);
    alert(`${domain} tagged as ${category}`);
    loadData();
  }
});

loadData();
