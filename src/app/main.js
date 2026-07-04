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
 * @param {string} location - Local de destino
 * @param {string} initialDate - Data de ida
 * @param {string} finalDate - Data de volta
 * @param {number} differenceDays - Diferença em dias entre ida e volta
 * @returns{Error} Lança um erro se algum campo for inválido
 */
async function validateFields(origin, location, initialDate, finalDate, differenceDays) {
    const dataInicio = new Date(initialDate + 'T00:00:00');
    const dataFim = new Date(finalDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Define a hora para 00:00:00 para comparar apenas a data
    
    if (dataInicio < today) {
        throw new Error('A data de ida não pode ser anterior à data atual.');
    }
    if (dataFim < today) {
        throw new Error('A data de volta não pode ser anterior à data atual.');
    }
    if (!origin || !location || !initialDate || !finalDate) {
        throw new Error('Todos os campos são obrigatórios.');
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
        throw new  Error(`WeatherAPI codigo de error ${error.code}: ${error.error.message}`);
    }

    return response.json();
}

/** 
 * Salva os dados de viagem no histórico do localStorage
 * @param {string} origin - Local de origem
 * @param {Object} location - Objeto com informações da cidade destino
 * @param {string} initialDate - Data de ida
 * @param {string} finalDate - Data de volta
 * @param {number} differenceDays - Diferença em dias entre ida e volta
 * @param {Object} weather - Objeto com informações do clima atual
 * @returns {Array} Lista atualizada de viagens salvas no localStorage      
*/
async function historySave(origin, location, initialDate, finalDate, differenceDays, weather)  {
  const dataObj = {
    Origem: origin,
    Cidade: location.name,
    DataIda: initialDate,
    DataVolta: finalDate,
    Dias: {
        Dias: differenceDays,
        Condicao: weather.condition.text,
        Temp: weather.temp_c,
        TempMin: weather.mintemp_c,
        TempMax: weather.maxtemp_c,
        Chuva: weather.daily_chance_of_rain,
        Vento: weather.wind_kph,
        UV: weather.uv
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
        const location = document.getElementById("destino").value;
        const initialDate = document.getElementById("data-inicio").min = new Date().toISOString().split("T")[0]; // Define a data mínima como a data atual
        const finalDate= document.getElementById("data-fim").min = new Date().toISOString().split("T")[0]; // Define a data mínima como a data atual
        const differenceDays = finalDate-initialDate;
        
        // Valida os campos de entrada
        await validateFields(origin, location, initialDate, finalDate, differenceDays);

        // Obtém as condições meteorológicas atuais do local
        const current = await getCurrentWeather(location);
        const {location, current: weather } = current;
         
        // Obtém a previsão do tempo para os próximos dias
        const forecast = await getForecast(location.name, differenceDays);
        forecast.forecast.forecastday.forEach((day) => {
            day.date;
            day.day.condition.text;
            day.day.maxtemp_c;
            day.day.mintemp_c;
            day.day.wind_kph;
            day.day.daily_chance_of_rain; 
            day.day.uv;
        }); 
        
        // Salva os dados no localStorage
        let datasList = await historySave(origin, location, initialDate, finalDate, differenceDays, weather) || [];

        // Se fechar a aba do navegador, o localStorage é limpo
        window.addEventListener('beforeunload', () => {
            localStorage.removeItem('datasList');
        });

    } catch (error) {
        alert('Error:', error.message);
    }
}


// Executa a função principal
        main();
// Exibe o histórico de viagens salvas
printHistory(datasList);