/**
 * WeatherAPI.com — Current Weather (JavaScript Fetch API)
 * Docs: https://www.weatherapi.com/docs/
 * Sign up free: https://www.weatherapi.com/signup.aspx
 * https://github.com/weatherapicom/weatherapi-examples/blob/main/javascript/current.js
*/
const API_KEY = "a47b53784e9541c8a0101129260107"; 
const BASE_URL ="https://api.weatherapi.com/v1"; 

/**
 * Valida os campos de entrada do formulário
 * @param {string} origin - Local de origem
 * @param {string} destination - Local de destino
 * @param {string} initialDate - Data de ida
 * @param {string} finalDate - Data de volta
 * @param {number} differenceDays - Diferença em dias entre ida e volta
 * @returns{Error} Lança um erro se algum campo for inválido
 */
async function validateFields(origin, destination, initialDate, finalDate, differenceDays) {

    if (!origin || !destination || !initialDate || !finalDate) {
        throw new Error('Todos os campos são obrigatórios.');
    }

    const dataInicio = new Date(initialDate + 'T00:00:00');
    const dataFim = new Date(finalDate + 'T00:00:00');

    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
        throw new Error('Data inválida.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dataInicio < today) {
        throw new Error('A data de ida não pode ser anterior à data atual.');
    }

    if (dataFim < today) {
        throw new Error('A data de volta não pode ser anterior à data atual.');
    }

    if (differenceDays < 0) {
        throw new Error('A data de volta não pode ser anterior à data de ida.');
    }

    if (differenceDays > 14) {
        throw new Error('A diferença entre as datas não pode ser superior a 14 dias.');
    }
}

