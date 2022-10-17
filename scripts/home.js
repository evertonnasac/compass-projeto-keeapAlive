
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
let timeSession = 15
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
    const key2 = "16b970af18b244c7b6e124026221610"
    const lang = "pt-br"

    //URI da api do tempo
    const urlWeather = 
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`+
    `&appid=${key2}&lang=${lang}&units=metric`


    const url = `http://api.weatherapi.com/v1/current.json?key=${key2}&q=${lat},${lon}`

    const urlLocale2 = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}`+
                        `&format=json`

    //URI da API geolocalização
    const urlLocale = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}`+
    `&lon=${lon}&limit=${1}&appid=${key}`

    //Fazendo as chamadas das APIs para consultar o tempo e o nome da cidade
    Promise.all([fetchApi(url), fetchApi(urlLocale2)])
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

   console.log(values)
   let [weat, locale] = values
   let {current} = weat

   let {address, display_name} = locale
   let city = address["city"] || address["town"] || display_name.split(",")[0]
   console.log("cidade aqui", city)
  
   let stateInitial = address["ISO3166-2-lvl4"].split("-").pop() || ""

   //console.log(city[0].state.toLowerCase())

   //Verificando se tem a propriedade estado na resposta da API
   /* city[0].hasOwnProperty("state") ? 
        stateInitial = getState(city[0].state.toLowerCase()) : 
        stateInitial = ""

    console.log(weat, city)*/
    
    let infoWeather = {
        weather : Math.trunc(current["temp_c"]), //Temperatura em celcius
        city: `${city} - ${stateInitial}`, //Nome da cidade e a sigla do estado
        icon: current["condition"]["icon"] //codigo do incone do tempo
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
        <img src = ${icon} alt="Incone" class="icon-weather">
        <p class="info-weather">${weather}°</p>
    </div>`

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


const getTimeSession =  setInterval(() => {

    if(timeSession > 0){
        pTimeFooter.innerHTML = --timeSession
    }
    else{
        setTimeOutSession()
    }
}, 1000);


const setTimeOutSession = () =>{

    clearInterval(getTimeSession)

    if (!document.hasFocus()){

        setNotification()

        /*setTimeout(() => {
            setAlertSession()
        }, 2000);*/
    }
    
    else{
        setAlertSession()
    }
    

}

const setAlertSession = () =>{

    let opt = confirm("Sessão expirada! Deseja cotinuar logado?")
    console.log(opt)

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

    location.replace("https://www.uol.com.br/")
}

const init = () =>{

    getLocation()

    setInterval(setDateTime,1000)
}



const setNotification = () =>{

    let notification = new Notification("Compass - Home",{

        icon: "https://logospng.org/download/uol/logo-uol-icon-1024.png",
        body: "Sessão expirada em Home Compass."
    })

    notification.onclick = () => {
        window.focus()
    }
    //=> window.location.href = "http://127.0.0.1:5500/pages/home.html"
}


init()


btnLogout.addEventListener("click", ()=>{
    let opt = confirm("Deseja manter os dados salvos?")
    logout(opt)
})


document.addEventListener('DOMContentLoaded', () =>{
    if(Notification){
        if(Notification.permission !== "granted"){
            Notification.requestPermission()
        }
    }
})

window.addEventListener("focus", () =>{
    if (timeSession <=0 ){
        setTimeout(setAlertSession, 1000)
    }
})