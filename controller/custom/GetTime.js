function getTime() {
    const godzinySlownie = ["dwunasta", "pierwsza", "druga", "trzecia", "czwarta", "piąta", "szósta", "siódma", "ósma", "dziewiąta", "dziesiąta", "jedenasta"];
    const jednosci = ["zero", "jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć"];
    const nascie = ["dziesięć", "jedenaście", "dwanaście", "trzynaście", "czternaście", "piętnaście", "szesnaście", "siedemnaście", "osiemnaście", "dziewiętnaście"];
    const dziesiatki = ["", "", "dwadzieścia", "trzydzieści", "czterdzieści", "pięćdziesiąt"];

    const teraz = new Date().toLocaleTimeString("pl-PL", { timeZone: "Europe/Warsaw", hour: '2-digit', minute: '2-digit' }).split(":");
    const godziny = parseInt(teraz[0], 10) % 12; // Używamy modulo 12, aby poprawnie odmieniać godziny
    const minuty = parseInt(teraz[1], 10);

    const liczbaNaSlowo = (liczba) => {
        if (liczba < 10) {
            return jednosci[liczba];
        } else if (liczba >= 10 && liczba < 20) {
            return nascie[liczba - 10];
        } else {
            return dziesiatki[Math.floor(liczba / 10)] + (liczba % 10 !== 0 ? " " + jednosci[liczba % 10] : "");
        }
    };

    return "Nie bliżej nie dalej niż " + godzinySlownie[godziny] + " " + liczbaNaSlowo(minuty);
}

module.exports = getTime;