const express = require("express")
const app = express()
const port = 3004
const path = require("path")
const fs = require("fs").promises
const axios = require("axios")



app.use(express.json())
app.use(express.urlencoded({extended: true}))

const api = "http://localhost:3001/dados"

app.get("/", async (req, res)=>{
    try {
        const oHtml = path.join(__dirname,  "escrevendo.html")

        const response = await axios.get(`${api}?t=${Date.now()}`)
        const apiData = response.data

        let tables = ""

        apiData.forEach(livros => {
            //const valorObjts = livros.valor.toFixed(2).replace('.',',')

            tables += `
            
                <tr>
                
                    <td>${livros.livro}</td>
                    <td>${livros.valor}</td>
                
                </tr>
            
            `
        });

        const tabelaRenderizar = `
        
            <table>
            
                <thead>
                    <tr>
                        <th>
                            livros
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${tables}
                </tbody>
            
            </table>
        
        `

        let templateDeLivros = await fs.readFile( oHtml, "utf-8")
        const htmlrenderizarHtml = templateDeLivros.replace( '<--aqui_vai_dados-->', tabelaRenderizar)

        res.send(htmlrenderizarHtml)

    } catch (error) {
        res.status(500).send(`
        <h1>Erro 500</h1>
        <p>erro interno: ${error.message}
         
        `)
    }
})



app.listen(port, ()=>{
    console.log(`testando API ${port}`)
})