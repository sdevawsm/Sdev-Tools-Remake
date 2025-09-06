(async function compilePage() {
  const dirs = {
    page: 'pages/',
    layout: 'layouts/',
    component: 'components/'
  };
  const data = window.pageData || {};
  const cache = {};

  // Obter página da URL
  const urlParams = new URLSearchParams(window.location.search);
  const pageName = urlParams.get('page') || 'home';

  async function fetchFile(path) {
    if (cache[path]) return cache[path];
    try {
      const res = await fetch(path);
      const text = await res.text();
      cache[path] = text;
      return text;
    } catch {
      console.warn(`Arquivo não encontrado: ${path}`);
      return '';
    }
  }

  async function resolveIncludes(html) {
    const matches = [...html.matchAll(/@include\(['"](.+?)['"]\)/g)];
    for (const match of matches) {
      const comp = await fetchFile(`${dirs.component}${match[1]}.html`);
      html = html.replace(match[0], comp);
    }
    return html;
  }

  function extractSections(html) {
    const sections = {};
    html = html.replace(/@section\(['"](.+?)['"]\)([\s\S]*?)@endsection/g, (_, name, content) => {
      sections[name] = content.trim();
      return '';
    });
    return { html, sections };
  }

  function injectSections(layout, sections) {
    return layout.replace(/@yield\(['"](.+?)['"]\)/g, (_, name) => sections[name] || '');
  }

  function applyVariables(html, vars) {
    return html.replace(/{{\s*(\w+)\s*}}/g, (_, key) => vars[key] ?? '');
  }

  function applyFilters(html, vars) {
    return html.replace(/{{\s*(\w+)\s*\|\s*(\w+)\s*}}/g, (_, key, filter) => {
      const value = vars[key];
      switch (filter) {
        case 'upper': return String(value).toUpperCase();
        case 'lower': return String(value).toLowerCase();
        case 'capitalize': return String(value).charAt(0).toUpperCase() + String(value).slice(1);
        case 'length': return Array.isArray(value) ? value.length : String(value).length;
        default: return value ?? '';
      }
    });
  }

  function applyConditionals(html, vars) {
    return html.replace(/@if\((.*?)\)([\s\S]*?)@endif/g, (_, condition, content) => {
      try {
        return eval(`vars.${condition}`) ? content : '';
      } catch {
        return '';
      }
    });
  }

  function applyUnless(html, vars) {
    return html.replace(/@unless\((.*?)\)([\s\S]*?)@endunless/g, (_, condition, content) => {
      try {
        return !eval(`vars.${condition}`) ? content : '';
      } catch {
        return '';
      }
    });
  }

  function applySwitch(html, vars) {
    return html.replace(/@switch\((.*?)\)([\s\S]*?)@endswitch/g, (_, variable, block) => {
      const value = vars[variable];
      const cases = [...block.matchAll(/@case\(['"]?(.*?)['"]?\)([\s\S]*?)(?=@case|@default|@endswitch|@break)/g)];
      for (const [_, caseValue, caseContent] of cases) {
        if (String(value) === caseValue) return caseContent;
      }
      const defaultMatch = block.match(/@default([\s\S]*?)@break/);
      return defaultMatch ? defaultMatch[1] : '';
    });
  }

  function applyLoops(html, vars) {
    return html.replace(/@foreach\((\w+)\s+as\s+(\w+)\)([\s\S]*?)@endforeach/g, (_, listName, itemName, block) => {
      const list = vars[listName];
      if (!Array.isArray(list)) return '';
      return list.map(item => {
        const scoped = { ...vars, [itemName]: item };
        let result = applyVariables(block, scoped);
        result = applyFilters(result, scoped);
        return result;
      }).join('');
    });
  }

  async function compile() {
    let html = await fetchFile(`${dirs.page}${pageName}.html`);
    const vars = data[pageName] || {};

    const extendMatch = html.match(/@extends\(['"](.+?)['"]\)/);
    let layout = '';
    if (extendMatch) {
      layout = await fetchFile(`${dirs.layout}${extendMatch[1]}.html`);
      html = html.replace(extendMatch[0], '');
    }

    html = await resolveIncludes(html);
    const { html: cleanedHtml, sections } = extractSections(html);

    if (layout) {
      layout = await resolveIncludes(layout);
      html = injectSections(layout, sections);
    } else {
      html = cleanedHtml;
    }

    html = applyConditionals(html, vars);
    html = applyUnless(html, vars);
    html = applySwitch(html, vars);
    html = applyLoops(html, vars);
    html = applyFilters(html, vars);
    html = applyVariables(html, vars);

    render(html);
  }

  function render(html) {
    document.body.innerHTML = html;
  }

  await compile();
})();
