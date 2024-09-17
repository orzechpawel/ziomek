const axios = require('axios');

async function addShopping(items) {
    const token = "...";
    let responseFromGPT = '';
    fetch('...')
        .then(response => response.json()) // Convert the response to JSON
        .then(async data => {
            for (const item of items) {
                const normalizedNewProduct = item.replace(/\s/g, '').toLowerCase();
                const productFound = data.find(p => p.name.replace(/\s/g, '').toLowerCase() === normalizedNewProduct);

                if (productFound !== undefined) {
                    const id = productFound._id;
                    await fetch(`...`, {
                        method: 'PATCH', // Or 'PUT', depending on your backend implementation
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({bought: false}),
                    });
                } else {
                    try {
                        const message = `masz kategorie:
- kwiaty [CATEGORY_FLOWERS]
- owoce [CATEGORY_FRUITS]
- warzywa [CATEGORY_VEGETABLES]
- pieczywo [CATEGORY_BREAD]
- przyprawy, keczupy, musztardy, majonezy [CATEGORY_KETCHUP]
- słodycze [CATEGORY_SWEETS]
- świeże mięso i ryby [CATEGORY_MEAT]
- dania gotowe w tym ciasto francuskie [CATEGORY_READY]
- wędliny [CATEGORY_CUTS]
- sery [CATEGORY_CHEESE]
- świeże mięso i ryby [CATEGORY_MEAT]
- kawy i herbaty [CATEGORY_COFEE]
- chemia domowa i osobista (na przykład ręczniki papierowe, papier toaletowy, worki na śmieci, szampony itp) [CATEGORY_CHEMISTRY]
- nabiał [CATEGORY_DAIRY]
- ryż, kasza, makarony [CATEGORY_RICE]
- artykuły dziecięce [CATEGORY_KIDS]
- napoje [CATEGORY_DRINKS]
- mąki, cukry, mleko i jajka oraz rzeczy do pieczenia [CATEGORY_BAKING]
- mrożonki [CATEGORY_FROZEN]
- alkohol [CATEGORY_ALCOHOL]
- przekąski [CATEGORY_SNACKS]

twoją odpowiedzią niech będzie tylko nazwa kategorii (np. CATEGORY_BAKING na podstawie nazwy produktu spożywczego). Nie akceptuję innych odpowiedzi, oprócz nazw kategorii będących w nawiasach kwadratowych. Nie zwracaj kategorii w formie: 'pieczywo [CATEGORY_BREAD]' tylko CATEGORY_BREAD. produkt to: ${item}`
                        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                            model: "gpt-4-turbo-preview", // Adjust the model if needed
                            messages: [{role: "user", content: message}],
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        responseFromGPT = response.data.choices[0].message.content;
                        await fetch('...', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                name: item,
                                bought: false,
                                category: responseFromGPT
                            }),
                        });
                    } catch (error) {
                        console.error('Error calling OpenAI API:', error);
                    }
                }

            }
        });

    let returnMessage = '';
    if (items.length > 1) {
        returnMessage = 'Dodane produkty to: ';
        items.forEach((item) => {
            returnMessage += `${item}, `;
        })
    } else {
        returnMessage = `Dodaję ${items[0]} do listy zakupów`;
    }
    return returnMessage;
}

module.exports = addShopping;
