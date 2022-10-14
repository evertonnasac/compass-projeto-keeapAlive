//Pegando a referência dos elementos do HTML
const $ = document.querySelector.bind(document)

const pHour = $(".header__hour")
const pDate = $(".header__date")
const pCity = $(".header__city")
const pWeather = $(".info-weather")
const imgIconWeather = $(".icon-weather")
const pTimeFooter = $(".footer__time")

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
    console.log("Error")
}

//Configutração dos parâmetros para consultar a APO do tempo
const getWeather = (lat, lon)=>{

    const key = "c85c800507b036d7fa63f60c7a49ed39"
    const lang = "pt-br"

    const url = 
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`+
    `&appid=${key}&lang=${lang}&units=metric`

    //chamando a função que faz a requisição da API do tempo
    fetchApi(url)
}

//Requisição da API do tempo
const fetchApi = (url) => {

    fetch(url)
    .then(resp => resp.json())
    .then(data => filterDataWeather(data))
    .catch()

}

//Trata os dados da consulta da API do tempo
const filterDataWeather = ({main, name, weather}) => {

    let infoWeather = {
        weather : Math.trunc(main.temp),
        city: name,
        icon: weather[0].icon
    }

    //Chamando a função que renderiza os dados passados no parâmertro
    renderWeather(infoWeather)
}

//Injeta os dados do tempo no HTML
const renderWeather = ({weather, city, icon }) =>{
    pCity.innerHTML = city
    imgIconWeather.setAttribute("src",`http://openweathermap.org/img/wn/${icon}.png`)
    pWeather.innerHTML = weather + " °"

}

//Criando as configurações de data e hora
const getDateTime = (() =>{
    
    const optionDate = {
        year: 'numeric',
        month: 'long',
        day: "numeric",
    }

    const optionTime = {
        hour : "numeric",
        minute : "numeric"

    }

    let date = new Date().toLocaleDateString('pt-br', optionDate)
    let time = new Date().toLocaleTimeString("pt-br", optionTime)
    
    return {
        date, time
    }

})()


const setDateTime = () =>{

    pHour.innerHTML = getDateTime.time
    pDate.innerHTML = getDateTime.date
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
    
    let opt = confirm("Sessão expirada! Deseja cotinuar logado?")

    if(opt){
        location.reload()
    }
    else{
        logout()
    }

}

const logout = () =>{

    localStorage.removeItem("login")
    location.href = "../../index.html"
}

const init = () =>{

    getLocation()

    setInterval(setDateTime,1000)
}


init()