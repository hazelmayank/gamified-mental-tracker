import axios from 'axios'


const api =axios.create({
    baseURL:"http://localhost:3000/api/v1"
});

api.interceptors.request.use((config) =>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config;
});

api.interceptors.response.use(
    res=>res,
    err=>{
        if(err.response && err.response.status==401){
             const currentPath = window.location.pathname;
if(currentPath=='/journal'){
    const jounral_draft=JSON.stringify({
        mood:document.querySelector("select")?.value,
        habits: Array.from(document.querySelectorAll("input[type=checkbox]:checked")).map(cb => cb.value),
        journalText:document.querySelector("textarea")?.value
    })

    localStorage.setItem("draft_journal",jounral_draft);
}
       localStorage.removeItem("token");

        alert("Your session has expired. You’ll be redirected to login.");

        setTimeout(() => {
        window.location.href = "/login";
      }, 3000); 


        }
        

      return Promise.reject(err);
    
    }
)

export default api;