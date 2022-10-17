
//Pegando a referência dos elementos do HTML
const $ = document.querySelector.bind(document)

const pHour = $(".header__hour")
const pDate = $(".header__date")
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

    
    const key = "16b970af18b244c7b6e124026221610"

    //URI da api do tempo
    const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${lat},${lon}`

     //URI da API geolocalização
    const urlLocale2 = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}`+
                        `&format=json`


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

}

//Trata os dados da consulta da API do tempo e da localização
const filterDataWeather = (values) => {

   let [weat, locale] = values

   let {current} = weat
   let {address, display_name} = locale
   let city = address["city"] || address["town"] || display_name.split(",")[0]
  
   let stateInitial = address["ISO3166-2-lvl4"].split("-").pop() || ""

    
    let infoWeather = {
        weather : Math.trunc(current["temp_c"]), //Temperatura em celcius
        city: `${city} - ${stateInitial}`, //Nome da cidade e a sigla do estado
        icon: current["condition"]["icon"] //codigo do incone do tempo
    }

    //Chamando a função que renderiza os dados passados no parâmertro
    renderWeather(infoWeather)
}

//Injeta os dados do tempo no HTML
const renderWeather = ({weather, city, icon }) =>{

    const divCityContainer = $(".header__city-container")
    
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

//Renderizando a data em tempo real
const setDateTime = () =>{

    let date = new Date().toLocaleDateString('pt-br', getDateTime.optionDate)
    let time = new Date().toLocaleTimeString("pt-br", getDateTime.optionTime)

    pHour.innerHTML = time
    pDate.innerHTML = date
}

//Startando o time da sessão
const getTimeSession =  setInterval(() => {

    if(timeSession > 0){
        pTimeFooter.innerHTML = --timeSession
    }
    else{
        setTimeOutSession()
    }
}, 1000);


//Função quando o tempo da sessão encerra
const setTimeOutSession = () =>{

    clearInterval(getTimeSession)

    //notifica o usuario caso esteja em outra aba
    if (!document.hasFocus()){

        setNotification()
    }
    
    else{
        setAlertSession()
    }
    

}

//Abre popup que pergunta se desja manter logado
const setAlertSession = () =>{

    let opt = confirm("Sessão expirada! Deseja cotinuar logado?")

    if(opt){
        location.reload()
    }
    else{
        logout()
    }
}

//Função de logout
const logout = (save = false) =>{

    if(!save){

        localStorage.removeItem("login")
    }

    location.replace("https://www.uol.com.br/")
}

//Criando a mensagem de notificação
const setNotification = () =>{

    let notification = new Notification("Compass - Home",{

        icon: "https://logospng.org/download/uol/logo-uol-icon-1024.png",
        body: "Sessão expirada em Home Compass."
    })

    notification.onclick = () => {
        window.focus()
    }
}

const init = () =>{

    getLocation()

    setInterval(setDateTime,1000)
}


init()

//..........................Listeners de eventos

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