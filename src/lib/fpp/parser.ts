// F++ Parser - Converts F++ code to AST

import { FPPElement, FPPParseResult, FPError, ELEMENT_MAP, STYLE_MAP, ATTRIBUTE_MAP, COLOR_MAP } from './types';

export class FPPParser {
  private lines: string[] = [];
  private currentLine = 0;
  private errors: FPError[] = [];
  private warnings: string[] = [];
  private googleFonts: Set<string> = new Set();

  parse(code: string): FPPParseResult {
    this.lines = code.split('\n');
    this.currentLine = 0;
    this.errors = [];
    this.warnings = [];
    this.googleFonts.clear();

    try {
      const ast = this.parseBlock(0);
      return {
        success: this.errors.length === 0,
        ast,
        errors: this.errors,
        warnings: this.warnings,
      };
    } catch (error) {
      this.errors.push({
        line: this.currentLine + 1,
        column: 0,
        message: error instanceof Error ? error.message : 'Unknown parsing error',
      });
      return {
        success: false,
        ast: null,
        errors: this.errors,
        warnings: this.warnings,
      };
    }
  }

  private parseBlock(baseIndent: number): FPPElement {
    const root: FPPElement = {
      type: 'root',
      tagName: 'div',
      attributes: {},
      styles: {},
      children: [],
      content: '',
      indent: baseIndent,
      classes: [],
      googleFonts: [],
    };

    while (this.currentLine < this.lines.length) {
      const line = this.lines[this.currentLine];
      const trimmed = line.trim();
      const indent = this.getIndent(line);

      // Skip empty lines and comments
      if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('#')) {
        this.currentLine++;
        continue;
      }

      // Check if we've exited the current block
      if (indent < baseIndent && baseIndent > 0) {
        break;
      }

      // Skip closing braces
      if (trimmed === '}' || trimmed === 'end') {
        this.currentLine++;
        break;
      }

      // Parse the line
      const element = this.parseLine(line, indent);
      if (element) {
        root.children.push(element);
        if (element.googleFonts) {
          element.googleFonts.forEach(f => this.googleFonts.add(f));
        }
      }
    }

