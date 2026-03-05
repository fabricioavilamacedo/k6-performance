export function generateProduct() {

  const id = Math.floor(Math.random() * 100000);

  return {
    nome: `Produto Teste ${id}`,
    preco: 100,
    descricao: "Produto criado em teste de performance",
    quantidade: 10
  };
}