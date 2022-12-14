
import React, {useState} from 'react'

import * as XLSX from 'xlsx'
import PdfMaker from './pdfMaker'

export default function FileUploader() {

    const [kardex, setKardex] = useState("")
    const [listeDeAlumnos, setListaDeAlumnos] = useState("")


   const handleChange = (e) =>{
    const [file] = e.target.files
        const reader = new FileReader();
        reader.onload = (evt) => {
         
            const bstr = evt.target.result;
            let body = {
              fileEncoded:bstr
            }
       
            const wb = XLSX.read(bstr, { type: "binary" });

            
           if(e.target.id==="kardex"){
            setKardex(wb)
           } else{
            setListaDeAlumnos(wb)
           }
            
        };
        reader.readAsBinaryString(file);
   }

   function setNames (sheet, db, i) {

        let apellidoPaterno = {
          f:"",
          h:db[`C${i+6}`].v,
          t:db[`C${i+6}`].v,
          v:db[`C${i+6}`].v,
          w:db[`C${i+6}`].v,
        }
        let apellidoMaterno = {
          f:"",
          h:db[`D${i+6}`].v,
          t:db[`D${i+6}`].v,
          v:db[`D${i+6}`].v,
          w:db[`D${i+6}`].v,
        }
        let primerNombre = {
          f:"",
          h:db[`E${i+6}`].v,
          t:db[`E${i+6}`].v,
          v:db[`E${i+6}`].v,
          w:db[`E${i+6}`].v,

        }
        sheet.C85 = apellidoPaterno
        sheet.C111 = apellidoPaterno
        
        sheet.H85 = apellidoMaterno
        sheet.H111 = apellidoMaterno

        sheet.M85 = primerNombre
        sheet.M111 = primerNombre
        
     }
   
   
   function getNumCalle(sheet,db,i){
    let direccionRawStr = db[`AA${i+6}`].v
    let separatedArr = direccionRawStr.split(/[, ]+/)

    let numeroStr = separatedArr.filter(e=>{    
        return e.includes("Num")
    })
    return numeroStr[0]
   }

   function getCalleStr(sheet,db,i,numeroStr){
    let direccionRawStr = db[`AA${i+6}`].v
    let separatedArr = direccionRawStr.split(/[, ]+/)
    let index = separatedArr.indexOf(numeroStr)
    let calleArr = separatedArr.slice(index+1)
    let calle = calleArr.join(" ")
    return calle    
   }
   function getColonia(sheet,db,i,numeroStr){
    let direccionRawStr = db[`AA${i+6}`].v
    let colonia = direccionRawStr.split(numeroStr)[0]
    return colonia
   }

   function assignDireccionValues (sheet,db, i) {
    let numeroStr = getNumCalle(sheet,db,i)
    let calleStr = getCalleStr(sheet,db,i,numeroStr)
    let colonia = getColonia(sheet,db,i,numeroStr)


    let numeroObj = {
    f:"",
    h:numeroStr,
    t:numeroStr,
    v:numeroStr,
    w:numeroStr,
    }
 
    let calleObj = {
      f:"",
      h:calleStr,
      t:calleStr,
      v:calleStr,
      w:calleStr,
    }

    let coloniaObj = {
      f:"",
      h:colonia,
      t:colonia,
      v:colonia,
      w:colonia,
    }
    // let numero = sheet.M25 
    // let colonia = sheet.D25
    // let calle = sheet.O25 
    sheet.M25 = numeroObj
    sheet.D25 = coloniaObj
    sheet.O25 = calleObj 
   }


   function mainLoop() {
    let sheets = Object.entries(kardex.Sheets).reverse()
    for(let i =1 ;i<44; i++ ){
      let sheet = sheets[i][1]   
      let db = sheets[sheets.length-1][1]
      if(db[`C${i+6}`] == undefined){
          break
      }
      setNames(sheet, db, i)
      assignDireccionValues(sheet, db, i)
    }

    kardex.Sheets = Object.fromEntries(sheets)
    XLSX.writeFile(kardex, 'KARDEX MODIFICADO.xlsx', {type: 'file'});
  }


   function changeMaterias() {

   }

   



  return (
    <>

    <p className="text-4xl font-bold">selecciona cardex</p>
    <form >
    <div>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    {/* <input type="file" id="kardex" onChange={(e)=>{handleChange(e)}}></input> */}
    <PdfMaker />
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    </div>
    {/* <input type="submit"></input> */}
    </form>
    <button className="border-4 border-red-600 font-bold" onClick={()=>mainLoop()}>DESCARGA ARCHIVO</button>
    
  
    </>
  )
}
