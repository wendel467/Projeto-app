const express = require("express");
const clienteRoutes = require("./routes/clienteRoutes");
const vendedorRoutes = require("./routes/vendedorRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");

const app = express();
const APP_PORT = process.env.APP_PORT || 3000;

app.use(express.json());

app.get("/", (req,res) => res.send("Tudo rodando certinho"));

// Usando as rotas
app.use("/clientes", clienteRoutes);
app.use("/vendedor", vendedorRoutes);
app.use("/relatorios", relatorioRoutes);

app.listen(APP_PORT, () => {
    console.log(`API em execução na porta ${APP_PORT}.`);
    console.log(`Acesse a url http://localhost:${APP_PORT}`);
});
