const express = require("express");
const clienteRoutes = require("./routes/clienteRoutes");
const vendedorRoutes = require("./routes/vendedorRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");
const produtosRoutes = require("./routes/produtoRoutes");

const app = express();
const APP_PORT = process.env.APP_PORT || 3000;

app.use(express.json());

app.get("/", (req,res) => res.send("Tudo rodando certinho"));


app.use("/clientes", clienteRoutes);
app.use("/vendedor", vendedorRoutes);
app.use("/relatorios", relatorioRoutes);
app.use("/pedidos",pedidosRoutes);
app.use("/produtos",produtosRoutes);

app.listen(APP_PORT, () => {
    console.log(`API em execução na porta ${APP_PORT}.`);
    console.log(`Acesse a url http://localhost:${APP_PORT}`);
});
