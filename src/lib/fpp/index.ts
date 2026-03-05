// F++ Programming Language - Main Exports

export { FPPParser, createParser } from './parser';
export { FPPCompiler, createCompiler } from './compiler';
export { FPPDecompiler, createDecompiler } from './decompiler';
export * from './types';
export * from './examples';

import { createParser } from './parser';
import { createCompiler } from './compiler';
import { createDecompiler } from './decompiler';

// Main compile function
export function compileFPP(code: string) {
  const parser = createParser();
  const compiler = createCompiler();
  
  const parseResult = parser.parse(code);
  
  if (!parseResult.success || !parseResult.ast) {
    return {
      success: false,
      html: '',
      css: '',
      errors: parseResult.errors.map(e => `Line ${e.line}: ${e.message}`),
      warnings: parseResult.warnings,
      googleFonts: [],
    };
  }
  
  const compileResult = compiler.compile(parseResult.ast);
  
  return {
    ...compileResult,
    warnings: parseResult.warnings,
  };
}

// Main decompile function
export function decompileHTML(html: string): string {
  const decompiler = createDecompiler();
  return decompiler.decompile(html);
}
