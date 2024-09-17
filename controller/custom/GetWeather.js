async function getWeather() {
    const apiKey = '...';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=Rzeszow,pl&units=metric&appid=${apiKey}&lang=pl`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const dzisiaj = new Date();
        const jutro = new Date();
        jutro.setDate(dzisiaj.getDate() + 1);
        const pojutrze = new Date();
        pojutrze.setDate(dzisiaj.getDate() + 2);

        const formatDaty = (data) => `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')}`;

        // temperatury
        const getMaxTemp = (forecasts) => forecasts.reduce((max, p) => Math.max(max, p.main.temp_max), Number.MIN_VALUE);
        const today = data.list.filter(p => p.dt_txt.startsWith(formatDaty(dzisiaj)));
        const tomorrow = data.list.filter(p => p.dt_txt.startsWith(formatDaty(jutro)));

        const maxTempToday = getMaxTemp(today);
        const maxTempTomorrow = getMaxTemp(tomorrow);


        // forecasty
        const getUniqueDescriptions = (forecast) => {
            const descriptions = new Set();
            forecast.forEach(item => {
                descriptions.add(item.weather[0].description);
            });
            return Array.from(descriptions).join(' i ');
        };

        const uniqueDescriptionsToday = getUniqueDescriptions(today);
        const uniqueDescriptionsTomorrow = getUniqueDescriptions(tomorrow);

        let prognoza = '';
        prognoza += `Dziś - ${uniqueDescriptionsToday}, maksymalna temperatura wyniesie ${maxTempToday.toFixed(0)} stopni. `;
        prognoza += `Jutro - ${uniqueDescriptionsTomorrow}, maksymalna temperatura wyniesie ${maxTempTomorrow.toFixed(0)} stopni. `;

        return prognoza;
    } catch (error) {
        console.error('Wystąpił błąd przy pobieraniu danych pogodowych:', error);
        return 'Nie można pobrać prognozy pogody.';
    }
}

module.exports = getWeather;
