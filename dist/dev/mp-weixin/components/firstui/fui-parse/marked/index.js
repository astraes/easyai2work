"use strict";
var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
  nptable: noop,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: "^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?\\?>\\n*|<![A-Z][\\s\\S]*?>\\n*|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$))",
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  table: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,
  text: /^[^\n]+/
};
block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def).replace("label", block._label).replace("title", block._title).getRegex();
block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = edit(block.item, "gm").replace(/bull/g, block.bullet).getRegex();
block.list = edit(block.list).replace(/bull/g, block.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block.def.source + ")").getRegex();
block._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
block._comment = /<!--(?!-?>)[\s\S]*?-->/;
block.html = edit(block.html, "i").replace("comment", block._comment).replace("tag", block._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
block.paragraph = edit(block.paragraph).replace("hr", block.hr).replace("heading", block.heading).replace("lheading", block.lheading).replace("tag", block._tag).getRegex();
block.blockquote = edit(block.blockquote).replace("paragraph", block.paragraph).getRegex();
block.normal = merge({}, block);
block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});
block.gfm.paragraph = edit(block.paragraph).replace("(?!", "(?!" + block.gfm.fences.source.replace("\\1", "\\2") + "|" + block.list.source.replace("\\1", "\\3") + "|").getRegex();
block.tables = merge({}, block.gfm, {
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
});
block.pedantic = merge({}, block.normal, {
  html: edit(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", block._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/
});
function Lexer(options) {
  this.tokens = [];
  this.tokens.links = /* @__PURE__ */ Object.create(null);
  this.options = options || marked.defaults;
  this.rules = block.normal;
  if (this.options.pedantic) {
    this.rules = block.pedantic;
  } else if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}
Lexer.rules = block;
Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};
Lexer.prototype.lex = function(src) {
  src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n");
  return this.token(src, true);
};
Lexer.prototype.token = function(src, top) {
  src = src.replace(/^ +$/gm, "");
  var next, loose, cap, bull, b, item, listStart, listItems, t, space, i, tag, l, isordered, istask, ischecked;
  while (src) {
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: "space"
        });
      }
    }
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, "");
      this.tokens.push({
        type: "code",
        text: !this.options.pedantic ? rtrim(cap, "\n") : cap
      });
      continue;
    }
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: "code",
        lang: cap[2],
        text: cap[3] || ""
      });
      continue;
    }
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: "heading",
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }
    if (top && (cap = this.rules.nptable.exec(src))) {
      item = {
        type: "table",
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
        align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : []
      };
      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);
        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = "right";
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = "center";
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = "left";
          } else {
            item.align[i] = null;
          }
        }
        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = splitCells(item.cells[i], item.header.length);
        }
        this.tokens.push(item);
        continue;
      }
    }
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: "hr"
      });
      continue;
    }
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: "blockquote_start"
      });
      cap = cap[0].replace(/^ *> ?/gm, "");
      this.token(cap, top);
      this.tokens.push({
        type: "blockquote_end"
      });
      continue;
    }
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];
      isordered = bull.length > 1;
      listStart = {
        type: "list_start",
        ordered: isordered,
        start: isordered ? +bull : "",
        loose: false
      };
      this.tokens.push(listStart);
      cap = cap[0].match(this.rules.item);
      listItems = [];
      next = false;
      l = cap.length;
      i = 0;
      for (; i < l; i++) {
        item = cap[i];
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, "");
        if (~item.indexOf("\n ")) {
          space -= item.length;
          item = !this.options.pedantic ? item.replace(new RegExp("^ {1," + space + "}", "gm"), "") : item.replace(/^ {1,4}/gm, "");
        }
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join("\n") + src;
            i = l - 1;
          }
        }
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === "\n";
          if (!loose)
            loose = next;
        }
        if (loose) {
          listStart.loose = true;
        }
        istask = /^\[[ xX]\] /.test(item);
        ischecked = void 0;
        if (istask) {
          ischecked = item[1] !== " ";
          item = item.replace(/^\[[ xX]\] +/, "");
        }
        t = {
          type: "list_item_start",
          task: istask,
          checked: ischecked,
          loose
        };
        listItems.push(t);
        this.tokens.push(t);
        this.token(item, false);
        this.tokens.push({
          type: "list_item_end"
        });
      }
      if (listStart.loose) {
        l = listItems.length;
        i = 0;
        for (; i < l; i++) {
          listItems[i].loose = true;
        }
      }
      this.tokens.push({
        type: "list_end"
      });
      continue;
    }
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize ? "paragraph" : "html",
        pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
        text: cap[0]
      });
      continue;
    }
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      if (cap[3])
        cap[3] = cap[3].substring(1, cap[3].length - 1);
      tag = cap[1].toLowerCase().replace(/\s+/g, " ");
      if (!this.tokens.links[tag]) {
        this.tokens.links[tag] = {
          href: cap[2],
          title: cap[3]
        };
      }
      continue;
    }
    if (top && (cap = this.rules.table.exec(src))) {
      item = {
        type: "table",
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
        align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/(?: *\| *)?\n$/, "").split("\n") : []
      };
      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);
        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = "right";
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = "center";
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = "left";
          } else {
            item.align[i] = null;
          }
        }
        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = splitCells(
            item.cells[i].replace(/^ *\| *| *\| *$/g, ""),
            item.header.length
          );
        }
        this.tokens.push(item);
        continue;
      }
    }
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: "heading",
        depth: cap[2] === "=" ? 1 : 2,
        text: cap[1]
      });
      continue;
    }
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: "paragraph",
        text: cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1]
      });
      continue;
    }
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: "text",
        text: cap[0]
      });
      continue;
    }
    if (src) {
      throw new Error("Infinite loop on byte: " + src.charCodeAt(0));
    }
  }
  return this.tokens;
};
var inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
  tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
  // CDATA section
  link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  strong: /^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
  em: /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
};
inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink).replace("scheme", inline._scheme).replace("email", inline._email).getRegex();
inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
inline.tag = edit(inline.tag).replace("comment", block._comment).replace("attribute", inline._attribute).getRegex();
inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/;
inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f\\]*\)|[^\s\x00-\x1f()\\])*?)/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
inline.link = edit(inline.link).replace("label", inline._label).replace("href", inline._href).replace("title", inline._title).getRegex();
inline.reflink = edit(inline.reflink).replace("label", inline._label).getRegex();
inline.normal = merge({}, inline);
inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
  link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", inline._label).getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline._label).getRegex()
});
inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace("])", "~|])").getRegex(),
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("email", inline._email).getRegex(),
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~+(?=\S)([\s\S]*?\S)~+/,
  text: edit(inline.text).replace("]|", "~]|").replace("|", "|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&'*+/=?^_`{\\|}~-]+@|").getRegex()
});
inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace("{2,}", "*").getRegex(),
  text: edit(inline.gfm.text).replace("{2,}", "*").getRegex()
});
function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer();
  this.renderer.options = this.options;
  if (!this.links) {
    throw new Error("Tokens array requires a `links` property.");
  }
  if (this.options.pedantic) {
    this.rules = inline.pedantic;
  } else if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  }
}
InlineLexer.rules = inline;
InlineLexer.output = function(src, links, options) {
  var inline2 = new InlineLexer(links, options);
  return inline2.output(src);
};
InlineLexer.prototype.output = function(src) {
  var out = "", link, text, href, title, cap, prevCapZero;
  while (src) {
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === "@") {
        text = escape(this.mangle(cap[1]));
        href = "mailto:" + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      do {
        prevCapZero = cap[0];
        cap[0] = this.rules._backpedal.exec(cap[0])[0];
      } while (prevCapZero !== cap[0]);
      src = src.substring(cap[0].length);
      if (cap[2] === "@") {
        text = escape(cap[0]);
        href = "mailto:" + text;
      } else {
        text = escape(cap[0]);
        if (cap[1] === "www.") {
          href = "http://" + text;
        } else {
          href = text;
        }
      }
      out += this.renderer.link(href, null, text);
      continue;
    }
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
      continue;
    }
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      href = cap[2];
      if (this.options.pedantic) {
        link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
        if (link) {
          href = link[1];
          title = link[3];
        } else {
          title = "";
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim().replace(/^<([\s\S]*)>$/, "$1");
      out += this.outputLink(cap, {
        href: InlineLexer.escapes(href),
        title: InlineLexer.escapes(title)
      });
      this.inLink = false;
      continue;
    }
    if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, " ");
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }
    if (src) {
      throw new Error("Infinite loop on byte: " + src.charCodeAt(0));
    }
  }
  return out;
};
InlineLexer.escapes = function(text) {
  return text ? text.replace(InlineLexer.rules._escapes, "$1") : text;
};
InlineLexer.prototype.outputLink = function(cap, link) {
  var href = link.href, title = link.title ? escape(link.title) : null;
  return cap[0].charAt(0) !== "!" ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
};
InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants)
    return text;
  return text.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
};
InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle)
    return text;
  var out = "", l = text.length, i = 0, ch;
  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = "x" + ch.toString(16);
    }
    out += "&#" + ch + ";";
  }
  return out;
};
function Renderer(options) {
  this.options = options || marked.defaults;
}
Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }
  if (!lang) {
    return "<pre><code>" + (escaped ? code : escape(code, true)) + "</code></pre>";
  }
  return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + "</code></pre>\n";
};
Renderer.prototype.blockquote = function(quote) {
  return "<blockquote>\n" + quote + "</blockquote>\n";
};
Renderer.prototype.html = function(html) {
  return html;
};
Renderer.prototype.heading = function(text, level, raw) {
  if (this.options.headerIds) {
    return "<h" + level + ' id="' + this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, "-") + '">' + text + "</h" + level + ">\n";
  }
  return "<h" + level + ">" + text + "</h" + level + ">\n";
};
Renderer.prototype.hr = function() {
  return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
};
Renderer.prototype.list = function(body, ordered, start) {
  var type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
  return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
};
Renderer.prototype.listitem = function(text) {
  return "<li>" + text + "</li>\n";
};
Renderer.prototype.checkbox = function(checked) {
  return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
};
Renderer.prototype.paragraph = function(text) {
  return "<p>" + text + "</p>\n";
};
Renderer.prototype.table = function(header, body) {
  if (body)
    body = "<tbody>" + body + "</tbody>";
  return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
};
Renderer.prototype.tablerow = function(content) {
  return "<tr>\n" + content + "</tr>\n";
};
Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? "th" : "td";
  var tag = flags.align ? "<" + type + ' align="' + flags.align + '">' : "<" + type + ">";
  return tag + content + "</" + type + ">\n";
};
Renderer.prototype.strong = function(text) {
  return "<strong>" + text + "</strong>";
};
Renderer.prototype.em = function(text) {
  return "<em>" + text + "</em>";
};
Renderer.prototype.codespan = function(text) {
  return "<code>" + text + "</code>";
};
Renderer.prototype.br = function() {
  return this.options.xhtml ? "<br/>" : "<br>";
};
Renderer.prototype.del = function(text) {
  return "<del>" + text + "</del>";
};
Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, "").toLowerCase();
    } catch (e) {
      return text;
    }
    if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf(
      "data:"
    ) === 0) {
      return text;
    }
  }
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e) {
    return text;
  }
  var out = '<a href="' + escape(href) + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += ">" + text + "</a>";
  return out;
};
Renderer.prototype.image = function(href, title, text) {
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? "/>" : ">";
  return out;
};
Renderer.prototype.text = function(text) {
  return text;
};
function TextRenderer() {
}
TextRenderer.prototype.strong = TextRenderer.prototype.em = TextRenderer.prototype.codespan = TextRenderer.prototype.del = TextRenderer.prototype.text = function(text) {
  return text;
};
TextRenderer.prototype.link = TextRenderer.prototype.image = function(href, title, text) {
  return "" + text;
};
TextRenderer.prototype.br = function() {
  return "";
};
function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer();
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}
Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};
Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  this.inlineText = new InlineLexer(
    src.links,
    merge({}, this.options, {
      renderer: new TextRenderer()
    })
  );
  this.tokens = src.reverse();
  var out = "";
  while (this.next()) {
    out += this.tok();
  }
  return out;
};
Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};
Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};
Parser.prototype.parseText = function() {
  var body = this.token.text;
  while (this.peek().type === "text") {
    body += "\n" + this.next().text;
  }
  return this.inline.output(body);
};
Parser.prototype.tok = function() {
  switch (this.token.type) {
    case "space": {
      return "";
    }
    case "hr": {
      return this.renderer.hr();
    }
    case "heading": {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        unescape(this.inlineText.output(this.token.text))
      );
    }
    case "code": {
      return this.renderer.code(
        this.token.text,
        this.token.lang,
        this.token.escaped
      );
    }
    case "table": {
      var header = "", body = "", i, row, cell, j;
      cell = "";
      for (i = 0; i < this.token.header.length; i++) {
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          {
            header: true,
            align: this.token.align[i]
          }
        );
      }
      header += this.renderer.tablerow(cell);
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];
        cell = "";
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            {
              header: false,
              align: this.token.align[j]
            }
          );
        }
        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case "blockquote_start": {
      body = "";
      while (this.next().type !== "blockquote_end") {
        body += this.tok();
      }
      return this.renderer.blockquote(body);
    }
    case "list_start": {
      body = "";
      var ordered = this.token.ordered, start = this.token.start;
      while (this.next().type !== "list_end") {
        body += this.tok();
      }
      return this.renderer.list(body, ordered, start);
    }
    case "list_item_start": {
      body = "";
      var loose = this.token.loose;
      if (this.token.task) {
        body += this.renderer.checkbox(this.token.checked);
      }
      while (this.next().type !== "list_item_end") {
        body += !loose && this.token.type === "text" ? this.parseText() : this.tok();
      }
      return this.renderer.listitem(body);
    }
    case "html": {
      return this.renderer.html(this.token.text);
    }
    case "paragraph": {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case "text": {
      return this.renderer.paragraph(this.parseText());
    }
  }
};
function escape(html, encode) {
  return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function unescape(html) {
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === "colon")
      return ":";
    if (n.charAt(0) === "#") {
      return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
    }
    return "";
  });
}
function edit(regex, opt) {
  regex = regex.source || regex;
  opt = opt || "";
  return {
    replace: function(name, val) {
      val = val.source || val;
      val = val.replace(/(^|[^\[])\^/g, "$1");
      regex = regex.replace(name, val);
      return this;
    },
    getRegex: function() {
      return new RegExp(regex, opt);
    }
  };
}
function resolveUrl(base, href) {
  if (!baseUrls[" " + base]) {
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[" " + base] = base + "/";
    } else {
      baseUrls[" " + base] = rtrim(base, "/", true);
    }
  }
  base = baseUrls[" " + base];
  if (href.slice(0, 2) === "//") {
    return base.replace(/:[\s\S]*/, ":") + href;
  } else if (href.charAt(0) === "/") {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, "$1") + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function noop() {
}
noop.exec = noop;
function merge(obj) {
  var i = 1, target, key;
  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }
  return obj;
}
function splitCells(tableRow, count) {
  var row = tableRow.replace(/\|/g, function(match, offset, str) {
    var escaped = false, curr = offset;
    while (--curr >= 0 && str[curr] === "\\")
      escaped = !escaped;
    if (escaped) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(/ \|/), i = 0;
  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count)
      cells.push("");
  }
  for (; i < cells.length; i++) {
    cells[i] = cells[i].trim().replace(/\\\|/g, "|");
  }
  return cells;
}
function rtrim(str, c, invert) {
  if (str.length === 0) {
    return "";
  }
  var suffLen = 0;
  while (suffLen < str.length) {
    var currChar = str.charAt(str.length - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.substr(0, str.length - suffLen);
}
function marked(src, opt, callback) {
  if (typeof src === "undefined" || src === null) {
    throw new Error("marked(): input parameter is undefined or null");
  }
  if (typeof src !== "string") {
    throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
  }
  if (callback || typeof opt === "function") {
    if (!callback) {
      callback = opt;
      opt = null;
    }
    opt = merge({}, marked.defaults, opt || {});
    var highlight = opt.highlight, tokens, pending, i = 0;
    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }
    pending = tokens.length;
    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }
      var out;
      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }
      opt.highlight = highlight;
      return err ? callback(err) : callback(null, out);
    };
    if (!highlight || highlight.length < 3) {
      return done();
    }
    delete opt.highlight;
    if (!pending)
      return done();
    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== "code") {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err)
            return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }
    return;
  }
  try {
    if (opt)
      opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += "\nPlease report this to https://github.com/markedjs/marked.";
    if ((opt || marked.defaults).silent) {
      return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
    }
    throw e;
  }
}
marked.options = marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};
marked.getDefaults = function() {
  return {
    baseUrl: null,
    breaks: false,
    gfm: true,
    headerIds: true,
    headerPrefix: "",
    highlight: null,
    langPrefix: "language-",
    mangle: true,
    pedantic: false,
    renderer: new Renderer(),
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    tables: true,
    xhtml: false
  };
};
marked.defaults = marked.getDefaults();
marked.Parser = Parser;
marked.parser = Parser.parse;
marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;
marked.Lexer = Lexer;
marked.lexer = Lexer.lex;
marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;
marked.parse = marked;
exports.marked = marked;
