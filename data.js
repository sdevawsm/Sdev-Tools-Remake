window.pageData = {
  signin: {
    nome: "João",
    tipo: "admin",
    logado: true,
    mostrarCard: true,
    produtos: ["Caneta", "Caderno", "Lápis"]
  },
  login: {
    nome: "Maria",
    tipo: "user",
    logado: false,
    mostrarCard: false
  },
  theme: {
    mostrarEquipe: true, // controla se a equipe será exibida
    equipe: ['ana', 'bruno', 'carla'], // lista de membros da equipe
    nomeEmpresa: 'TechNova', // exemplo de variável para exibir no texto
    tipo: 'visitante' // usado em @switch para personalizar a mensagem
  }
};


window.pageConfig = {
  configured: false,
  tema: "escuro",
  corPrimaria: "#1abc9c",
  fonte: "Roboto",
  mostrarRodape: true
};
