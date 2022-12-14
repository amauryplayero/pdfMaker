import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import React, {useState} from 'react'
import axios from 'axios'
import fileDownload from 'js-file-download'
import {xCoordinate, yCoordinate} from '../coordinates.js'


export default function PdfMaker() {
    const [pdf, setPdf] = useState()
    async function handleChange(e){
        const file = e.target.files[0]
     
        let pdfDoc = PDFDocument.load(await file.arrayBuffer())
        setPdf(await pdfDoc)
    }


    async function writePdf (e) {
      // try to center the text so that it draw good
      e.preventDefault()
      let text = "hello this is centered"
      let textSize = 12
      const helveticaFont = await pdf.embedFont(StandardFonts.Helvetica);
      const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
      const textHeight = helveticaFont.heightAtSize(textSize);  

      let yCoordinate = function (gimpCoordinate) {
        let remainder = 791 - gimpCoordinate
        return remainder
      }
      let xCoordinate = async function (gimpCoordinate) {
        let textSize = 12
        const helveticaFont = await pdf.embedFont(StandardFonts.Helvetica);
        const textWidth = await helveticaFont.widthOfTextAtSize(text, textSize);
        const coordinate = gimpCoordinate - await textWidth/2
        return coordinate
      }

       let apellidosPaternos = {
        apellidoPaterno1:await {x:await xCoordinate(180), y:await yCoordinate(206), size:12},
        apellidoPaterno2:await {x:await xCoordinate(122), y:await yCoordinate(720), size:12},
        apellidoPaterno3:await {x:await xCoordinate(122), y:await yCoordinate(322), size:12},
        apellidoPaterno4:await {x:await xCoordinate(122), y:await yCoordinate(653), size:12},
        }

        let apellidosMaternos = {
        }

        let apellidoPaterno1 = await {x:await xCoordinate(180), y:await yCoordinate(206), size:12}

        
        let pages = pdf.getPages()
        await pages[0].drawText(text, await apellidosPaternos.apellidoPaterno1)
        await pages[0].drawText(text, await apellidosPaternos.apellidoPaterno2)
        await pages[1].drawText(text, await apellidosPaternos.apellidoPaterno3)
        await pages[1].drawText(text, await apellidosPaternos.apellidoPaterno4)
        const pdfBytes = await pdf.save()
        fileDownload(await pdfBytes, "DELETE PDF")

    }

    
  return (<>
    <div>pdfMaker</div>
    <a onClick={(e)=>{writePdf(e)}}>download pdf</a>
    <input type="file" id="template" onChange={(e)=>{handleChange(e)}}></input>
    </>
  )
}
