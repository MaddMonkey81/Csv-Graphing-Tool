const express = require('express');
var path = require('path');
const fileUpload = require("express-fileupload");
//var http = require('http');
const csvtojson = require('csvtojson');
//const fsp = require('fs').promises;

let data = [];

function toDelete(){
//////////////////////////////////convert csv
//const csvFilePath = 'csv.csv';
//const csvFilePath = x;


// csvtojson()
// .fromFile(csvFilePath)
// .then((arrObj) => {
//     console.log(arrObj);

//     let headersObj = arrObj[0] //first obj in array
//     let headersArr = Object.keys(headersObj)
//     let dataObj = new Object()

//     headersArr.forEach((header)=>{
    
//       let newArr = arrObj.map(function(elm) { return elm[header]; });
//       dataObj[header] = newArr;
//   })
       
//     headersArr.forEach((header)=>{

//         let tmp = {};
//         if (header != 'time'){
//           tmp.name = header
//           tmp.type = 'scatter'
//           tmp.x = dataObj.time
//           tmp.y = dataObj[header]

//           data.push(tmp)
//       }
//     })

//     console.log(data);
    //return data;
    //data = [{name:'temp',type:'scatter',x:[1,2,3,4,5,6,7,8,9,10],y:[10,20,30,40,50,60,70,80,90,100]}, {name:'hum',type:'scatter',x:[1,2,3,4,5,6,7,8,9,10],y:[10,30,20,50,40,70,60,90,80,100]}];
  //})

//////////////////////////////////convert csv
}

app = express();

//setting view engine to ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

//Then, enable the express-fileupload middleware by calling app.use() method:
app.use(
  fileUpload({
    //The option will let express-fileupload create the directory path for mv() method when it doesn’t exist:
    createParentPath: true,
    limits: { fileSize: 1024 * 1024 * 100 }, // 1 MB
    abortOnLimit: true
  })
);

app.use(express.static(path.join(__dirname, 'public')));

//route for index page
app.get("/", function (req, res) {
 
  data = []; //CLEAR DATA

  res.render("index", {
    fileName: "Upload Csv File with first colmn as Time", 
    data: data
  });
});

//route for magic page
app.get("/about", function (req, res) {
  res.render("about");
});

/////////////////file upload

app.post("/upload", (req, res) => {
  
  data = []; //clear array

  // TODO: process the file upload
  //When there’s no file uploaded, send a 400 response with "No files were uploaded." as the message:
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
  //Following the name attribute of the file input above, the file you uploaded will be assigned under req.files.myFile.
  let file = req.files.myFile;
  const extensionName = path.extname(file.name); // fetch the file extension
  const location = __dirname + "/files/" + file.md5 + new Date().getTime();
  const allowedExtension = ['.csv'];
 
  // if (err) {
  //   return res.status(500).send(err);
  // }
  if(!allowedExtension.includes(extensionName)){
    return res.status(422).send("Invalid file type, Not a CSV");
  }

  stringData = file.data.toString()
  
  async function convertCsv(){

    //let data = [];

    const arrObj = await csvtojson().fromString(stringData);
    
    let headersObj = arrObj[0] //first obj in array
    let headersArr = Object.keys(headersObj)
    let dataObj = new Object()

    headersArr.forEach((header)=>{
    
      let newArr = arrObj.map(function(elm) { return elm[header]; });
      dataObj[header] = newArr;
  })
       
    headersArr.forEach((header)=>{

        let tmp = {};
        if (header != 'time'){
          tmp.name = header
          tmp.type = 'scatter'
          tmp.x = dataObj.time
          tmp.y = dataObj[header]

          data.push(tmp)
      }
    })

  
 // await fsp.writeFile(location, JSON.stringify(data))
  
  res.render("index", {
  fileName: location, 
  data: data
  })

  // jsonArray.mv(location, (err) => {
  //   if (err) {
  //     return res.status(500).send(err);
  //   }
  //   if(!allowedExtension.includes(extensionName)){
  //     return res.status(422).send("Invalid file");
  //   }
  //     //return res.send({ status: "success", path: location });
  //     //let newData = getData(location);
  //     //res.send({ status: "success", data: "data" });
  //   });


  }
  convertCsv()
});
/////////////////file upload


app.listen(8080, function () {
  console.log("Server is running on port 8080 ");
});
 
