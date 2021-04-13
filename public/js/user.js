
let photoElement = document.querySelector('#photo')

let formdata = new FormData()
photoElement.addEventListener('change', async (e)=>{
    formdata.append('photo', e.target.files[0])
    try{
        let response = await fetch('/about/photo',{
            method:"POST",
            body:formdata
        })
        response = await response.json()
        console.log(response)
        window.location.reload()
    }
    catch(e){
        console.log(e)
    }
})