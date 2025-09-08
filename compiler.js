(async function compilePage() {
  const dirs = {
    page: "pages/",
    layout: "layouts/",
    component: "components/"
  };
  const data = window.pageData || {};
  const cache = {};

  const urlParams = new URLSearchParams(window.location.search);
  const pageName = urlParams.get("page") || "home";

  async function fetchFile(path) {
    if (cache[path]) return cache[path];
    try {
      const res = await fetch(path);
      const text = await res.text();
      cache[path] = text;
      console.log(`📄 Arquivo carregado: ${path} (${text.length} chars)`);
      return text;
    } catch {
      console.warn(`❌ Arquivo não encontrado: ${path}`);
      return "";
    }
  }

  function extractSections(html) {
    const sections = {};
    html = html.replace(/@section\(['"](.+?)['"]\)([\s\S]*?)@endsection/g, (_, name, content) => {
      sections[name] = content.trim();
      return "";
    });
    return { html, sections };
  }

  function injectSections(layout, sections) {
    return layout.replace(/@yield\(['"](.+?)['"]\)/g, (_, name) => sections[name] || "");
  }

  function extractSlots(html) {
    const slots = {};
    html = html.replace(/@slot\(['"](.+?)['"]\)([\s\S]*?)@endslot/g, (_, name, content) => {
      slots[name] = content.trim();
      return "";
    });
    return { html, slots };
  }

  async function resolveIncludes(html, vars = {}) {
    const matches = [...html.matchAll(/@include\(['"](.+?)['"](?:,\s*\{([\s\S]*?)\})?\)/g)];
    for (const match of matches) {
      const [fullMatch, path, rawVars] = match;
      console.log("📦 Encontrado @include:", { path, rawVars, vars });

      let localVars = { ...vars };
      let canEval = true;

      if (rawVars) {
        try {
          const scopedFn = new Function("scope", `"use strict"; with(scope) { return ({${rawVars}}); }`);
          const evaluated = scopedFn(vars);
          localVars = { ...vars, ...evaluated };
          console.log("   ➡️ Variáveis avaliadas para include:", localVars);
        } catch (err) {
          console.warn("⏸️ Adiando include porque variáveis não estão no escopo ainda:", rawVars);
          canEval = false;
        }
      }

      // Se não conseguimos avaliar (variável de foreach), deixa o @include intocado
      if (!canEval) continue;

      let comp = await fetchFile(`${dirs.component}${path}.html`);
      console.log("   📑 Conteúdo bruto do componente:", comp);

      comp = await resolveIncludes(comp, localVars);
      comp = applyVariables(comp, localVars);

      console.log("   ✅ Resultado final do include:", comp);

      html = html.replace(fullMatch, comp);
    }
    return html;
  }

  async function resolveComponents(html) {
    const matches = [...html.matchAll(/@component\(['"](.+?)['"]\)([\s\S]*?)@endcomponent/g)];
    for (const match of matches) {
      const compPath = `${dirs.component}${match[1]}.html`;
      let compHtml = await fetchFile(compPath);
      const { html: innerHtml, slots } = extractSlots(match[2]);

      compHtml = await resolveIncludes(compHtml);
      compHtml = injectSections(compHtml, slots);

      html = html.replace(match[0], compHtml);
    }
    return html;
  }

  function applyVariables(html, vars) {
    return html.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
      try {
        const parts = key.split(".");
        let value = vars;
        for (const p of parts) {
          if (value == null) return "";
          value = value[p];
        }
        console.log(`🔧 Substituindo {{${key}}} →`, value);
        return value ?? "";
      } catch (err) {
        console.warn(`⚠️ Erro ao acessar variável: ${key}`, err);
        return "";
      }
    });
  }

  function applyFilters(html, vars) {
    return html.replace(/{{\s*([\w.]+)\s*\|\s*(\w+)\s*}}/g, (_, key, filter) => {
      const parts = key.split(".");
      let value = vars;
      for (const p of parts) {
        if (value == null) break;
        value = value[p];
      }

      switch (filter) {
        case "upper": return String(value).toUpperCase();
        case "lower": return String(value).toLowerCase();
        case "capitalize": return String(value).charAt(0).toUpperCase() + String(value).slice(1);
        case "length": return Array.isArray(value) ? value.length : String(value).length;
        default: return value ?? "";
      }
    });
  }

  async function applyLoopsAsync(html, vars) {
    const foreachRegex = /@foreach\((\w+)\s+as\s+(\w+)\)([\s\S]*?)@endforeach/g;
    const matches = [...html.matchAll(foreachRegex)];

    for (const match of matches) {
      const [fullMatch, listName, itemName, block] = match;
      const list = vars[listName];
      if (!Array.isArray(list)) continue;

      console.log(`🔁 Loop detectado: ${listName} (${list.length} itens) → variável: ${itemName}`);

      const renderedItems = await Promise.all(list.map(async item => {
        const scoped = { ...vars, [itemName]: item };
        console.log(`   🔁 Iterando ${itemName}:`, item);

        let result = block;

        // processa includes pendentes dentro do loop
        const includeMatches = [...result.matchAll(/@include\(['"](.+?)['"](?:,\s*\{([\s\S]*?)\})?\)/g)];
        for (const includeMatch of includeMatches) {
          const [fullInclude, path, rawVars] = includeMatch;
          let localVars = { ...scoped };

          if (rawVars) {
            try {
              const scopedFn = new Function("scope", `"use strict"; with(scope) { return ({${rawVars}}); }`);
              const evaluated = scopedFn(scoped);
              localVars = { ...scoped, ...evaluated };
              console.log(`   📦 Variáveis avaliadas para include(${path}):`, localVars);
            } catch (err) {
              console.warn(`   ❌ Erro ao interpretar variáveis em @include: ${rawVars}`, err);
            }
          }

          let comp = await fetchFile(`${dirs.component}${path}.html`);
          console.log(`   📑 Conteúdo bruto de ${path}:`, comp);

          comp = await resolveIncludes(comp, localVars);
          comp = applyVariables(comp, localVars);
          comp = applyFilters(comp, localVars);

          console.log("   ✅ Resultado final do include:", comp);

          result = result.replace(fullInclude, comp);
        }

        // aplica variáveis/filters no escopo local
        result = applyVariables(result, scoped);
        result = applyFilters(result, scoped);

        console.log(`   📝 Resultado parcial do bloco para ${itemName}:`, result);

        return result;
      }));

      html = html.replace(fullMatch, renderedItems.join(""));
    }

    return html;
  }

  async function compile() {
    let html = await fetchFile(`${dirs.page}${pageName}.html`);
    const vars = data[pageName] || {};
    console.log("🔍 Dados carregados", vars);

    const extendMatch = html.match(/@extends\(['"](.+?)['"]\)/);
    let layout = "";
    if (extendMatch) {
      layout = await fetchFile(`${dirs.layout}${extendMatch[1]}.html`);
      html = html.replace(extendMatch[0], "");
    }

    html = await resolveIncludes(html, vars);
    html = await resolveComponents(html);
    html = await applyLoopsAsync(html, vars);

    const { html: cleanedHtml, sections } = extractSections(html);

    if (layout) {
      layout = await resolveIncludes(layout, vars);
      html = injectSections(layout, sections);
    } else {
      html = cleanedHtml;
    }

    render(html);
  }

  function render(html) {
    //console.log("📤 HTML final compilado:", html);
    document.body.innerHTML = html;
  }

  await compile();
})();
