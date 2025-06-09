const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Serviço de relatórios funcionando!' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serviço de relatórios rodando na porta ${port}`);
});