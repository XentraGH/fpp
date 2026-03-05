'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { examples, tutorials, getExamplesByCategory, type FPPExample } from '@/lib/fpp/examples';

// Default F++ code
const DEFAULT_CODE = `page:
  title:
    text "Welcome to F++"
  }
  
  heading one:
    text "Hello, World!"
    color blue
    center
    font "Poppins"
  }
  
  paragraph:
    text "F++ is an English-like programming language that compiles to HTML. Write code that reads like natural language!"
    size 18px
    center
    margin 20px
  }
  
  container:
    flex center
    gap 20px
    margin 30px
    
    button:
      text "Get Started"
      background #2563eb
      color white
      padding 15px 30px
      rounded 8px
      cursor pointer
    }
    
    button:
      text "Learn More"
      background transparent
      color #2563eb
      border 2px solid #2563eb
      padding 15px 30px
      rounded 8px
      cursor pointer
    }
  }
}`;

export default function FPPIDE() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [compiledHtml, setCompiledHtml] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [googleFonts, setGoogleFonts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedExample, setSelectedExample] = useState<string>('hello-world');
  const [isConverting, setIsConverting] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Compile F++ code
  const compileCode = useCallback(async (codeToCompile: string) => {
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToCompile }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCompiledHtml(result.html);
        setGoogleFonts(result.googleFonts || []);
        setErrors(result.errors || []);
      } else {
        setErrors(result.errors || ['Compilation failed']);
      }
    } catch (error) {
      console.error('Compile error:', error);
      setErrors(['Failed to compile code']);
    }
  }, []);

  // Convert HTML to F++
  const convertHtmlToFPP = useCallback(async () => {
    if (!htmlInput.trim()) return;
    
    setIsConverting(true);
    try {
      const response = await fetch('/api/decompile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlInput }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCode(result.code);
        setActiveTab('editor');
      }
    } catch (error) {
      console.error('Convert error:', error);
      setErrors(['Failed to convert HTML']);
    } finally {
      setIsConverting(false);
    }
  }, [htmlInput]);

  // Download HTML file
  const downloadHtml = useCallback(() => {
    if (!compiledHtml || typeof window === 'undefined') return;
    
    const blob = new Blob([compiledHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [compiledHtml]);

  // Load example
  const loadExample = useCallback((exampleId: string) => {
    const example = examples.find(e => e.id === exampleId);
    if (example) {
      setCode(example.code);
      setSelectedExample(exampleId);
      setActiveTab('editor');
    }
  }, []);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Compile on code change with debounce
  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => {
      compileCode(code);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [code, compileCode, mounted]);

  // Update iframe with compiled HTML
  useEffect(() => {
    if (!mounted || !iframeRef.current || !compiledHtml) return;
    
    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(compiledHtml);
        doc.close();
      }
    } catch (error) {
      console.error('Iframe error:', error);
    }
  }, [compiledHtml, mounted]);

  // Show loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading F++ IDE...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg">
              F++
            </div>
            <div>
              <h1 className="text-xl font-bold">F++ Language</h1>
              <p className="text-xs text-slate-400">English-like Programming Language</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCode(DEFAULT_CODE)}>
              New
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveTab('convert')}
            >
              HTML → F++
            </Button>
            <Button 
              size="sm" 
              onClick={downloadHtml}
              disabled={!compiledHtml}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Download HTML
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700 mb-4">
            <TabsTrigger value="editor" className="data-[state=active]:bg-slate-700">
              Editor
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="data-[state=active]:bg-slate-700">
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-slate-700">
              Examples
            </TabsTrigger>
            <TabsTrigger value="docs" className="data-[state=active]:bg-slate-700">
              Documentation
            </TabsTrigger>
            <TabsTrigger value="convert" className="data-[state=active]:bg-slate-700">
              HTML → F++
            </TabsTrigger>
          </TabsList>

          {/* Editor Tab */}
          <TabsContent value="editor" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Code Editor */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="py-3 px-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">F++ Code</CardTitle>
                    <div className="flex items-center gap-2">
                      {errors.length > 0 ? (
                        <Badge variant="destructive">{errors.length} Error(s)</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-500">Valid</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-[600px] bg-slate-900 text-slate-100 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your F++ code here..."
                    spellCheck={false}
                  />
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="py-3 px-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
                    {googleFonts.length > 0 && (
                      <div className="flex items-center gap-1">
                        {googleFonts.map(font => (
                          <Badge key={font} variant="outline" className="text-xs">{font}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-white h-[600px] rounded-b-lg overflow-hidden">
                    <iframe
                      ref={iframeRef}
                      className="w-full h-full border-0"
                      title="Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <Card className="mt-4 bg-red-900/20 border-red-800">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-sm font-medium text-red-400">Errors</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <ul className="list-disc list-inside text-red-300 text-sm">
                    {errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Tutorials</CardTitle>
                  <CardDescription>Learn F++ step by step</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tutorials.map((tutorial) => (
                      <Button
                        key={tutorial.id}
                        variant="ghost"
                        className="w-full justify-start text-left"
                      >
                        {tutorial.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
                <CardContent className="prose prose-invert max-w-none p-6">
                  {tutorials.map((tutorial) => (
                    <div key={tutorial.id} className="mb-8">
                      <h2 className="text-xl font-bold mb-4">{tutorial.title}</h2>
                      <pre className="whitespace-pre-wrap text-slate-300 text-sm bg-slate-900 p-4 rounded-lg overflow-auto">
                        {tutorial.content}
                      </pre>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="space-y-4">
                {['basics', 'layout', 'forms', 'media', 'advanced'].map((category) => (
                  <Card key={category} className="bg-slate-800 border-slate-700">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-medium capitalize">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="space-y-1">
                        {getExamplesByCategory(category as FPPExample['category']).map((example) => (
                          <Button
                            key={example.id}
                            variant={selectedExample === example.id ? 'default' : 'ghost'}
                            size="sm"
                            className="w-full justify-start text-left"
                            onClick={() => loadExample(example.id)}
                          >
                            {example.title}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-3">
                {examples.find(e => e.id === selectedExample) && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{examples.find(e => e.id === selectedExample)?.title}</CardTitle>
                          <CardDescription>
                            {examples.find(e => e.id === selectedExample)?.description}
                          </CardDescription>
                        </div>
                        <Button onClick={() => loadExample(selectedExample)}>
                          Use This Example
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm max-h-[500px] overflow-auto">
                        <code>{examples.find(e => e.id === selectedExample)?.code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-slate-700 h-fit">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Elements</h3>
                    <ScrollArea className="h-48">
                      <div className="space-y-1 text-sm">
                        {[
                          ['page', 'html - Document root'],
                          ['heading one', 'h1 - Main heading'],
                          ['heading two', 'h2 - Section heading'],
                          ['paragraph', 'p - Paragraph text'],
                          ['link', 'a - Anchor link'],
                          ['image', 'img - Image element'],
                          ['button', 'button - Clickable button'],
                          ['input', 'input - Form input'],
                          ['container', 'div - Generic container'],
                          ['list', 'ul - Unordered list'],
                          ['item', 'li - List item'],
                          ['section', 'section - Document section'],
                          ['header', 'header - Page header'],
                          ['footer', 'footer - Page footer'],
                          ['navigation', 'nav - Navigation menu'],
                          ['form', 'form - Form container'],
                          ['table', 'table - Data table'],
                          ['video', 'video - Video player'],
                          ['audio', 'audio - Audio player'],
                        ].map(([name, desc]) => (
                          <div key={name} className="flex gap-2 py-1">
                            <code className="text-blue-400">{name}</code>
                            <span className="text-slate-400">{desc}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>F++ Reference</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <h2>Attributes</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2">F++ Syntax</th>
                        <th className="text-left py-2">HTML Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['text "content"', 'innerHTML'],
                        ['id "name"', 'id="name"'],
                        ['class "name"', 'class="name"'],
                        ['link "url"', 'href="url"'],
                        ['src "url"', 'src="url"'],
                        ['alt "text"', 'alt="text"'],
                        ['type "text"', 'type="text"'],
                        ['placeholder "text"', 'placeholder="text"'],
                        ['required', 'required'],
                        ['disabled', 'disabled'],
                      ].map(([fpp, html]) => (
                        <tr key={fpp} className="border-t border-slate-700">
                          <td className="py-2 font-mono text-blue-400">{fpp}</td>
                          <td className="py-2 text-slate-300">{html}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h2 className="mt-6">Styles</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2">F++ Syntax</th>
                        <th className="text-left py-2">CSS Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['color red', 'color: #ff0000'],
                        ['background blue', 'background: #0000ff'],
                        ['size 20px', 'font-size: 20px'],
                        ['font "Roboto"', 'font-family: "Roboto"'],
                        ['padding 20px', 'padding: 20px'],
                        ['margin 10px', 'margin: 10px'],
                        ['rounded 8px', 'border-radius: 8px'],
                        ['shadow on', 'box-shadow: 0 4px 6px rgba(0,0,0,0.1)'],
                        ['flex', 'display: flex'],
                        ['grid', 'display: grid'],
                        ['center', 'text-align: center'],
                        ['opacity 0.5', 'opacity: 0.5'],
                      ].map(([fpp, css]) => (
                        <tr key={fpp} className="border-t border-slate-700">
                          <td className="py-2 font-mono text-purple-400">{fpp}</td>
                          <td className="py-2 text-slate-300">{css}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Convert Tab */}
          <TabsContent value="convert" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Paste HTML</CardTitle>
                  <CardDescription>Convert existing HTML to F++ code</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    className="w-full h-[500px] bg-slate-900 text-slate-100 font-mono text-sm p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste your HTML code here..."
                    spellCheck={false}
                  />
                  <Button 
                    className="mt-4 w-full" 
                    onClick={convertHtmlToFPP}
                    disabled={isConverting || !htmlInput.trim()}
                  >
                    {isConverting ? 'Converting...' : 'Convert to F++'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>F++ Output</CardTitle>
                  <CardDescription>The converted F++ code will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 p-4 rounded-lg h-[500px] overflow-auto text-sm">
                    <code>{code || 'Converted F++ code will appear here...'}</code>
                  </pre>
                  <Button 
                    className="mt-4 w-full" 
                    variant="outline"
                    onClick={() => setActiveTab('editor')}
                    disabled={!code}
                  >
                    Open in Editor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-slate-400">
          <p>F++ Programming Language - Write HTML in Plain English</p>
          <p className="mt-1">
            <a href="https://github.com/XentraGH/fpp" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              GitHub Repository
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
