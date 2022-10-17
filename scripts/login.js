const inputLogin = document.querySelector(".input-login")
const inputPass = document.querySelector(".input-password")
const btnContinue = document.querySelector(".submit")
const iconLogin = document.querySelector(".icon-login")
const iconPass = document.querySelector(".icon-password")
const pMsgErr = document.querySelector(".msg-err")

let user = {
    login: "admin",
    password: "admin"
}

const getLocalStorage = () => {

    if(localStorage.getItem("login")){

        location.href = "./pages/home.html" 
        return

    }

    /*if(userSave){

        location.href = "./pages/home.html"
    
        inputLogin.value = userSave.login
        inputPass.value = userSave.password

        iconLogin.classList.add("icon-animation")
        iconPass.classList.add("icon-animation")
    }*/
}

const getValueInputs = () =>{

    let login = inputLogin.value
    let password = inputPass.value

    if(!login || !password){
        setError("Ops, por favor, preencha os campos corretamente")
        return
    }

    auth(login, password)
}

const auth = (login, password) =>{

   
    if((login == user.login ) && (password == user.password)){

        localStorage.setItem("login", JSON.stringify(user))

        location.href = "./pages/home.html?q=login"

    }
    else{
        setError("Ops, usuário ou senha inváĺidos. Tente novamente")
    }
}



const setError = (message) =>{

    pMsgErr.innerHTML = message
    pMsgErr.classList.add("show-err")

    inputLogin.classList.add("input-err")
    inputPass.classList.add("input-err")

    inputLogin.value = ""
    inputPass.value = ""

    iconLogin.classList.remove("icon-animation")
    iconPass.classList.remove("icon-animation")


}

const reset = () =>{

    pMsgErr.innerHTML = ""
    pMsgErr.classList.remove("show-err")

    inputLogin.classList.remove("input-err")
    inputPass.classList.remove("input-err")

}


const changePositionIconInput = (target, img) =>{


    if(target.value.length > 0) {
        img.classList.add("icon-animation")
    }
    else{
        img.classList.remove("icon-animation")
    }
}


inputLogin.addEventListener("keyup", (e)=>{
  changePositionIconInput(e.target, iconLogin)
})

inputLogin.addEventListener("focus",reset)

inputPass.addEventListener("keyup", (e)=>{
    changePositionIconInput(e.target, iconPass)
  })

inputPass.addEventListener("focus",reset)

inputPass.addEventListener("keyup", function(e){
    if(e.key == "Enter"){
        this.blur()
        getValueInputs()
    }
})

getLocalStorage()

btnContinue.addEventListener("click", getValueInputs)