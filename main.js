var axios = require('axios');
const express = require('express');
const fs = require('fs');
app = express();
let alert = require('alert');  
const got = require ('got');

//############ INPUTS #################################################### 
let desriredPincode  = [ 411027, 411038,411011, 412115 ,411001];
let date = "07-05-2021" ; //dd-mm-yyyy
let interval = 5000;   //5 sec => 5000 , for 1sec => 1000 , 2sec => 2000  
//##############################################################################


let responseArray= [];
async function getData(){

   
  var config = {
    method: 'get',
    url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=363&date=07-05-2021',
   
  };
      got(config)
      .then(function (response) 
      {  

        response = JSON.parse(response.body);
         dataArray = response["centers"];
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
      
        
      })
      .catch(function (error) {
        console.log(error);
      });
      
}
function intervalFunc() {
    console.log("Triggered every 5 sec ");
    getData();
}
  
  setInterval(intervalFunc, interval);
//cron.schedule('5 * * * * *',getData() );
app.listen(3000,()=>{
    console.log("Server is running");
});