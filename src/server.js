const { response, request } = require('express')
const express = require('express')
const ejs = require ('ejs')
const path = require('path')
const puppeteer = require('puppeteer')
// const pdf = require('html-pdf')
const app = express()

const passengers = [
    {
        name: "Joyse",
        flightNumber: 7859,
        time: "18h00",
    },
    {
        name: "Brock",
        flightNumber: 7860,
        time: "18h00",
    },
    {
        name: "Eve",
        flightNumber: 7861,
        time: "18h00",
    },

];

app.get('/pdf', async(request, response) => {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('http://localhost:3000/', {
        waitUntil: 'networkidle0'
    })

    const pdf = await page.pdf({
        printBackground: true,
        format: 'letter',
        margin: {
            top: '20px',
            bottom: "40px",
            left: "20px",
            right: "20px"
        }
    })

    await browser.close()

    response.contentType("aplication/pdf")

    return response.send(pdf)
})

app.get('/', (request, response) => {

    const filePath = path.join(__dirname, "print.ejs")
    ejs.renderFile(filePath, { passengers }, (err, html) =>{
        if(err) {
            return response.send('Erro na leiltura do arquuivo')
        }

        // const options = {
        //     height: "11.25in",
        //     width: "8.5in",
        //     header: {
        //         height: "20mm",
        //     },
        //     footer: {
        //         height: "20mm",
        //     }
        // }

        // pdf.create(html, options).toFile("Report.pdf", (err, data) =>{
        //     if (err) {
        //         return response.send("Erro ao gerar o PDF")
        //     }

            return response.send(html)
        // })
    })
})

app.listen(3000)