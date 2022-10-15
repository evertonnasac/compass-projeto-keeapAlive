//TRATAR O CATCH DAS PROMISES
//TRATAR O LOGOUT COM LOCALSTORAGE
//CORRIGIR POSIONAMENTO DOS LINKS DO FOOTER

//Pegando a referência dos elementos do HTML
const $ = document.querySelector.bind(document)

const pHour = $(".header__hour")
const pDate = $(".header__date")
//const pCity = $(".header__city")
//const pWeather = $(".info-weather")
//const imgIconWeather = $(".icon-weather")
const pTimeFooter = $(".footer__time")
const btnLogout = $(".footer__logout")


//Tempo da sessão 
let timeSession = 5
pTimeFooter.innerHTML = timeSession


//Pegando a localização do dispositivo
const getLocation = () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
    }
}


//Tratamento de sucesso da localização
const geoSuccess = (position) =>{
    console.log(position.coords.latitude)
    console.log(position.coords.longitude)

    getWeather(position.coords.latitude, position.coords.longitude)
}


//Tratamento de erro da localização
const geoError = () =>{

    const divCityContainer = $(".header__city-container")

    const render = `<img src = "../../images/warning.png" class = "icon-error">
                    <p class ="header__city">Localização não encontrada<p>`

    divCityContainer.innerHTML = render
    
}




/*Configutração dos parâmetros para consultar a API do tempo:
    é necessário duas requisições - uma para consultar o tempo
    e outra para consultar o nome da cidade e a sigla do estado com precisão,
    pois a API do tempo não traz o nome correto da cidade e nem a sigla do estado */
const getWeather = (lat, lon)=>{

    const key = "c85c800507b036d7fa63f60c7a49ed39"
    const lang = "pt-br"

    //URI da api do tempo
    const urlWeather = 
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`+
    `&appid=${key}&lang=${lang}&units=metric`

    //URI da API geolocalização
    const urlLocale = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}`+
    `&lon=${lon}&limit=${1}&appid=${key}`

    //Fazendo as chamadas das APIs para consultar o tempo e o nome da cidade
    Promise.all([fetchApi(urlWeather), fetchApi(urlLocale)])
        .then(values => filterDataWeather(values))
        .catch(geoError)
}

//Faz a requisição da API do tempo
const fetchApi = (url) => {

    return fetch(url)
            .then(resp => resp.json())
            .then(data => data)
            .catch()

}

//Trata os dados da consulta da API do tempo
const filterDataWeather = (values) => {

   let [weat, city] = values
   let stateInitial

   console.log(city[0].state.toLowerCase())

   //Verificando se tem a propriedade estado na resposta da API
    city[0].hasOwnProperty("state") ? 
        stateInitial = getState(city[0].state.toLowerCase()) : 
        stateInitial = ""

    console.log(weat, city)
    
    let infoWeather = {
        weather : Math.trunc(weat.main.temp), //Temperatura em celcius
        city: `${city[0].name}${stateInitial}`, //Nome da cidade e a sigla do estado
        icon: weat.weather[0].icon //codigo do incone do tempo
    }

    //Chamando a função que renderiza os dados passados no parâmertro
    renderWeather(infoWeather)
}

/*Retornando a sigla dos estados brasileiros, pois a API de geolocalização
     nao usada, nao retorna a sigla */
const getState = (state) => {

    const initials = {

        "acre" : "- AC",
        "alagoas" :	 "- AL",
        "amapá"	: " - AP",
        "amazonas" : " - AM",
        "bahia"	: " - BA",
        "ceará" :" - CE",
        "distrito federal" : " - DF",
        "espírito santo":" - ES",
        "goiás"	: " - GO",
        "maranhão" : " - MA",
        "mato grosso" :	 " - MT",
        "mato grosso do sul" : " - MS",
        "minas gerais" : " - MG",
        "pará" : " - PA",
        "paraíba" :	 " - PB",
        "paraná" : " - PR",
        "pernambuco" : " - PE",
        "piauí"	: " - PI",
        "pio de janeiro" : " - RJ",
        "rio grande do norte" :	 " - RN",
        "rio grande do sul " :	 " - RS",
        "rondônia"	: " - RO",
        "roraima" : " - RR",
        "santa catarina ": " - SC",
        "são paulo"	: " - SP",
        "sergipe" :	 " - SE",
        "tocantins"	 : " - TO"

    }

    return initials[state] || ""

}

//Injeta os dados do tempo no HTML
const renderWeather = ({weather, city, icon }) =>{

    const divCityContainer = $(".header__city-container")
    console.log(divCityContainer)
    
    const render = `<p class="header__city">${city}</p>
    <div class="header__weather-container">
        <img src = http://openweathermap.org/img/wn/${icon}.png alt="Incone" class="icon-weather">
        <p class="info-weather">${weather}°</p>
    </div>`

    /*

    pCity.innerHTML = city
    imgIcon.setAttribute("src",`http://openweathermap.org/img/wn/${icon}.png`)
    pWeather.innerHTML = weather + "°"
    */

    divCityContainer.innerHTML = render

}

//Criando as configurações de data e hora
const getDateTime = (() =>{
    
    return{
        
        optionDate : {
            year: 'numeric',
            month: 'long',
            day: "numeric",
        },
    
        optionTime : {
            hour : "numeric",
            minute : "numeric"
    
        }

    }


})()


const setDateTime = () =>{

    let date = new Date().toLocaleDateString('pt-br', getDateTime.optionDate)
    let time = new Date().toLocaleTimeString("pt-br", getDateTime.optionTime)

    pHour.innerHTML = time
    pDate.innerHTML = date
}

/*const getTimeSession =  setInterval(() => {

    if(timeSession > 0){
        pTimeFooter.innerHTML = --timeSession
    }
    else{
        setTimeOutSession()
    }
}, 1000);*/


const setTimeOutSession = () =>{

    clearInterval(getTimeSession)
    
    let opt = confirm("Sessão expirada! Deseja cotinuar logado?")

    if(opt){
        location.reload()
    }
    else{
        logout()
    }

}

const logout = (save = false) =>{

    if(!save){

        localStorage.removeItem("login")
    }

    location.href = "../../index.html"
}

const init = () =>{

    getLocation()

    setInterval(setDateTime,1000)
}


init()


btnLogout.addEventListener("click", ()=>{
    let opt = confirm("Deseja manter os dados salvos?")
    logout(opt)
})


