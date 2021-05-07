var axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const fs = require('fs');
app = express();
let alert = require('alert');  

//############ INPUTS #################################################### 
let desriredPincode  = [ 411027, 411038,411011, 412115 ,411001];
let date = "08-05-2021" ; //dd-mm-yyyy
//##############################################################################



let responseArray= [];
async function getData(){

   
    var config = {
        method: 'get',
        url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=363&date=${date}`
      };
      
      axios(config)
      .then(function (response) 
      { 
         dataArray = response.data["centers"];
         for(data in dataArray){
             let sessionData= dataArray[data].sessions;
             if (desriredPincode.includes(dataArray[data].pincode ) &&  sessionData[0].min_age_limit!= 45 )
                {
                        responseArray.push({ name: dataArray[data].name , pincode: dataArray[data].pincode , availaible: sessionData[0].available_capacity}  );
                        if ( sessionData[0].available_capacity !=0 ){
                            // write to file 
                             var current = new Date();
                            let DataString  = `${current} ===> Name : ${dataArray[data].name}  pincode: ${dataArray[data].pincode} availaible: ${sessionData[0].available_capacity} \n`; 
                            fs.appendFile('data.txt',DataString , function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                              });
                            alert(`Availiable at :=   ${DataString}`);

                        }
                }

         }
      
         console.log(responseArray);
      })
      .catch(function (error) {
        console.log(error);
      });
      
}
function intervalFunc() {
    console.log("Triggered every 5 sec ");
    getData();
}
  
  setInterval(intervalFunc, 5000);
//cron.schedule('5 * * * * *',getData() );
app.listen(3000,()=>{
    console.log("Server is running");
});