/* *
*   Obtém as condições meteorológicas atuais de um local
*   @param {string} location - Nome da cidade, latitude/longitude, código postal ou endereço IP
*   @param {boolean} includeAqi - Inclui dados de qualidade do ar
*   @returns {Promise<Object>} Dados meteorológicos
*/
async function getCurrentWeather(location, includeAqi = true) {
    const params = new URLSearchParams({
        key: API_KEY,
        q: location,
        aqi: includeAqi ? 'yes' : 'no',
    });
    
    const response = await fetch(`${BASE_URL}/current.json?${params}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`WeatherAPI código ${error.error.code}: ${error.error.message}`);
    }

    return response.json();
}

/**
* Obter previsão de ate 14 dias com detalhamento por hora
* @param {string} location - Nome da cidade, lat/lon, código postal, endereço IP
* @param {number} days - Número de dias (1-14)
* @returns {Promise<Object>} Dados da previsão
*/
async function getForecast(location, days) {
    const params = new URLSearchParams({
        key: API_KEY,
        q: location,
        days: days,
        aqi: 'yes',
        alerts: 'yes',
    });

    const response = await fetch(`${BASE_URL}/forecast.json?${params}`);

    if(!response.ok) {
        const error = await response.json();
        throw new  Error(`WeatherAPI codigo de error ${error.error.code}: ${error.error.message}`);
    }

    return response.json();
}

/** 
 * Salva os dados de viagem no histórico do localStorage
 * @param {string} origin - Local de origem
 * @param {Object} destination - Objeto com informações da cidade destino
 * @param {string} initialDate - Data de ida
 * @param {string} finalDate - Data de volta
 * @param {number} differenceDays - Diferença em dias entre ida e volta
 * @param {Object} weather - Objeto com informações do clima atual
 * @returns {Array} Lista atualizada de viagens salvas no localStorage      
*/
async function historySave(origin, destination, initialDate, finalDate, differenceDays, weather, forecast) {
  const dataObj = {
    Origem: origin,
    Cidade: destination.name,
    DataIda: initialDate,
    DataVolta: finalDate,
    Dias: differenceDays,
    Clima: {
        Condicao: forecast.day.condition.text,
        Temp: forecast.day.avgtemp_c,
        TempMin: forecast.day.mintemp_c,
        TempMax: forecast.day.maxtemp_c,
        Chuva: forecast.day.daily_chance_of_rain,
        Vento: forecast.day.maxwind_kph,
        UV: forecast.day.uv
    }
  };
  let datasList = JSON.parse(localStorage.getItem('datasList')) || [];
  datasList.push(dataObj);
  localStorage.setItem('datasList', JSON.stringify(datasList));
  return datasList; 
}

/**
 *  Imprime o histórico de viagens salvas no localStorage na tela
 * @param {*} datasList 
 */
function printHistory(datasList) {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = ''; // Limpa o conteúdo anterior

    datasList.forEach((data, index) => {
        const dataDiv = document.createElement('div');
        dataDiv.classList.add('history-item');
        dataDiv.innerHTML = `
            <h3>Viagem ${index + 1}</h3>
            <p><strong>Origem:</strong> ${data.Origem}</p>
            <p><strong>Cidade:</strong> ${data.Cidade}</p>
            <p><strong>Data de Ida:</strong> ${data.DataIda}</p>
            <p><strong>Data de Volta:</strong> ${data.DataVolta}</p>
            <p><strong>Dias:</strong> ${data.Dias.Dias}</p>
            <p><strong>Condição:</strong> ${data.Dias.Condicao}</p>
            <p><strong>Temperatura:</strong> ${data.Dias.Temp} °C</p>
            <p><strong>Temperatura Mínima:</strong> ${data.Dias.TempMin} °C</p>
            <p><strong>Temperatura Máxima:</strong> ${data.Dias.TempMax} °C</p>
            <p><strong>Chance de Chuva:</strong> ${data.Dias.Chuva} %</p>
            <p><strong>Vento:</strong> ${data.Dias.Vento} km/h</p>
            <p><strong>Índice UV:</strong> ${data.Dias.UV}</p>
        `;
        historyContainer.appendChild(dataDiv);
    });
}

/**
 * Função de iniciar 
 */
function initial() {
    const btnIniciar = document.getElementById("btn-iniciar");

    if (btnIniciar) {
        btnIniciar.addEventListener("click", () => {
            const audio = new Audio("../midia/win31.mp3");

            audio.play()
                .catch((erro) => {
                    console.error("Erro ao reproduzir o áudio:", erro);
                    // Redireciona mesmo se o áudio falhar
                    window.location.href = "../pages/page2.html";
                });

            audio.addEventListener("ended", () => {
                window.location.href = "../pages/page2.html";
            });
        });
    }
}
   
/** * Função principal que obtém os dados de viagem e clima, e salva no histórico
 * @returns {Promise<void>}
 */
async function main() {
    try{
        const origin = document.getElementById("origem").value;
        const destination = document.getElementById("destino").value;
        const initialDate = document.getElementById("data-inicio").value;
        const finalDate= document.getElementById("data-fim").value;
        const start = new Date(initialDate);
        const end = new Date(finalDate);
        const differenceDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        // Valida os campos de entrada
        await validateFields(origin, destination, initialDate, finalDate, differenceDays);

        // Obtém as condições meteorológicas atuais do local
        const current = await getCurrentWeather(destination);
        
        const {location, current: weather } = current;
        
        // Obtém a previsão do tempo para os próximos dias
        const forecast = await getForecast(destination, Math.min(1, differenceDays));
        
        // Salva os dados no localStorage
        let datasList = await historySave(origin, current.location, initialDate, finalDate, differenceDays, weather, forecast.forecast.forecastday) || [];

        printHistory(datasList);

        // Se fechar a aba do navegador, o localStorage é limpo
        window.addEventListener('beforeunload', () => {
            localStorage.removeItem('datasList');
        });

    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

// Executa a função principal
document.getElementById("btn-iniciar").addEventListener("click", async () => {
    initial();
});

document.getElementById("btnSalvar").addEventListener("click", async () => {
    await main();
    const datasList = await historySave(
        origin,
        current.location,
        initialDate,
        finalDate,
        differenceDays,
        weather,
        forecast.forecast.forecastday
    );
});