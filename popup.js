
(
    async () =>{
  const SiteListingAPIUrl = 'https://pizgloria.americantower.com/piz_api/SiteListing/GetSiteListingData'
  const token = localStorage.getItem('Token')

  document.querySelector("#logout").addEventListener('click', function(){
    localStorage.clear()
    document.querySelector('.actions').style.display = `none`;
    document.querySelector('.login').style.cssText = `min-width:400px;min-height: fit-content;`;
})
document.querySelector('#clsBtn').addEventListener('click',() => window.close())
document.querySelector("#logonBtn").addEventListener('click',(e)=>{
    e.preventDefault();
    let username = document.querySelector('#username').value.trim();
    let password = document.querySelector('#password').value.trim();
    login(username,password)
   })
 document.querySelector("#rptBtn").addEventListener('click', async function () {
    let siteData = await getData()
        const keys = Object.keys(siteData[0]);
        const CSV = [
          keys.join(","),
          siteData.map((row) => keys.map((key) => row[key]).join(",")).join("\n"),
        ].join("\n");
        const csvBlob = new Blob([CSV]);
        let link = document.createElement('a');
        link.setAttribute('download','PizGloria_Hourly_Report_Data.csv');
        link.href = URL.createObjectURL(csvBlob);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } ) 
  

  async function login(username,password){
 if(!username || !password) {
document.querySelector('#error').style.color = "red"
 document.querySelector('#error').innerText = 'Username/Password is required'
 return false;
 }
 document.querySelector('#error').innerText =''
 try
       {
    let credentials = 'Basic '+btoa(`${username}:${password}`)
    let response = await fetch(`https://pizgloria.americantower.com/piz_api/Auth/Authenticate`,{
      method:'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': credentials
      }
    })
  
    let {Token} = await response.json()
    console.log(Token)
  if(Token){
    localStorage.setItem('Token',Token)
showActionsButtons()

    }else{
        document.querySelector('#error').style.color = "red"
        document.querySelector('#error').innerText = 'Incorrect Username/Password '
        return false;
    }
  
    }catch(error){
      console.log(error.message)
    }
  }
 function showActionsButtons(){
    document.querySelector('.actions').style.cssText = `min-width:400px;`;
    document.querySelector('.login').style.display = 'none'
 }

async  function getData(){
    try
    {
        console.log('getting data')
 let response = await fetch(SiteListingAPIUrl,{
   method:'POST',
   body: JSON.stringify({"PageIndex":0,"RecordPerPage":600}),
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${localStorage.getItem('Token')}`
   }
 })

 let {Data} = await response.json()
 console.log('Done getting data')
 let dataPoints = Data.map( ({LastUpdated,SiteCode,SiteName,ShelterTemp,RectifierSystemVolt,DCVolt,Region,RectifierBatteryTemp1,
 RectifierBatteryTemp2}) =>{
   return {
     'Date&Time':new Date(new Date(LastUpdated).getTime()).toLocaleString().toString().replace(','," "),
     'Site ID':SiteCode,
     'Site Name':SiteName,
     'Shelter Temp. (°C)':ShelterTemp,
     'System Voltage (V)': RectifierSystemVolt,
     'Battery 1 Temp. (°C)':RectifierBatteryTemp1,
     'Battery 2 Temp. (°C)':RectifierBatteryTemp2,
     'DC Voltage (V)':DCVolt,
     'Region':Region

   }
 })
console.log(dataPoints)
return Promise.resolve(dataPoints)
} catch (error) {
 alert(`An error  occured: ${error.message}`)
 return false;
} 
 }

  if(!token) {
   document.querySelector('.login').style.cssText = `min-width:400px;min-height: fit-content;`;
    return false;
  }else{
    document.querySelector('.actions').style.cssText = `min-width:400px;`;
     }

}

     
  )() 
