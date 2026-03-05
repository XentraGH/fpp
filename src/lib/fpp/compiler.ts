// F++ Compiler - Converts AST to HTML

import { FPPElement, FPPCompileResult } from './types';

export class FPPCompiler {
  private indentLevel = 0;
  private googleFonts: Set<string> = new Set();
  private customStyles: string[] = [];
  private styleCounter = 0;

  compile(ast: FPPElement): FPPCompileResult {
    this.indentLevel = 0;
    this.googleFonts.clear();
    this.customStyles = [];
    this.styleCounter = 0;

    try {
      let html = this.compileNode(ast);
      
      // Wrap with HTML structure if needed
      if (ast.tagName === 'html' || ast.type === 'root') {
        html = this.wrapHtml(html, ast);
      }

      const css = this.customStyles.join('\n');

      return {
        success: true,
        html: html.trim(),
        css: css.trim(),
        errors: [],
        googleFonts: Array.from(this.googleFonts),
      };
    } catch (error) {
      return {
        success: false,
        html: '',
        css: '',
        errors: [error instanceof Error ? error.message : 'Compilation error'],
        googleFonts: [],
      };
    }
  }

  private compileNode(node: FPPElement): string {
    if (node.type === 'text' && node.content) {
      return this.escapeHtml(node.content);
    }

    const tag = node.tagName;
    const isSelfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr'].includes(tag);

    // Collect Google fonts
    if (node.googleFonts) {
      node.googleFonts.forEach(f => this.googleFonts.add(f));
    }

    // Build attributes
    const attributes = this.buildAttributes(node);
    const attrStr = attributes ? ` ${attributes}` : '';

    // Build content
    let content = node.content || '';
    
    // Compile children
    if (node.children && node.children.length > 0) {
      const childContent = node.children
        .map(child => this.compileNode(child))
        .join('\n');
      content = content ? `${content}\n${childContent}` : childContent;
    }

    // Generate pseudo-class styles
    if (node.pseudoStyles && Object.keys(node.pseudoStyles).length > 0) {
      const className = `fpp-style-${this.styleCounter++}`;
      if (!node.classes) node.classes = [];
      node.classes.push(className);
      
      for (const [pseudo, styles] of Object.entries(node.pseudoStyles)) {
        const styleStr = Object.entries(styles)
          .map(([prop, val]) => `${prop}: ${val}`)
          .join('; ');
        this.customStyles.push(`.${className}:${pseudo} { ${styleStr}; }`);
      }
    }

    // Self-closing tags
    if (isSelfClosing) {
      return `<${tag}${attrStr} />`;
    }

    // Regular tags
    if (content.trim()) {
      return `<${tag}${attrStr}>${content}</${tag}>`;
    }
    
    return `<${tag}${attrStr}></${tag}>`;
  }

  private buildAttributes(node: FPPElement): string {
    const attrs: string[] = [];

    // ID
    if (node.attributes.id) {
      attrs.push(`id="${this.escapeHtml(node.attributes.id)}"`);
    }

    // Classes
    if (node.classes && node.classes.length > 0) {
      attrs.push(`class="${node.classes.join(' ')}"`);
    }

    // Build style string
    const styleStr = Object.entries(node.styles)
      .filter(([_, value]) => value)
      .map(([prop, value]) => `${prop}: ${value}`)
      .join('; ');
    
    if (styleStr) {
      attrs.push(`style="${styleStr}"`);
    }

    // Other attributes
    for (const [key, value] of Object.entries(node.attributes)) {
      if (key !== 'id' && key !== 'style' && key !== 'class') {
        if (value === 'true' || key === value) {
          attrs.push(key);
        } else {
          attrs.push(`${key}="${this.escapeHtml(value)}"`);
        }
      }
    }

    return attrs.join(' ');
  }

  private wrapHtml(content: string, ast: FPPElement): string {
    const googleFontsLinks = Array.from(this.googleFonts)
      .map(font => `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&display=swap" rel="stylesheet">`)
      .join('\n  ');

    const customStyleBlock = this.customStyles.length > 0
      ? `\n  <style>\n  ${this.customStyles.join('\n  ')}\n  </style>`
      : '';

    // Check if content already has html/head/body tags
    if (content.includes('<html')) {
      return content;
    }

    // Extract title from AST
    const titleElement = this.findChildByTag(ast, 'title');
    const title = titleElement?.content || 'F++ Document';

    // Extract meta tags
    const metas = this.findChildrenByTag(ast, 'meta');
    const metaTags = metas.map(m => {
      const attrs = Object.entries(m.attributes)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return `<meta ${attrs} />`;
    }).join('\n  ');

    // Extract body content (elements that aren't head elements)
    const headTags = ['title', 'meta', 'link', 'style', 'script', 'base'];
    const bodyChildren = ast.children?.filter(child => 
      !headTags.includes(child.tagName)
    ) || [];
    
    const bodyContent = bodyChildren.length > 0
      ? bodyChildren.map(child => this.compileNode(child)).join('\n  ')
      : content;

    // Check for existing body tag
    const bodyElement = this.findChildByTag(ast, 'body');
    const bodyAttrs = bodyElement ? this.buildAttributes(bodyElement) : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${metaTags}
  <title>${this.escapeHtml(title)}</title>
  ${googleFontsLinks}
  <style>
    /* F++ Base Styles */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #fff;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    a {
      color: inherit;
      text-decoration: none;
    }
    
    button {
      cursor: pointer;
      border: none;
      background: none;
      font: inherit;
    }
    
    input, textarea, select {
      font: inherit;
    }
  </style>${customStyleBlock}
</head>
<body${bodyAttrs ? ' ' + bodyAttrs : ''}>
  ${bodyContent}
</body>
</html>`;
  }

  private findChildByTag(node: FPPElement, tag: string): FPPElement | undefined {
    if (node.tagName === tag) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = this.findChildByTag(child, tag);
        if (found) return found;
      }
    }
    return undefined;
  }

  private findChildrenByTag(node: FPPElement, tag: string): FPPElement[] {
    const results: FPPElement[] = [];
    if (node.tagName === tag) results.push(node);
    if (node.children) {
      for (const child of node.children) {
        results.push(...this.findChildrenByTag(child, tag));
      }
    }
    return results;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

export const createCompiler = () => new FPPCompiler();
