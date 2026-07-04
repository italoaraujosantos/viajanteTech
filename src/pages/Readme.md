# 🌤️ Planejador de Viagens com Previsão do Tempo

## 📖 Descrição

Este projeto é uma aplicação JavaScript que auxilia o usuário no planejamento de viagens consultando a previsão do tempo da cidade de destino através da **WeatherAPI**.

Além de consultar as condições climáticas atuais e a previsão para os dias da viagem, a aplicação realiza validações dos dados informados e mantém um histórico das viagens utilizando o **LocalStorage** do navegador.

---

## 🚀 Funcionalidades

* Validação dos dados informados pelo usuário.
* Consulta das condições meteorológicas atuais.
* Consulta da previsão do tempo para até **14 dias**.
* Exibição de informações como:

  * Temperatura atual;
  * Temperatura mínima e máxima;
  * Condições climáticas;
  * Chance de chuva;
  * Velocidade do vento;
  * Índice UV.
* Armazenamento do histórico de viagens no LocalStorage.
* Exibição do histórico de viagens cadastradas.

---

## 🛠️ Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript (ES6+)
* Fetch API
* LocalStorage
* WeatherAPI

---

## 📂 Estrutura do projeto
<img width="246" height="270" alt="image" src="https://github.com/user-attachments/assets/b35c9472-99fa-4c74-82c1-d536884e14f9" />

---

## 🔑 Configuração da API

O projeto utiliza a API pública da **WeatherAPI**.

Crie uma conta gratuita em:

https://www.weatherapi.com/signup.aspx

Após gerar sua chave, substitua:

```javascript
const API_KEY = "SUA_API_KEY";
```

---

## ▶️ Como executar

1. Clone o repositório.

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

2. Entre na pasta do projeto.

```bash
cd seu-repositorio
```

3. Abra o arquivo **index.html** no navegador.

Não é necessário instalar dependências.

---

## 📌 Fluxo da aplicação

1. O usuário informa:

   * Origem;
   * Destino;
   * Data de ida;
   * Data de volta.

2. O sistema valida:

   * Campos obrigatórios;
   * Datas anteriores ao dia atual;
   * Data de volta menor que a de ida;
   * Intervalo máximo de 14 dias.

3. A aplicação consulta a WeatherAPI.

4. Obtém:

   * Clima atual;
   * Previsão do período informado.

5. Os dados são armazenados no LocalStorage.

6. O histórico é exibido na tela.

---

## 📋 Dados armazenados

Cada viagem salva contém:

```text
Origem
Cidade
Data de ida
Data de volta
Quantidade de dias
Condição do tempo
Temperatura
Temperatura mínima
Temperatura máxima
Chance de chuva
Velocidade do vento
Índice UV
```

---

## ⚠️ Validações implementadas

* Todos os campos são obrigatórios.
* A data de ida não pode ser anterior à data atual.
* A data de volta não pode ser anterior à data atual.
* A data de volta não pode ser menor que a data de ida.
* A viagem pode possuir no máximo 14 dias.

---

## 📚 Principais funções

### `validateFields()`

Valida todas as informações inseridas pelo usuário.

---

### `getCurrentWeather()`

Obtém o clima atual da cidade utilizando a WeatherAPI.

---

### `getForecast()`

Obtém a previsão do tempo para até 14 dias.

---

### `historySave()`

Salva as informações da viagem no LocalStorage.

---

### `printHistory()`

Exibe todas as viagens salvas na tela.

---

### `main()`

Função principal responsável por:

* Ler os dados do formulário;
* Validar as informações;
* Consultar a API;
* Salvar os dados;
* Atualizar o histórico.

---

## ⚠️ Observações

O código apresentado possui alguns pontos que podem ser ajustados para seu correto funcionamento:

* Utilizar template strings corretamente nas chamadas `fetch()`:

```javascript
fetch(`${BASE_URL}/current.json?${params}`)
```

e

```javascript
fetch(`${BASE_URL}/forecast.json?${params}`)
```

* Corrigir as mensagens de erro utilizando template strings:

```javascript
throw new Error(`WeatherAPI código ${error.error.code}: ${error.error.message}`);
```

* O cálculo da diferença entre datas deve ser realizado utilizando objetos `Date`, e não por subtração direta de strings.

* A variável `datasList` utilizada em:

```javascript
printHistory(datasList);
```

não existe no escopo global. O histórico deve ser recuperado do LocalStorage antes da chamada.

* O evento para limpar o LocalStorage deve ser `beforeunload` caso a intenção seja apagar os dados ao fechar a aba.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e pode ser utilizado como referência para estudos sobre JavaScript, consumo de APIs REST e armazenamento de dados no navegador utilizando LocalStorage.