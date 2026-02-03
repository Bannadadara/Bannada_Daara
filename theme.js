/**
 * Dynamic Daily Theme Logic
 * Automatically sets the accent "thread" colors based on the Day of the Week.
 */
(function () {
    // [StartColor, MidColor, EndColor, GlowColor]
    const dailyPalettes = [
        ['#FFD700', '#FFA500', '#FF8C00', '#FFFACD'], // Sunday: Sun (Gold/Orange)
        ['#00BFFF', '#1E90FF', '#4169E1', '#E0FFFF'], // Monday: Moon (Sky Blue)
        ['#FF4D4D', '#DC143C', '#B22222', '#FFC0CB'], // Tuesday: Mars (Red/Pink)
        ['#32CD32', '#00FA9A', '#2E8B57', '#F0FFF0'], // Wednesday: Mercury (Green)
        ['#9370DB', '#8A2BE2', '#4B0082', '#E6E6FA'], // Thursday: Jupiter (Purple)
        ['#FF69B4', '#FF1493', '#C71585', '#FFF0F5'], // Friday: Venus (Hot Pink)
        ['#483D8B', '#6A5ACD', '#7B68EE', '#E6E6FA']  // Saturday: Saturn (Indigo)
    ];

    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const colors = dailyPalettes[today];

    const root = document.documentElement;
    root.style.setProperty('--thread-1', colors[0]);
    root.style.setProperty('--thread-2', colors[1]);
    root.style.setProperty('--thread-3', colors[2]);
    root.style.setProperty('--thread-4', colors[3]);

    console.log(`Bannada Daara Theme: Applied Palette for Day ${today}`);
})();
