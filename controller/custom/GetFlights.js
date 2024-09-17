const {FlightRadar24API} = require("flightradarapi");
const axios = require("axios");
const frApi = new FlightRadar24API();

async function getFlights() {
    const bounds = frApi.getBoundsByPoint(0, 0, 15000); // add lat-lng
    const flights = await frApi.getFlights(null, bounds);
    let flightsStr = '';
    let flightsAmount = 0;
    let responseStr = '';
    for (const flight of flights) {
        const f = `Linia: ${flight.airlineIata}, Kod Samolotu: ${flight.aircraftCode}, Kod lotniska Startowego: ${flight.originAirportIata === undefined ? 'Brak danych' : flight.originAirportIata}, Kod lotniska docelowego: ${flight.destinationAirportIata === undefined ? 'Brak danych' : flight.destinationAirportIata}, wysokość: ${flight.altitude}`;
        flightsStr += f;
        flightsAmount++;
    }
    if (flightsAmount > 0) {
        let message = `Na podstawie wiadomosci: ${flightsStr} .Samolot <tu podaj model samolotu na podstawie jego kodu> linii <nazwa linii lotniczej na bazie kodu IATA, jeżeli jest undefined lub nieznana pomiń to></nazwa> z lotniska <zdekoduj nazwę lotniska> do <zdekoduj nazwę lotniska> na wysokości <podaj wysokośc w metrach, wysokość z wiadomości jest w stopach, zaokrąglij ją do pełnych metrów.> Chodzi mi tylko o odpowiedź bez opisu. Może to być kilka lotów więc przygotuj jedną wspólną odpowiedź dla każdego z nich. Jeżeli nie jesteś w stanie zdekodowac modelu samolotu oraz trasy - podaj oryginalne informacje. Nazwy samolotów podawaj w zapisie fonetycznym, na przykład Boeing siedem trzy siedem bądź Airbus A trzysta dwadzieścia. Nazwy lotnisk podawaj według miast w języku polskim. Pamiętaj, że nie ma takiego samolotu jak boeing 744 - taki samolot to boeing 747-400.`;
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4-turbo-preview", // Adjust the model if needed
                messages: [{role: "user", content: message}],
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            responseStr = response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return null;
        }
    } else responseStr = 'Brak lotów w okolicy';
    return responseStr;
}

module.exports = getFlights;
