// F++ Decompiler - Converts HTML back to F++ code

import { FPPElement } from './types';

interface HTMLNode {
  type: 'element' | 'text' | 'comment';
  tagName?: string;
  attributes?: Record<string, string>;
  children?: HTMLNode[];
  content?: string;
}

export class FPPDecompiler {
  private indentLevel = 0;
  private indentSize = 2;

  decompile(html: string): string {
    try {
      // Parse HTML to DOM-like structure
      const doc = this.parseHtml(html);
      
      // Convert to F++ code
      return this.nodeToFPP(doc, 0);
    } catch (error) {
      return `// Error decompiling HTML: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private parseHtml(html: string): HTMLNode {
    // Simple HTML parser
    const result: HTMLNode = {
      type: 'element',
      tagName: 'document',
      children: [],
    };

    // Remove DOCTYPE and comments
    let cleanHtml = html
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();

    this.parseNodes(cleanHtml, result);
    return result;
  }

  private parseNodes(html: string, parent: HTMLNode): void {
    const tagRegex = /<(\/?)([\w-]+)([^>]*?)(\/?)>/gs;
    let lastIndex = 0;
    let match;

    const stack: { node: HTMLNode; start: number }[] = [];
    
    while ((match = tagRegex.exec(html)) !== null) {
      const [fullMatch, isClosing, tagName, attrs, isSelfClosing] = match;
      const textBefore = html.slice(lastIndex, match.index).trim();

      // Add text node
      if (textBefore && stack.length > 0) {
        const textContent = textBefore
          .replace(/\s+/g, ' ')
          .trim();
        if (textContent) {
          stack[stack.length - 1].node.children?.push({
            type: 'text',
            content: textContent,
          });
        }
      }

      if (isClosing) {
        // Closing tag - pop from stack
        if (stack.length > 0) {
          stack.pop();
        }
      } else {
        // Opening tag
        const node: HTMLNode = {
          type: 'element',
          tagName: tagName.toLowerCase(),
          attributes: this.parseAttributes(attrs),
          children: [],
        };

        if (stack.length > 0) {
          stack[stack.length - 1].node.children?.push(node);
        } else if (parent.children) {
          parent.children.push(node);
        }

        // Self-closing or void elements
        const voidElements = ['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr'];
        if (isSelfClosing || voidElements.includes(tagName.toLowerCase())) {
          // Don't push to stack
        } else {
          stack.push({ node, start: match.index });
        }
      }

      lastIndex = match.index + fullMatch.length;
    }

    // Handle remaining text
    const remaining = html.slice(lastIndex).trim();
    if (remaining && stack.length > 0) {
      const textContent = remaining.replace(/\s+/g, ' ').trim();
      if (textContent) {
        stack[stack.length - 1].node.children?.push({
          type: 'text',
          content: textContent,
        });
      }
    }
  }

  private parseAttributes(attrString: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const attrRegex = /([\w-]+)(?:=["']([^"']*)["'])?/g;
    let match;

    while ((match = attrRegex.exec(attrString)) !== null) {
      const [, name, value] = match;
      attrs[name] = value !== undefined ? value : 'true';
    }

    return attrs;
  }

  private nodeToFPP(node: HTMLNode, indent: number): string {
    const spaces = ' '.repeat(indent);
    const nextIndent = indent + this.indentSize;

    if (node.type === 'text' && node.content) {
      const escaped = node.content.replace(/"/g, '\\"');
      return `${spaces}text "${escaped}"\n`;
    }

    if (node.type === 'comment') {
      return '';
    }

    const tag = node.tagName || '';
    
    // Get F++ element name
    const fppName = this.getFPPElementName(tag, node.attributes || {});

    // Check if it's a void element
    const voidElements = ['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr'];
    const isVoid = voidElements.includes(tag);

    // Check if it's a simple element (no children, few attributes)
    const hasChildren = node.children && node.children.length > 0;
    const attrCount = Object.keys(node.attributes || {}).length;
    const isSimple = !hasChildren && attrCount <= 2 && isVoid;

    // Build attributes lines
    const attrLines: string[] = [];
    const styleAttrs: string[] = [];

    if (node.attributes) {
      // Parse style attribute
      if (node.attributes.style) {
        const styles = this.parseStyle(node.attributes.style);
        styleAttrs.push(...styles);
      }

      for (const [name, value] of Object.entries(node.attributes)) {
        if (name === 'style') continue;
        if (name === 'id') {
          attrLines.push(`${spaces}  id "${value}"`);
        } else if (name === 'class') {
          attrLines.push(`${spaces}  class "${value}"`);
        } else if (name === 'href') {
          attrLines.push(`${spaces}  link "${value}"`);
        } else if (name === 'src') {
          attrLines.push(`${spaces}  src "${value}"`);
        } else if (name === 'alt') {
          attrLines.push(`${spaces}  alt "${value}"`);
        } else if (name === 'type') {
          attrLines.push(`${spaces}  type "${value}"`);
        } else if (name === 'placeholder') {
          attrLines.push(`${spaces}  placeholder "${value}"`);
        } else if (name === 'name') {
          attrLines.push(`${spaces}  name "${value}"`);
        } else if (name === 'value') {
          attrLines.push(`${spaces}  value "${value}"`);
        } else if (value !== 'true') {
          attrLines.push(`${spaces}  ${name} "${value}"`);
        } else {
          attrLines.push(`${spaces}  ${name}`);
        }
      }
    }

    // Add style attributes
    for (const style of styleAttrs) {
      attrLines.push(`${spaces}  ${style}`);
    }

    // Build output
    let output = '';

    if (isSimple) {
      // Inline format
      const inlineAttrs = attrLines.map(l => l.trim()).join(' ');
      if (inlineAttrs) {
        output = `${spaces}${fppName}: ${inlineAttrs}\n`;
      } else {
        output = `${spaces}${fppName}\n`;
      }
    } else {
      // Block format
      output = `${spaces}${fppName}:\n`;
      
      // Add attributes
      output += attrLines.map(l => l + '\n').join('');

      // Add children
      if (hasChildren) {
        for (const child of node.children!) {
          if (child.type === 'text' && child.content) {
            const escaped = child.content.trim().replace(/"/g, '\\"');
            if (escaped) {
              output += `${spaces}  text "${escaped}"\n`;
            }
          } else {
            output += this.nodeToFPP(child, nextIndent);
          }
        }
      }

      output += `${spaces}}\n`;
    }

    return output;
  }

  private getFPPElementName(tag: string, attrs: Record<string, string>): string {
    const tagToFPP: Record<string, string> = {
      'html': 'page',
      'head': 'head',
      'body': 'body',
      'title': 'title',
      'meta': 'meta',
      'link': 'link',
      'style': 'style',
      'script': 'script',
      'h1': 'heading one',
      'h2': 'heading two',
      'h3': 'heading three',
      'h4': 'heading four',
      'h5': 'heading five',
      'h6': 'heading six',
      'p': 'paragraph',
      'span': 'text',
      'a': 'link',
      'img': 'image',
      'button': 'button',
      'input': 'input',
      'textarea': 'text area',
      'select': 'select',
      'option': 'option',
      'ul': 'list',
      'ol': 'ordered list',
      'li': 'item',
      'div': 'container',
      'section': 'section',
      'header': 'header',
      'footer': 'footer',
      'nav': 'navigation',
      'article': 'article',
      'aside': 'aside',
      'main': 'main',
      'table': 'table',
      'tr': 'row',
      'td': 'cell',
      'th': 'header cell',
      'thead': 'table head',
      'tbody': 'table body',
      'tfoot': 'table foot',
      'form': 'form',
      'label': 'label',
      'video': 'video',
      'audio': 'audio',
      'source': 'source',
      'iframe': 'iframe',
      'canvas': 'canvas',
      'svg': 'svg',
      'br': 'line break',
      'hr': 'horizontal rule',
      'code': 'code',
      'pre': 'pre',
      'blockquote': 'quote',
      'strong': 'bold',
      'em': 'italic',
      'u': 'underline',
      's': 'strikethrough',
    };

    return tagToFPP[tag] || tag;
  }

  private parseStyle(styleString: string): string[] {
    const styles: string[] = [];
    const parts = styleString.split(';').filter(s => s.trim());

    for (const part of parts) {
      const [prop, value] = part.split(':').map(s => s.trim());
      
      if (!prop || !value) continue;

      // Map CSS properties to F++ keywords
      const propMap: Record<string, string> = {
        'color': 'color',
        'background': 'background',
        'background-color': 'background',
        'font-family': 'font',
        'font-size': 'size',
        'font-weight': 'weight',
        'margin': 'margin',
        'padding': 'padding',
        'border': 'border',
        'border-radius': 'rounded',
        'box-shadow': 'shadow',
        'opacity': 'opacity',
        'width': 'width',
        'height': 'height',
        'display': 'display',
        'position': 'position',
        'text-align': 'align',
        'z-index': 'z-index',
        'cursor': 'cursor',
        'transition': 'transition',
        'animation': 'animation',
      };

      const fppProp = propMap[prop] || prop;
      
      // Clean up font family
      if (fppProp === 'font') {
        const fontMatch = value.match(/'([^']+)'|([^,]+)/);
        if (fontMatch) {
          styles.push(`${fppProp} "${fontMatch[1] || fontMatch[2]}"`);
          continue;
        }
      }

      styles.push(`${fppProp} ${value}`);
    }

    return styles;
  }
}

export const createDecompiler = () => new FPPDecompiler();
