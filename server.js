const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors")
const port = 3000

const ThermalPrinter = require("node-thermal-printer").printer
const PrinterTypes = require("node-thermal-printer").types

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.post("/receber-dados", (req, res) => {
  var { dados } = req.body

  dados = JSON.parse(dados)

  let pedido = dados.split("-------------------------------")

  dados = ""

  console.log(pedido.length)

  try {
    // Crie uma nova instância do printer para cada pedido
    let printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: "//localhost/golds_printer",
    })

    async function imprimir(pedido) {
      printer.alignCenter()
      await printer.printImage("./logo.png")
      printer.bold(true)
      printer.alignLeft()

      var linhas

      if (pedido.length == 1) {
        linhas = pedido[0].split("\n")
      } else {
        linhas = pedido[1].split("\n")
      }

      for (const linha of linhas) {
        printer.println(linha)
      }

      printer.cut()

      let execute = printer.execute()

      console.log("Print done!")
    }

    imprimir(pedido)

    pedido = []
  } catch (error) {
    console.error("Print failed:", error)
  }

  res.json({ mensagem: "Dados recebidos com sucesso" })
})

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`)
})