    root.googleFonts = Array.from(this.googleFonts);
    return root;
  }

  private parseLine(line: string, indent: number): FPPElement | null {
    const trimmed = line.trim();

    // Check for element declaration (ends with : or {)
    const elementMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9\s]*?)\s*[:{]?\s*$/);
    if (elementMatch && !this.isAttribute(trimmed)) {
      return this.parseElement(elementMatch[1].trim(), indent);
    }

    // Inline element with attributes
    const inlineMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9\s]*?)\s+(.+)$/);
    if (inlineMatch && !this.isAttribute(trimmed)) {
      const elementType = inlineMatch[1].trim();
      const rest = inlineMatch[2];
      return this.parseInlineElement(elementType, rest, indent);
    }

    // Standalone text content
    if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
      return {
        type: 'text',
        tagName: 'span',
        attributes: {},
        styles: {},
        children: [],
        content: this.extractString(trimmed),
        indent,
        classes: [],
      };
    }

    this.currentLine++;
    return null;
  }

  private parseElement(elementType: string, indent: number): FPPElement {
    const element: FPPElement = {
      type: 'element',
      tagName: this.getTagName(elementType),
      attributes: {},
      styles: {},
      children: [],
      content: '',
      indent,
      classes: [],
      pseudoStyles: {},
      animations: [],
      googleFonts: [],
    };

    // Handle special element types
    if (elementType.toLowerCase() === 'page' || elementType.toLowerCase() === 'document') {
      element.tagName = 'html';
    }

    this.currentLine++;

    // Parse nested content
    while (this.currentLine < this.lines.length) {
      const line = this.lines[this.currentLine];
      const trimmed = line.trim();
      const currentIndent = this.getIndent(line);

      // End of block
      if (trimmed === '}' || trimmed === 'end') {
        this.currentLine++;
        break;
      }

      // Child element with higher indent
      if (currentIndent > indent && trimmed !== '') {
        // Parse attributes and styles
        if (this.isAttribute(trimmed)) {
          this.applyAttribute(element, trimmed);
          this.currentLine++;
        } else if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
          element.content = this.extractString(trimmed);
          this.currentLine++;
        } else {
          const child = this.parseLine(line, currentIndent);
          if (child) {
            element.children.push(child);
            if (child.googleFonts) {
              child.googleFonts.forEach(f => {
                this.googleFonts.add(f);
                if (!element.googleFonts) element.googleFonts = [];
                element.googleFonts.push(f);
              });
            }
          }
        }
      } else if (currentIndent <= indent && trimmed !== '' && trimmed !== '}') {
        // Back to parent level
        break;
      } else {
        this.currentLine++;
      }
    }

    return element;
  }

  private parseInlineElement(elementType: string, rest: string, indent: number): FPPElement {
    const element: FPPElement = {
      type: 'element',
      tagName: this.getTagName(elementType),
      attributes: {},
      styles: {},
      children: [],
      content: '',
      indent,
      classes: [],
    };

    // Parse inline attributes
    this.parseInlineAttributes(element, rest);
    this.currentLine++;

    return element;
  }

  private parseInlineAttributes(element: FPPElement, text: string): void {
    // Extract text content
    const textMatch = text.match(/text\s+["'](.+?)["']/i);
    if (textMatch) {
      element.content = textMatch[1];
    }

    // Extract link
    const linkMatch = text.match(/link\s+["'](.+?)["']/i);
    if (linkMatch) {
      element.attributes.href = linkMatch[1];
    }

    // Extract color
    const colorMatch = text.match(/color\s+(\w+|\#[0-9a-fA-F]+)/i);
    if (colorMatch) {
      element.styles.color = this.parseColor(colorMatch[1]);
    }

    // Extract id
    const idMatch = text.match(/id\s+["']?(\w+)["']?/i);
    if (idMatch) {
      element.attributes.id = idMatch[1];
    }

    // Extract class
    const classMatch = text.match(/class\s+["'](\w+)["']/i);
    if (classMatch) {
      element.classes.push(classMatch[1]);
    }
  }

  private getTagName(elementType: string): string {
    const normalized = elementType.toLowerCase().trim();
    
    // Check for heading with number
    const headingMatch = normalized.match(/^heading\s*(one|two|three|four|five|six|\d)$/);
    if (headingMatch) {
      const num = headingMatch[1];
      const headingMap: Record<string, string> = {
        'one': 'h1', '1': 'h1',
        'two': 'h2', '2': 'h2',
        'three': 'h3', '3': 'h3',
        'four': 'h4', '4': 'h4',
        'five': 'h5', '5': 'h5',
        'six': 'h6', '6': 'h6',
      };
      return headingMap[num] || 'h1';
    }

    // Check element map
    if (ELEMENT_MAP[normalized]) {
      return ELEMENT_MAP[normalized];
    }

    // Check for compound names
    for (const [key, value] of Object.entries(ELEMENT_MAP)) {
      if (normalized.includes(key)) {
        return value;
      }
    }

    // Default to div
    return 'div';
  }

  private isAttribute(text: string): boolean {
    const trimmed = text.trim().toLowerCase();
    const attrKeywords = [
      'text', 'color', 'background', 'size', 'font', 'pos', 'position',
      'width', 'height', 'margin', 'padding', 'border', 'outline',
      'rounded', 'shadow', 'opacity', 'display', 'flex', 'grid',
      'link', 'src', 'alt', 'id', 'class', 'type', 'placeholder',
      'name', 'value', 'required', 'disabled', 'hover', 'focus',
      'active', 'animation', 'transition', 'cursor', 'z-index',
      'api', 'key', 'base_url', 'on click', 'on hover', 'center',
    ];
    return attrKeywords.some(kw => trimmed.startsWith(kw));
  }

  private applyAttribute(element: FPPElement, text: string): void {
    const trimmed = text.trim();
    const lowerTrimmed = trimmed.toLowerCase();

    // Text content
    if (lowerTrimmed.startsWith('text ')) {
      element.content = this.extractString(trimmed.substring(5));
      return;
    }

    // Color
    if (lowerTrimmed.startsWith('color ')) {
      const value = trimmed.substring(6).trim();
      element.styles.color = this.parseColor(value);
      return;
    }

    // Background
    if (lowerTrimmed.startsWith('background ')) {
      const value = trimmed.substring(11).trim();
      element.styles['background-color'] = this.parseColor(value);
      return;
    }

    // Font
    if (lowerTrimmed.startsWith('font ')) {
      const value = this.extractString(trimmed.substring(5));
      element.styles['font-family'] = `'${value}', sans-serif`;
      if (!element.googleFonts) element.googleFonts = [];
      element.googleFonts.push(value);
      return;
    }

    // Size
    if (lowerTrimmed.startsWith('size ')) {
      const value = trimmed.substring(5).trim();
      element.styles['font-size'] = this.parseSize(value);
      return;
    }

    // Width
    if (lowerTrimmed.startsWith('width ')) {
      const value = trimmed.substring(6).trim();
      element.styles.width = this.parseSize(value);
      return;
    }

    // Height
    if (lowerTrimmed.startsWith('height ')) {
      const value = trimmed.substring(7).trim();
      element.styles.height = this.parseSize(value);
      return;
    }

    // Position (x, y, z)
    if (lowerTrimmed.startsWith('pos') || lowerTrimmed.startsWith('position')) {
      this.parsePosition(element, trimmed);
      return;
    }

    // Margin
    if (lowerTrimmed.startsWith('margin ')) {
      const value = trimmed.substring(7).trim();
      element.styles.margin = this.parseSize(value);
      return;
    }

    // Padding
    if (lowerTrimmed.startsWith('padding ')) {
      const value = trimmed.substring(8).trim();
      element.styles.padding = this.parseSize(value);
      return;
    }

    // Border
    if (lowerTrimmed.startsWith('border ')) {
      const value = trimmed.substring(7).trim();
      element.styles.border = value.includes('px') ? value : `1px solid ${this.parseColor(value)}`;
      return;
    }

    // Outline
    if (lowerTrimmed === 'outline on' || lowerTrimmed === 'outline true') {
      element.styles.outline = '2px solid currentColor';
      return;
    }
    if (lowerTrimmed === 'outline off' || lowerTrimmed === 'outline false') {
      element.styles.outline = 'none';
      return;
    }

    // Rounded
    if (lowerTrimmed.startsWith('rounded ')) {
      const value = trimmed.substring(8).trim();
      element.styles['border-radius'] = value.includes('px') ? value : `${value}px`;
      return;
    }

    // Shadow
    if (lowerTrimmed.startsWith('shadow ')) {
      const value = trimmed.substring(7).trim();
      element.styles['box-shadow'] = value === 'on' ? '0 4px 6px rgba(0,0,0,0.1)' : value;
      return;
    }

    // Opacity
    if (lowerTrimmed.startsWith('opacity ')) {
      const value = trimmed.substring(8).trim();
      element.styles.opacity = value;
      return;
    }

    // Link/Href
    if (lowerTrimmed.startsWith('link ')) {
      element.attributes.href = this.extractString(trimmed.substring(5));
      return;
    }

    // Src
    if (lowerTrimmed.startsWith('src ')) {
      element.attributes.src = this.extractString(trimmed.substring(4));
      return;
    }

    // Alt
    if (lowerTrimmed.startsWith('alt ')) {
      element.attributes.alt = this.extractString(trimmed.substring(4));
      return;
    }

    // ID
    if (lowerTrimmed.startsWith('id ')) {
      element.attributes.id = trimmed.substring(3).trim().replace(/['"]/g, '');
      return;
    }

    // Class
    if (lowerTrimmed.startsWith('class ')) {
      element.classes.push(this.extractString(trimmed.substring(6)));
      return;
    }

    // Type
    if (lowerTrimmed.startsWith('type ')) {
      element.attributes.type = this.extractString(trimmed.substring(5));
      return;
    }

    // Placeholder
    if (lowerTrimmed.startsWith('placeholder ')) {
      element.attributes.placeholder = this.extractString(trimmed.substring(12));
      return;
    }

    // Name
    if (lowerTrimmed.startsWith('name ')) {
      element.attributes.name = this.extractString(trimmed.substring(5));
      return;
    }

    // Value
    if (lowerTrimmed.startsWith('value ')) {
      element.attributes.value = this.extractString(trimmed.substring(6));
      return;
    }

    // Center
    if (lowerTrimmed === 'center' || lowerTrimmed === 'centered') {
      element.styles['text-align'] = 'center';
      element.styles['margin-left'] = 'auto';
      element.styles['margin-right'] = 'auto';
      return;
    }

    // Display
    if (lowerTrimmed.startsWith('display ')) {
      element.styles.display = trimmed.substring(8).trim();
      return;
    }

    // Flex
    if (lowerTrimmed === 'flex' || lowerTrimmed.startsWith('flex ')) {
      element.styles.display = 'flex';
      if (lowerTrimmed.startsWith('flex ')) {
        const options = trimmed.substring(5).trim();
        if (options.includes('center')) {
          element.styles['justify-content'] = 'center';
          element.styles['align-items'] = 'center';
        }
        if (options.includes('column')) {
          element.styles['flex-direction'] = 'column';
        }
        if (options.includes('wrap')) {
          element.styles['flex-wrap'] = 'wrap';
        }
      }
      return;
    }

    // Grid
    if (lowerTrimmed === 'grid' || lowerTrimmed.startsWith('grid ')) {
      element.styles.display = 'grid';
      if (lowerTrimmed.startsWith('grid ')) {
        const options = trimmed.substring(5).trim();
        const colMatch = options.match(/(\d+)\s*cols?/);
        if (colMatch) {
          element.styles['grid-template-columns'] = `repeat(${colMatch[1]}, 1fr)`;
        }
        const gapMatch = options.match(/gap\s*(\d+)/);
        if (gapMatch) {
          element.styles.gap = `${gapMatch[1]}px`;
        }
      }
      return;
    }

    // Cursor
    if (lowerTrimmed.startsWith('cursor ')) {
      element.styles.cursor = trimmed.substring(7).trim();
      return;
    }

    // Z-index
    if (lowerTrimmed.startsWith('z-index ') || lowerTrimmed.startsWith('z ')) {
      const value = lowerTrimmed.startsWith('z-index ') ? trimmed.substring(8) : trimmed.substring(2);
      element.styles['z-index'] = value.trim();
      return;
    }

    // Animation
    if (lowerTrimmed.startsWith('animation ')) {
      this.parseAnimation(element, trimmed.substring(10));
      return;
    }

    // Transition
    if (lowerTrimmed.startsWith('transition ')) {
      element.styles.transition = trimmed.substring(11).trim();
      return;
    }

    // Hover
    if (lowerTrimmed.startsWith('hover ')) {
      if (!element.pseudoStyles) element.pseudoStyles = {};
      element.pseudoStyles['hover'] = this.parsePseudoStyles(trimmed.substring(6));
      return;
    }

    // Focus
    if (lowerTrimmed.startsWith('focus ')) {
      if (!element.pseudoStyles) element.pseudoStyles = {};
      element.pseudoStyles['focus'] = this.parsePseudoStyles(trimmed.substring(6));
      return;
    }

    // On Click
    if (lowerTrimmed.startsWith('on click ')) {
      element.attributes.onclick = this.extractString(trimmed.substring(9));
      return;
    }

    // Required
    if (lowerTrimmed === 'required') {
      element.attributes.required = 'required';
      return;
    }

    // Disabled
    if (lowerTrimmed === 'disabled') {
      element.attributes.disabled = 'disabled';
      return;
    }

    // API config (store as data attribute)
    if (lowerTrimmed.startsWith('api')) {
      // Parse API block
      this.parseApiConfig(element);
      return;
    }
  }

  private parsePosition(element: FPPElement, text: string): void {
    const match = text.match(/x(\d+)\s*y(\d+)\s*z?(\d*)/i);
    if (match) {
      element.styles.position = 'absolute';
      element.styles.left = `${match[1]}px`;
      element.styles.top = `${match[2]}px`;
      if (match[3]) {
        element.styles['z-index'] = match[3];
      }
      return;
    }

    // Simple position keyword
    const value = text.split(/\s+/)[1]?.toLowerCase();
    if (['absolute', 'relative', 'fixed', 'sticky', 'static'].includes(value || '')) {
      element.styles.position = value!;
    }
  }

  private parseAnimation(element: FPPElement, text: string): void {
    const parts = text.trim().split(/\s+/);
    if (parts.length >= 1) {
      element.styles.animation = parts.length >= 2 
        ? `${parts[0]} ${parts[1]}` 
        : `${parts[0]} 1s`;
    }
  }

  private parsePseudoStyles(text: string): Record<string, string> {
    const styles: Record<string, string> = {};
    const parts = text.split(/\s+/);
    
    for (let i = 0; i < parts.length; i += 2) {
      const prop = parts[i];
      const value = parts[i + 1];
      if (prop && value && STYLE_MAP[prop.toLowerCase()]) {
        styles[STYLE_MAP[prop.toLowerCase()]] = this.parseColor(value);
      }
    }
    
    return styles;
  }

  private parseApiConfig(element: FPPElement): void {
    // Look for nested API config
    this.currentLine++;
    while (this.currentLine < this.lines.length) {
      const line = this.lines[this.currentLine].trim();
      if (line === '}' || line === 'end') {
        this.currentLine++;
        break;
      }
      
      const keyMatch = line.match(/key\s+["'](.+?)["']/i);
      if (keyMatch) {
        element.attributes['data-api-key'] = keyMatch[1];
      }
      
      const urlMatch = line.match(/base_url\s+["'](.+?)["']/i);
      if (urlMatch) {
        element.attributes['data-api-url'] = urlMatch[1];
      }
      
      this.currentLine++;
    }
  }

  private extractString(text: string): string {
    const match = text.match(/["'](.+?)["']/);
    return match ? match[1] : text.trim();
  }

  private parseColor(value: string): string {
    const trimmed = value.trim().toLowerCase();
    if (COLOR_MAP[trimmed]) {
      return COLOR_MAP[trimmed];
    }
    if (trimmed.startsWith('#') || trimmed.startsWith('rgb')) {
      return value.trim();
    }
    return value.trim();
  }

  private parseSize(value: string): string {
    const trimmed = value.trim();
    if (trimmed.match(/^\d+$/)) {
      return `${trimmed}px`;
    }
    if (!trimmed.match(/\d/)) {
      return trimmed; // Keywords like 'auto', '100%', etc.
    }
    return trimmed;
  }

  private getIndent(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }
}

export const createParser = () => new FPPParser();
