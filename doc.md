1. Carrega dados e arquivos
2. Aplica includes, extends, sections
3. Aplica lógica: @if, @foreach
4. Substitui variáveis
5. Armazena resultado em cache
6. Renderiza ou exporta


Boa pergunta, Antonio — e você está absolutamente certo em apontar isso. A estrutura que eu te mostrei visualmente estava formatada como se fosse Markdown, mas não foi encapsulada corretamente dentro do bloco de código markdown, o que fez com que se perdesse a hierarquia e os títulos como ## Organização dos Dados ou ## Sintaxe e Funcionalidades não aparecessem como deveriam.

Vamos corrigir isso agora com um arquivo completo e bem formatado em Markdown, incluindo todos os títulos, seções e exemplos. Aqui está o conteúdo ideal para o seu README.md:

# 🧪 Compilador de Páginas HTML Dinâmicas

Este projeto é um **compilador client-side em JavaScript** que permite montar páginas HTML dinamicamente com base em layouts, componentes reutilizáveis e dados personalizados. Ele simula funcionalidades de motores de template como Blade (Laravel) ou Twig (Symfony), mas funciona diretamente no navegador.

---

## 📁 Estrutura de Diretórios Recomendada

```plaintext
/project-root
│
├── pages/           → Páginas principais (ex: home.html, contato.html)
│   └── home.html
│
├── layouts/         → Layouts base com @yield para seções
│   └── default.html
│
├── components/      → Componentes reutilizáveis (ex: navbar, footer)
│   └── navbar.html
│   └── footer.html
│
├── data.js          → Objeto window.pageData com dados por página
└── index.html       → Entrada principal que carrega o compilador

📦 Organização dos Dados

Os dados são definidos no objeto global window.pageData, com cada chave representando uma página:

window.pageData = {
  home: {
    title: "Bem-vindo",
    user: "Antonio",
    produtos: ["Arroz", "Feijão", "Macarrão"],
    isLoggedIn: true,
    categoria: "alimentos"
  },
  contato: {
    email: "contato@exemplo.com",
    telefone: "1234-5678"
  }
};

🧩 Sintaxe e Funcionalidades

1. Extensão de Layout

@extends('default')

Indica que a página estende um layout base localizado em layouts/default.html.

2. Seções e Yield

Layout (layouts/default.html)

<html>
  <head><title>{{ title }}</title></head>
  <body>
    @yield('header')
    @yield('content')
    @yield('footer')
  </body>
</html>

Página (pages/home.html)

@extends('default')

@section('header')
  @include('navbar')
@endsection

@section('content')
  <h1>{{ user | capitalize }}</h1>
  @if(isLoggedIn)
    <p>Você está logado.</p>
  @endif
  @foreach(produtos as item)
    <li>{{ item }}</li>
  @endforeach
@endsection

@section('footer')
  @include('footer')
@endsection

3. Includes

@include('navbar')  → Insere o conteúdo de components/navbar.html

4. Variáveis

{{ title }}         → Substitui pela variável `title` da página

5. Filtros

{{ user | upper }}       → Transforma em maiúsculas
{{ user | lower }}       → Transforma em minúsculas
{{ user | capitalize }}  → Primeira letra maiúscula
{{ produtos | length }}  → Tamanho da lista

6. Condicionais

@if(isLoggedIn)
  <p>Bem-vindo!</p>
@endif

@unless(isLoggedIn)
  <p>Por favor, faça login.</p>
@endunless

7. Switch/Case

@switch(categoria)
  @case('alimentos')
    <p>Categoria: Alimentos</p>
  @break
  @case('bebidas')
    <p>Categoria: Bebidas</p>
  @break
  @default
    <p>Categoria desconhecida</p>
  @break
@endswitch

8. Loops

@foreach(produtos as item)
  <li>{{ item }}</li>
@endforeach

⚠️ Dicas de Segurança e Evolução

Evite usar eval diretamente para condicionais. Considere implementar um parser seguro.

Modularize o compilador em arquivos JS separados para facilitar manutenção.

Adicione suporte a includes dinâmicos com base em variáveis.

Implemente cache persistente com localStorage para otimizar carregamento.

Considere adicionar suporte a escopo de variáveis por seção ou componente.

🚀 Como Usar

Crie seus arquivos HTML nas pastas pages, layouts e components.

Defina os dados em window.pageData no data.js.

Acesse a página com ?page=home ou outro nome.

O compilador monta e renderiza o HTML dinamicamente no document.body.

Feito com 💡 e JavaScript.


---

Agora sim, tudo está encapsulado corretamente dentro do bloco `markdown`, com os títulos e seções visíveis e funcionais. Se quiser, posso te ajudar a transformar isso em uma documentação interativa ou gerar uma versão multilíngue. É só dizer.