// F++ Examples and Tutorials

export interface FPPExample {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'layout' | 'forms' | 'media' | 'advanced' | 'tutorial';
  code: string;
}

export const examples: FPPExample[] = [
  // Basics
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'The classic first program - a simple page with a heading',
    category: 'basics',
    code: `page:
  title:
    text "My First F++ Page"
  }
  
  heading one:
    text "Hello, World!"
    color blue
    center
  }
}`,
  },
  {
    id: 'basic-text',
    title: 'Text & Paragraphs',
    description: 'Working with text content and paragraphs',
    category: 'basics',
    code: `page:
  heading one:
    text "Text Elements"
    color navy
  }
  
  paragraph:
    text "This is a paragraph of text. F++ makes it easy to create content."
    size 18px
    color #333
  }
  
  paragraph:
    text "You can use multiple paragraphs to build your document."
    margin 20px
  }
}`,
  },
  {
    id: 'colors-fonts',
    title: 'Colors & Fonts',
    description: 'Using colors and Google Fonts',
    category: 'basics',
    code: `page:
  heading one:
    text "Colors & Fonts"
    color crimson
    font "Playfair Display"
  }
  
  heading two:
    text "Beautiful Typography"
    color #2563eb
    font "Roboto"
  }
  
  paragraph:
    text "F++ supports color names, hex codes, and Google Fonts."
    color darkslategray
    font "Open Sans"
    size 16px
  }
}`,
  },
  {
    id: 'links',
    title: 'Links & Navigation',
    description: 'Creating links and navigation elements',
    category: 'basics',
    code: `page:
  navigation:
    flex center
    padding 20px
    background whitesmoke
    
    link:
      text "Home"
      link "/"
      margin 10px
    }
    
    link:
      text "About"
      link "/about"
      margin 10px
    }
    
    link:
      text "Contact"
      link "/contact"
      margin 10px
    }
  }
  
  paragraph:
    text "Click the links above to navigate."
    center
    margin 40px
  }
}`,
  },
  
  // Layout
  {
    id: 'flexbox',
    title: 'Flexbox Layout',
    description: 'Using flexbox for responsive layouts',
    category: 'layout',
    code: `page:
  heading one:
    text "Flexbox Layout"
    center
    margin 20px
  }
  
  container:
    flex center wrap
    gap 20px
    padding 20px
    
    container:
      text "Box 1"
      background coral
      padding 40px
      rounded 10px
    }
    
    container:
      text "Box 2"
      background lightblue
      padding 40px
      rounded 10px
    }
    
    container:
      text "Box 3"
      background lightgreen
      padding 40px
      rounded 10px
    }
  }
}`,
  },
  {
    id: 'grid',
    title: 'CSS Grid Layout',
    description: 'Using CSS grid for complex layouts',
    category: 'layout',
    code: `page:
  heading one:
    text "Grid Layout"
    center
  }
  
  container:
    grid 3-cols gap-20
    padding 20px
    
    container:
      text "Item 1"
      background lavender
      padding 30px
      rounded 8px
    }
    
    container:
      text "Item 2"
      background thistle
      padding 30px
      rounded 8px
    }
    
    container:
      text "Item 3"
      background plum
      padding 30px
      rounded 8px
    }
    
    container:
      text "Item 4"
      background violet
      padding 30px
      rounded 8px
      color white
    }
    
    container:
      text "Item 5"
      background orchid
      padding 30px
      rounded 8px
      color white
    }
    
    container:
      text "Item 6"
      background mediumpurple
      padding 30px
      rounded 8px
      color white
    }
  }
}`,
  },
  {
    id: 'card-layout',
    title: 'Card Layout',
    description: 'Creating card-based layouts',
    category: 'layout',
    code: `page:
  heading one:
    text "Card Layout"
    center
    margin 20px
  }
  
  container:
    flex center wrap
    gap 30px
    padding 20px
    
    container:
      width 280px
      background white
      rounded 12px
      shadow on
      overflow hidden
      
      image:
        src "https://picsum.photos/280/180"
        alt "Card image"
      }
      
      container:
        padding 20px
        
        heading three:
          text "Card Title"
          margin 0
        }
        
        paragraph:
          text "This is a card component with an image and text content."
          color gray
          margin 10px 0
        }
        
        button:
          text "Learn More"
          background blue
          color white
          padding 10px 20px
          rounded 6px
        }
      }
    }
  }
}`,
  },
  
  // Forms
  {
    id: 'basic-form',
    title: 'Basic Form',
    description: 'Creating forms with inputs',
    category: 'forms',
    code: `page:
  heading one:
    text "Contact Form"
    center
  }
  
  form:
    width 400px
    margin 20px auto
    padding 30px
    background whitesmoke
    rounded 10px
    
    label:
      text "Name"
      display block
      margin 10px 0 5px
    }
    
    input:
      type text
      placeholder "Enter your name"
      width 100%
      padding 10px
      rounded 5px
      border 1px solid #ccc
    }
    
    label:
      text "Email"
      display block
      margin 20px 0 5px
    }
    
    input:
      type email
      placeholder "Enter your email"
      width 100%
      padding 10px
      rounded 5px
      border 1px solid #ccc
    }
    
    label:
      text "Message"
      display block
      margin 20px 0 5px
    }
    
    text area:
      placeholder "Your message..."
      width 100%
      rows 5
      padding 10px
      rounded 5px
      border 1px solid #ccc
    }
    
    button:
      text "Submit"
      type submit
      background green
      color white
      padding 12px 30px
      rounded 5px
      margin 20px 0 0
    }
  }
}`,
  },
  {
    id: 'login-form',
    title: 'Login Form',
    description: 'A styled login form',
    category: 'forms',
    code: `page:
  container:
    width 350px
    margin 100px auto
    padding 40px
    background white
    rounded 15px
    shadow 0 10px 40px rgba(0,0,0,0.1)
    
    heading two:
      text "Welcome Back"
      center
      margin 0 0 30px
      color #333
    }
    
    input:
      type email
      placeholder "Email address"
      width 100%
      padding 15px
      margin 0 0 15px
      rounded 8px
      border 1px solid #ddd
    }
    
    input:
      type password
      placeholder "Password"
      width 100%
      padding 15px
      margin 0 0 20px
      rounded 8px
      border 1px solid #ddd
    }
    
    button:
      text "Sign In"
      width 100%
      padding 15px
      background #2563eb
      color white
      rounded 8px
      font "inherit"
      size 16px
    }
    
    paragraph:
      text "Don't have an account? Sign up"
      center
      margin 20px 0 0
      color gray
    }
  }
}`,
  },
  
  // Media
  {
    id: 'images',
    title: 'Images',
    description: 'Working with images',
    category: 'media',
    code: `page:
  heading one:
    text "Image Gallery"
    center
    margin 20px
  }
  
  container:
    flex center wrap
    gap 15px
    padding 20px
    
    image:
      src "https://picsum.photos/200/200"
      alt "Gallery image 1"
      rounded 10px
    }
    
    image:
      src "https://picsum.photos/201/200"
      alt "Gallery image 2"
      rounded 10px
    }
    
    image:
      src "https://picsum.photos/202/200"
      alt "Gallery image 3"
      rounded 10px
    }
    
    image:
      src "https://picsum.photos/203/200"
      alt "Gallery image 4"
      rounded 10px
    }
  }
}`,
  },
  {
    id: 'video-audio',
    title: 'Video & Audio',
    description: 'Embedding video and audio',
    category: 'media',
    code: `page:
  heading one:
    text "Media Elements"
    center
  }
  
  heading two:
    text "Video Player"
    margin 20px
  }
  
  video:
    src "https://www.w3schools.com/html/mov_bbb.mp4"
    width 400px
    controls on
    rounded 10px
  }
  
  heading two:
    text "Audio Player"
    margin 30px 20px 20px
  }
  
  audio:
    src "https://www.w3schools.com/html/horse.mp3"
    controls on
  }
}`,
  },
  
  // Advanced
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'A complete landing page example',
    category: 'advanced',
    code: `page:
  head:
    meta:
      name viewport
      content "width=device-width, initial-scale=1.0"
    }
  }
  
  header:
    flex center
    padding 20px 40px
    background white
    shadow on
    
    navigation:
      flex center
      gap 30px
      
      link:
        text "Home"
        link "#"
        color #333
      }
      
      link:
        text "Features"
        link "#features"
        color #333
      }
      
      link:
        text "Pricing"
        link "#pricing"
        color #333
      }
      
      link:
        text "Contact"
        link "#contact"
        color #333
      }
    }
  }
  
  section:
    padding 100px 40px
    background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
    text-align center
    
    heading one:
      text "Build Amazing Websites"
      color white
      size 48px
      margin 0 0 20px
      font "Poppins"
    }
    
    paragraph:
      text "F++ makes web development simple and intuitive. Write in plain English, generate clean HTML."
      color white
      size 20px
      opacity 0.9
      margin 0 0 40px
    }
    
    button:
      text "Get Started Free"
      background white
      color #667eea
      padding 15px 40px
      rounded 30px
      size 18px
      font "inherit"
    }
  }
  
  section:
    id features
    padding 80px 40px
    background white
    
    heading two:
      text "Features"
      center
      margin 0 0 50px
    }
    
    container:
      flex center wrap
      gap 40px
      max-width 1000px
      margin auto
      
      container:
        width 280px
        padding 30px
        background whitesmoke
        rounded 15px
        text-align center
        
        heading three:
          text "Easy Syntax"
          margin 0 0 15px
        }
        
        paragraph:
          text "Write code that reads like English sentences"
          color gray
        }
      }
      
      container:
        width 280px
        padding 30px
        background whitesmoke
        rounded 15px
        text-align center
        
        heading three:
          text "Live Preview"
          margin 0 0 15px
        }
        
        paragraph:
          text "See your changes instantly as you type"
          color gray
        }
      }
      
      container:
        width 280px
        padding 30px
        background whitesmoke
        rounded 15px
        text-align center
        
        heading three:
          text "Export HTML"
          margin 0 0 15px
        }
        
        paragraph:
          text "Download clean, production-ready HTML"
          color gray
        }
      }
    }
  }
  
  footer:
    padding 40px
    background #333
    text-align center
    
    paragraph:
      text "Made with F++ - The English Programming Language"
      color white
      opacity 0.8
    }
  }
}`,
  },
  {
    id: 'pricing-table',
    title: 'Pricing Table',
    description: 'A pricing comparison table',
    category: 'advanced',
    code: `page:
  heading one:
    text "Pricing Plans"
    center
    margin 40px
  }
  
  container:
    flex center wrap
    gap 30px
    padding 20px
    
    container:
      width 280px
      padding 40px 30px
      background white
      rounded 15px
      shadow on
      text-align center
      
      heading three:
        text "Basic"
        color gray
        margin 0 0 10px
      }
      
      heading one:
        text "$9/mo"
        margin 0 0 20px
      }
      
      list:
        text-align left
        margin 0 0 30px
        
        item:
          text "5 Projects"
        }
        
        item:
          text "10GB Storage"
        }
        
        item:
          text "Email Support"
        }
      }
      
      button:
        text "Get Started"
        width 100%
        padding 12px
        border 2px solid blue
        background transparent
        color blue
        rounded 8px
      }
    }
    
    container:
      width 280px
      padding 40px 30px
      background #2563eb
      rounded 15px
      shadow on
      text-align center
      color white
      
      heading three:
        text "Pro"
        opacity 0.8
        margin 0 0 10px
      }
      
      heading one:
        text "$29/mo"
        margin 0 0 20px
      }
      
      list:
        text-align left
        margin 0 0 30px
        
        item:
          text "Unlimited Projects"
        }
        
        item:
          text "100GB Storage"
        }
        
        item:
          text "Priority Support"
        }
        
        item:
          text "Advanced Features"
        }
      }
      
      button:
        text "Get Started"
        width 100%
        padding 12px
        background white
        color blue
        rounded 8px
      }
    }
    
    container:
      width 280px
      padding 40px 30px
      background white
      rounded 15px
      shadow on
      text-align center
      
      heading three:
        text "Enterprise"
        color gray
        margin 0 0 10px
      }
      
      heading one:
        text "$99/mo"
        margin 0 0 20px
      }
      
      list:
        text-align left
        margin 0 0 30px
        
        item:
          text "Everything in Pro"
        }
        
        item:
          text "Unlimited Storage"
        }
        
        item:
          text "24/7 Support"
        }
        
        item:
          text "Custom Integrations"
        }
      }
      
      button:
        text "Contact Sales"
        width 100%
        padding 12px
        border 2px solid blue
        background transparent
        color blue
        rounded 8px
      }
    }
  }
}`,
  },
  
  // Tutorials
  {
    id: 'tutorial-getting-started',
    title: 'Getting Started Tutorial',
    description: 'Learn the basics of F++',
    category: 'tutorial',
    code: `// Welcome to F++! 
// This tutorial will teach you the basics.

// Every F++ document starts with 'page:'
page:
  // The page contains all your content
  
  // Let's add a title (appears in browser tab)
  title:
    text "My First Website"
  }
  
  // Headings are easy - just use 'heading one' through 'heading six'
  heading one:
    text "Welcome to F++!"
    color navy
    center
  }
  
  // Paragraphs are created with 'paragraph:'
  paragraph:
    text "F++ is a programming language that uses plain English. No brackets, no semicolons - just simple words!"
    size 18px
    margin 20px
    center
  }
  
  // You can add styles like colors, sizes, and spacing
  heading two:
    text "Easy Styling"
    color crimson
    font "Georgia"
  }
  
  // Links use the 'link:' element
  paragraph:
    text "Learn more on our "
    
    link:
      text "documentation page"
      link "https://example.com/docs"
      color blue
    }
  }
  
  // Buttons are simple too
  button:
    text "Click Me!"
    background green
    color white
    padding 15px 30px
    rounded 8px
    margin 20px
    cursor pointer
  }
}`,
  },
  {
    id: 'tutorial-styling',
    title: 'Styling Tutorial',
    description: 'Learn how to style elements',
    category: 'tutorial',
    code: `// F++ Styling Tutorial
// Learn how to make your elements beautiful!

page:
  title:
    text "Styling in F++"
  }
  
  heading one:
    text "Colors"
    color purple
  }
  
  paragraph:
    text "You can use color names like red, blue, green..."
    color teal
    margin 10px
  }
  
  paragraph:
    text "...or hex codes like #FF5733"
    color #FF5733
    margin 10px
  }
  
  heading two:
    text "Backgrounds"
    color navy
    margin 30px 0 15px
  }
  
  container:
    background lavender
    padding 20px
    rounded 10px
    margin 10px 0
    
    paragraph:
      text "This box has a background color and rounded corners!"
    }
  }
  
  heading two:
    text "Typography"
    color navy
    margin 30px 0 15px
  }
  
  paragraph:
    text "Google Fonts are supported!"
    font "Poppins"
    size 20px
    margin 10px
  }
  
  paragraph:
    text "Control font size, weight, and alignment"
    size 24px
    weight bold
    center
    margin 10px
  }
  
  heading two:
    text "Spacing"
    color navy
    margin 30px 0 15px
  }
  
  container:
    background whitesmoke
    padding 30px
    margin 10px
    border 2px dashed gray
    rounded 10px
    
    paragraph:
      text "This container has padding (inside space) and margin (outside space)"
      margin 0
    }
  }
  
  heading two:
    text "Shadows & Effects"
    color navy
    margin 30px 0 15px
  }
  
  container:
    background white
    padding 30px
    shadow on
    rounded 15px
    margin 10px
    
    paragraph:
      text "This card has a subtle shadow effect"
    }
  }
}`,
  },
  {
    id: 'tutorial-layouts',
    title: 'Layouts Tutorial',
    description: 'Learn flexbox and grid layouts',
    category: 'tutorial',
    code: `// F++ Layouts Tutorial
// Learn how to arrange elements on the page

page:
  title:
    text "Layouts in F++"
  }
  
  heading one:
    text "Flexbox Layout"
    color navy
    center
  }
  
  paragraph:
    text "Flexbox arranges items in a row or column"
    center
    margin 20px
  }
  
  // Basic flex container
  container:
    flex center
    gap 15px
    padding 20px
    background whitesmoke
    rounded 10px
    
    container:
      text "Item 1"
      background coral
      padding 20px 40px
      rounded 8px
    }
    
    container:
      text "Item 2"
      background skyblue
      padding 20px 40px
      rounded 8px
    }
    
    container:
      text "Item 3"
      background lightgreen
      padding 20px 40px
      rounded 8px
    }
  }
  
  heading two:
    text "Flex Column"
    color navy
    center
    margin 40px 0 20px
  }
  
  // Flex column
  container:
    flex column center
    gap 10px
    padding 20px
    background lavender
    rounded 10px
    
    button:
      text "Button 1"
      background purple
      color white
      padding 10px 20px
      rounded 5px
    }
    
    button:
      text "Button 2"
      background purple
      color white
      padding 10px 20px
      rounded 5px
    }
    
    button:
      text "Button 3"
      background purple
      color white
      padding 10px 20px
      rounded 5px
    }
  }
  
  heading two:
    text "CSS Grid"
    color navy
    center
    margin 40px 0 20px
  }
  
  // Grid layout
  container:
    grid 3-cols gap-20
    padding 20px
    
    container:
      text "Grid 1"
      background mistyrose
      padding 30px
      rounded 8px
      text-align center
    }
    
    container:
      text "Grid 2"
      background honeydew
      padding 30px
      rounded 8px
      text-align center
    }
    
    container:
      text "Grid 3"
      background aliceblue
      padding 30px
      rounded 8px
      text-align center
    }
    
    container:
      text "Grid 4"
      background peachpuff
      padding 30px
      rounded 8px
      text-align center
    }
    
    container:
      text "Grid 5"
      background thistle
      padding 30px
      rounded 8px
      text-align center
    }
    
    container:
      text "Grid 6"
      background palegreen
      padding 30px
      rounded 8px
      text-align center
    }
  }
}`,
  },
];

