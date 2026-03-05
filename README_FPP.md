# F++ Programming Language

**F++** is an English-like programming language that compiles to HTML. Write code that reads like natural language!

## 🚀 Quick Start

```
page:
  heading one:
    text "Hello, World!"
    color blue
    center
  }
  
  paragraph:
    text "F++ makes web development simple."
  }
}
```

Compiles to clean HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>F++ Document</title>
</head>
<body>
  <h1 style="color: blue; text-align: center;">Hello, World!</h1>
  <p>F++ makes web development simple.</p>
</body>
</html>
```

## ✨ Features

- **English-like Syntax** - Code that reads like natural language
- **Live Preview** - See your changes instantly
- **Google Fonts Support** - Easy typography
- **HTML to F++ Conversion** - Convert existing HTML
- **Download HTML** - Export production-ready code

## 📖 Elements

| F++ Keyword | HTML Tag |
|-------------|----------|
| `page` | `<html>` |
| `heading one` | `<h1>` |
| `heading two` | `<h2>` |
| `paragraph` | `<p>` |
| `link` | `<a>` |
| `image` | `<img>` |
| `button` | `<button>` |
| `input` | `<input>` |
| `container` | `<div>` |
| `list` | `<ul>` |
| `item` | `<li>` |
| `section` | `<section>` |
| `header` | `<header>` |
| `footer` | `<footer>` |
| `navigation` | `<nav>` |
| `form` | `<form>` |
| `table` | `<table>` |
| `video` | `<video>` |
| `audio` | `<audio>` |

## 🎨 Styling

### Colors
```
color red
color #FF5733
background blue
```

### Typography
```
size 20px
font "Roboto"
weight bold
```

### Layout
```
flex center
grid 3-cols
padding 20px
margin 10px
rounded 8px
shadow on
```

## 📦 Installation

```bash
git clone https://github.com/romanete366-tech/fpp.git
cd fpp
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to start coding in F++!

## 📚 Examples

### Landing Page
```
page:
  header:
    flex center
    padding 20px
    
    navigation:
      link:
        text "Home"
        link "/"
      }
    }
  }
  
  section:
    heading one:
      text "Welcome"
      center
    }
    
    button:
      text "Get Started"
      background blue
      color white
    }
  }
}
```

### Form
```
page:
  form:
    width 400px
    margin auto
    
    input:
      type text
      placeholder "Your name"
    }
    
    button:
      text "Submit"
      background green
      color white
    }
  }
}
```

## 🔧 API

### Compile F++ to HTML

```typescript
import { compileFPP } from '@/lib/fpp';

const result = compileFPP(fppCode);
console.log(result.html);
```

### Convert HTML to F++

```typescript
import { decompileHTML } from '@/lib/fpp';

const fppCode = decompileHTML(htmlString);
console.log(fppCode);
```

## 📄 License

MIT License - Feel free to use F++ in your projects!

---

Made with ❤️ by the F++ Team
