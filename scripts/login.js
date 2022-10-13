const inputLogin = document.querySelector(".input-login")
const inputPass = document.querySelector(".input-password")
const btnContinue = document.querySelector(".submit")
const iconLogin = document.querySelector(".icon-login")
const iconPass = document.querySelector(".icon-password")




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

inputPass.addEventListener("keyup", (e)=>{
    changePositionIconInput(e.target, iconPass)
  })