export const tutorials = [
  {
    id: 'intro',
    title: 'Introduction to F++',
    content: `# Introduction to F++

F++ is an English-like programming language that compiles to HTML. It's designed to make web development accessible to everyone.

## Why F++?

- **Readable**: Code that reads like English sentences
- **Simple**: No brackets, semicolons, or complex syntax
- **Powerful**: Generate any HTML you need
- **Fast**: Real-time preview as you type

## Basic Syntax

Every F++ document starts with \`page:\` and uses indentation to show structure.

\`\`\`
page:
  heading one:
    text "Hello World"
  }
}
\`\`\`

This generates:

\`\`\`html
<h1>Hello World</h1>
\`\`\`
`,
  },
  {
    id: 'elements',
    title: 'HTML Elements',
    content: `# HTML Elements in F++

F++ maps English words to HTML elements.

## Headings

\`\`\`
heading one:    → <h1>
heading two:    → <h2>
heading three:  → <h3>
heading four:   → <h4>
heading five:   → <h5>
heading six:    → <h6>
\`\`\`

## Text Elements

\`\`\`
paragraph   → <p>
text        → <span>
bold        → <strong>
italic      → <em>
quote       → <blockquote>
code        → <code>
\`\`\`

## Containers

\`\`\`
container   → <div>
section     → <section>
header      → <header>
footer      → <footer>
navigation  → <nav>
article     → <article>
aside       → <aside>
\`\`\`

## Media

\`\`\`
image   → <img>
video   → <video>
audio   → <audio>
\`\`\`
`,
  },
  {
    id: 'attributes',
    title: 'Attributes & Styles',
    content: `# Attributes & Styles

## Common Attributes

\`\`\`
id "my-id"           → id="my-id"
class "my-class"     → class="my-class"
link "https://..."   → href="https://..."
src "image.jpg"      → src="image.jpg"
alt "description"    → alt="description"
\`\`\`

## Styling

\`\`\`
color red          → style="color: red"
background blue    → style="background: blue"
size 20px          → style="font-size: 20px"
padding 20px       → style="padding: 20px"
margin 10px        → style="margin: 10px"
rounded 8px        → style="border-radius: 8px"
shadow on          → style="box-shadow: 0 4px 6px rgba(0,0,0,0.1)"
\`\`\`

## Google Fonts

\`\`\`
font "Roboto"
font "Poppins"
font "Playfair Display"
\`\`\`

## Layout

\`\`\`
flex              → display: flex
flex center       → flex with centered items
flex column       → flex with column direction
grid              → display: grid
grid 3-cols       → 3-column grid
center            → centered text
\`\`\`
`,
  },
];

export function getExamplesByCategory(category: FPPExample['category']): FPPExample[] {
  return examples.filter(e => e.category === category);
}

export function getExampleById(id: string): FPPExample | undefined {
  return examples.find(e => e.id === id);
}
