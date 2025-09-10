window.pageData = {
	Pages: {
		pages: {
			workspace: {
				config: {
					title: "Área de Trabalho",
					layout: "default",
					requiresAuth: true,
					meta: {
						description: "Página principal do sistema",
						keywords: ["dashboard", "controle", "usuário"]
					}
				},
				data: {
					user: {
						name: "Fulano",
						role: "admin"
					},
					notifications: [],
					settings: {
						theme: "dark",
						language: "pt-BR"
					}
				},
				methods: {
					init() {
						console.log("Página workspace iniciada");
					},
					logout() {
						console.log("Usuário desconectado");
					}
				},
				components: {
					header: "HeaderComponent",
					sidebar: "SidebarComponent",
					footer: "FooterComponent"
				}
			},

			reports: {
				config: {
					title: "Relatórios",
					layout: "reportLayout",
					requiresAuth: true
				},
				data: {
					reportList: [],
					filters: {
						dateRange: null,
						category: null
					}
				},
				methods: {
					loadReports() {
						console.log("Carregando relatórios...");
					}
				},
				components: {
					filterBar: "FilterComponent",
					reportTable: "TableComponent"
				}
			}
		}
	},
	clientes: {
		clientes: [
			{ nome: "Ana Souza", email: "ana@example.com" },
			{ nome: "Carlos Lima", email: "carlos@example.com" },
			{ nome: "Fernanda Rocha", email: "fernanda@example.com" }
		]
	}
};

 


window.pageConfig = {
	configured: false,
	tema: "escuro",
	corPrimaria: "#1abc9c",
	fonte: "Roboto",
	mostrarRodape: true
};



// Arquitetura separada
const vueOptions = {
  data() {
    return {
      status: 'Página carregada com Vue!',
      serviceItems: 8,
	  pages:  window.pageData.Pages.pages.workspace
    };
  },
  methods: {
    exibirStatus() {
      //alert(this.status);
	  console.log(  this.pages )
    },
    incrementar() {
      this.contador++;
    }
  }
};