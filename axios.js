const express = require("express")
const app = express()
const port = 3002
const path = require("path")
const axios =  require("axios")
const fs = require("fs").promises



app.use(express.json())
app.use(express.urlencoded({extended: true}))

const api = "http://localhost:3001/dados"


 /*app.get("/", async (req, res)=>{
    try {
        const response = await axios.get(api)
        dataApi = response.data

        res.send(`<h2>Servidor Consumidor (3002)</h2>
        <p>Dados recebidos da API (3001):</p>
        <pre>${JSON.stringify(dataApi, null, 2)}</pre>`)

        
    } catch (error) {
        console.log(error)
        res.status(500).send('Erro ao consumir a API.');
    }
 })*/

 app.get("/", async(req, res)=>{
    try {
         const sendHtml1 = path.join(__dirname,  "index.html")

         

         const response = await axios.get(`${api}?t=${Date.now()}`);
         //const response = await axios.get(api)//a original
         const dataApi = response.data

         let tabelaRows = ''

         dataApi.forEach(item => {
            const valorFormatado = item.valor.toFixed(2).replace('.',',')

            tabelaRows += `
                <tr>
                    <td>${item.livro}</td>
                    <td>${valorFormatado}</td>
                </tr>
            `

         });

         const tabelaCompleta = `
            <table>
                <thead>
                    <tr>
                        <th>
                            Livro
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${tabelaRows}
                </tbody>
            </table>
         `
         //const ninguem = ''

         let templateHtml2 = await fs.readFile(sendHtml1, 'utf-8')
         const htmlrenderizar =  templateHtml2.replace( '<--dados-da-api-->', tabelaCompleta )
         

         res.send(htmlrenderizar)

    } catch (error) {
        res.status(500).send(`
            <h1>Erro 500</h1>
            <p>erro interno: ${error.message}
             
            `)
    }
   


    //res.sendFile(sendHtml1)
 })



app.listen(port, ()=>{
    console.log(`${port} rodando Apicosumebase`)
    console.log(api)
})