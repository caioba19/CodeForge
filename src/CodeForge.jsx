import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// =============================================================================
// 1. TRANSLATIONS
// =============================================================================

const T = {
  pt: {
    editorTitle:      "Editor",
    run:              "Executar",
    send:             "Enviar",
    switchLang:       "EN",
    stdinLabel:       "Entrada (stdin)",
    stdinPlaceholder: "Uma linha por valor: ex. 5 → Enter → João",
    download:         "Baixar",
    reset:            "Resetar",
    fullscreen:       "Tela cheia",
    exitFs:           "Sair",
    examples:         "Exemplos",
    outputLabel:      "Saída",
    lines:            "linhas",
    chars:            "chars",
    clearOutput:      "Limpar",
    copyOutput:       "Copiar",
    history:          "Histórico",
    noHistory:        "Nenhuma execução ainda.",
    execIn:           "em",
    newFile:          "Novo arquivo",
    wrap:             "Quebra",
    shortcuts:        "Atalhos",
    themes:           "Tema",
    bracketWarn:      "( [ { não fechados",
    dblClickRename:   "Duplo clique para renomear",
    lastRun:          "Última execução",
    noRun:            "Nenhuma execução ainda.",
    variables:        "Variáveis detectadas",
    outputStats:      "Estatísticas",
    clearStorage:     "Limpar dados salvos",
    storageCleared:   "Dados apagados!",
    saved:            "Salvo",
  },
  en: {
    editorTitle:      "Editor",
    run:              "Run",
    send:             "Send",
    switchLang:       "PT",
    stdinLabel:       "Input (stdin)",
    stdinPlaceholder: "One value per line: e.g. 5 → Enter → João",
    download:         "Download",
    reset:            "Reset",
    fullscreen:       "Fullscreen",
    exitFs:           "Exit",
    examples:         "Examples",
    outputLabel:      "Output",
    lines:            "lines",
    chars:            "chars",
    clearOutput:      "Clear",
    copyOutput:       "Copy",
    history:          "History",
    noHistory:        "No executions yet.",
    execIn:           "in",
    newFile:          "New file",
    wrap:             "Wrap",
    shortcuts:        "Shortcuts",
    themes:           "Theme",
    bracketWarn:      "Unclosed ( [ {",
    dblClickRename:   "Double-click to rename",
    lastRun:          "Last run",
    noRun:            "No runs yet.",
    variables:        "Detected variables",
    outputStats:      "Stats",
    clearStorage:     "Clear saved data",
    storageCleared:   "Data cleared!",
    saved:            "Saved",
  },
};

// =============================================================================
// 2. COLOR THEMES
// =============================================================================

const COLOR_THEMES = {
  dark: {
    name: "Dark",
    bg: "#0D1117",        topbar: "#161B22",    border: "#30363D",
    text: "#E6EDF3",      subtext: "#8B949E",
    editorBg: "#0D1117",  outputBg: "#0A0E15",
    lineNum: "#4C4F56",   panelBg: "#161B22",   inputBg: "#21262D",
    msgAiBg: "#161B22",   msgAiBorder: "#30363D",
    msgUserBg: "rgba(100,0,255,0.22)",  msgUserBdr: "rgba(100,0,255,0.4)",
    accent: "#00FFAA",
    kwColor: "#FF7B72",   strColor: "#A5D6FF",  commentColor: "#6E7681",
    numColor: "#79C0FF",  funcColor: "#D2A8FF",
  },
  light: {
    name: "Light",
    bg: "#F6F8FA",        topbar: "#FFFFFF",    border: "#D0D7DE",
    text: "#24292F",      subtext: "#656D76",
    editorBg: "#FFFFFF",  outputBg: "#F0F3F6",
    lineNum: "#B0B8C4",   panelBg: "#F0F3F6",   inputBg: "#E8ECF0",
    msgAiBg: "#EEF2FF",   msgAiBorder: "#C8D3FF",
    msgUserBg: "rgba(100,0,255,0.08)",  msgUserBdr: "rgba(100,0,255,0.25)",
    accent: "#0A7F5E",
    kwColor: "#D73A49",   strColor: "#032F62",  commentColor: "#6A737D",
    numColor: "#005CC5",  funcColor: "#6F42C1",
  },
  monokai: {
    name: "Monokai",
    bg: "#272822",        topbar: "#1E1F1C",    border: "#3E3D32",
    text: "#F8F8F2",      subtext: "#75715E",
    editorBg: "#272822",  outputBg: "#1A1B18",
    lineNum: "#75715E",   panelBg: "#1E1F1C",   inputBg: "#3E3D32",
    msgAiBg: "#1E1F1C",   msgAiBorder: "#3E3D32",
    msgUserBg: "rgba(166,226,46,0.12)", msgUserBdr: "rgba(166,226,46,0.35)",
    accent: "#A6E22E",
    kwColor: "#F92672",   strColor: "#E6DB74",  commentColor: "#75715E",
    numColor: "#AE81FF",  funcColor: "#66D9EF",
  },
  dracula: {
    name: "Dracula",
    bg: "#282A36",        topbar: "#21222C",    border: "#44475A",
    text: "#F8F8F2",      subtext: "#6272A4",
    editorBg: "#282A36",  outputBg: "#1E1F29",
    lineNum: "#6272A4",   panelBg: "#21222C",   inputBg: "#44475A",
    msgAiBg: "#21222C",   msgAiBorder: "#44475A",
    msgUserBg: "rgba(189,147,249,0.15)", msgUserBdr: "rgba(189,147,249,0.4)",
    accent: "#50FA7B",
    kwColor: "#FF79C6",   strColor: "#F1FA8C",  commentColor: "#6272A4",
    numColor: "#BD93F9",  funcColor: "#8BE9FD",
  },
  solarized: {
    name: "Solarized",
    bg: "#002B36",        topbar: "#073642",    border: "#586E75",
    text: "#93A1A1",      subtext: "#657B83",
    editorBg: "#002B36",  outputBg: "#00212B",
    lineNum: "#586E75",   panelBg: "#073642",   inputBg: "#073642",
    msgAiBg: "#073642",   msgAiBorder: "#586E75",
    msgUserBg: "rgba(42,161,152,0.15)", msgUserBdr: "rgba(42,161,152,0.4)",
    accent: "#2AA198",
    kwColor: "#859900",   strColor: "#2AA198",  commentColor: "#586E75",
    numColor: "#D33682",  funcColor: "#268BD2",
  },
  nord: {
    name: "Nord",
    bg: "#2E3440",        topbar: "#3B4252",    border: "#4C566A",
    text: "#ECEFF4",      subtext: "#D8DEE9",
    editorBg: "#2E3440",  outputBg: "#242831",
    lineNum: "#4C566A",   panelBg: "#3B4252",   inputBg: "#4C566A",
    msgAiBg: "#3B4252",   msgAiBorder: "#4C566A",
    msgUserBg: "rgba(136,192,208,0.12)", msgUserBdr: "rgba(136,192,208,0.35)",
    accent: "#88C0D0",
    kwColor: "#81A1C1",   strColor: "#A3BE8C",  commentColor: "#616E88",
    numColor: "#B48EAD",  funcColor: "#88C0D0",
  },
};

// =============================================================================
// 3. LANGUAGE DATA  (templates, examples, extensions, groups)
// =============================================================================

const TEMPLATES = {
  "Python":               `# Python\nprint("Bem-vindo ao CodeForge!")`,
  "JavaScript (Node.js)": `// JavaScript\nconsole.log("Bem-vindo ao CodeForge!")`,
  "TypeScript":           `// TypeScript\nconst msg: string = "Bem-vindo ao CodeForge!";\nconsole.log(msg);`,
  "Java":                 `// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Bem-vindo ao CodeForge!");\n    }\n}`,
  "C":                    `// C\n#include <stdio.h>\nint main() {\n    printf("Bem-vindo ao CodeForge!\\n");\n    return 0;\n}`,
  "C++":                  `// C++\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Bem-vindo ao CodeForge!" << endl;\n    return 0;\n}`,
  "C#":                   `// C#\nusing System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Bem-vindo ao CodeForge!");\n    }\n}`,
  "PHP":                  `<?php\necho "Bem-vindo ao CodeForge!";\n?>`,
  "SQL":                  `-- SQL\nSELECT 'Bem-vindo ao CodeForge!' AS mensagem;`,
  "Lua":                  `-- Lua\nprint("Bem-vindo ao CodeForge!")`,
  "Ruby":                 `# Ruby\nputs "Bem-vindo ao CodeForge!"`,
  "Bash / Shell":         `#!/bin/bash\n# Bash\necho "Bem-vindo ao CodeForge!"`,
  "R":                    `# R\nprint("Bem-vindo ao CodeForge!")`,
  "Go":                   `// Go\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Bem-vindo ao CodeForge!")\n}`,
  "Rust":                 `// Rust\nfn main() {\n    println!("Bem-vindo ao CodeForge!");\n}`,
  "Swift":                `// Swift\nprint("Bem-vindo ao CodeForge!")`,
  "Kotlin":               `// Kotlin\nfun main() {\n    println("Bem-vindo ao CodeForge!")\n}`,
  "Dart":                 `// Dart\nvoid main() {\n    print("Bem-vindo ao CodeForge!");\n}`,
  "Julia":                `# Julia\nprintln("Bem-vindo ao CodeForge!")`,
  "MATLAB":               `% MATLAB\ndisp('Bem-vindo ao CodeForge!')`,
  "NumPy":                `# NumPy\nimport numpy as np\nprint("Bem-vindo ao CodeForge!")`,
  "Pandas":               `# Pandas\nimport pandas as pd\nprint("Bem-vindo ao CodeForge!")`,
  "DSA":                  `# DSA\nprint("Bem-vindo ao CodeForge!")`,
  "Haskell":              `-- Haskell\nmain :: IO ()\nmain = putStrLn "Bem-vindo ao CodeForge!"`,
  "Scala":                `// Scala\nobject Main extends App {\n    println("Bem-vindo ao CodeForge!")\n}`,
  "Elixir":               `# Elixir\nIO.puts("Bem-vindo ao CodeForge!")`,
  "Assembly":             `; Assembly (NASM x86 Linux)\nsection .data\n    msg db "Bem-vindo ao CodeForge!", 10\n    len equ $ - msg\nsection .text\n    global _start\n_start:\n    mov eax, 4\n    mov ebx, 1\n    mov ecx, msg\n    mov edx, len\n    int 0x80\n    mov eax, 1\n    xor ebx, ebx\n    int 0x80`,
  "Pascal":               `{ Pascal }\nprogram Main;\nbegin\n    WriteLn('Bem-vindo ao CodeForge!');\nend.`,
  "COBOL":                `      * COBOL\n       IDENTIFICATION DIVISION.\n       PROGRAM-ID. MAIN.\n       PROCEDURE DIVISION.\n           DISPLAY "Bem-vindo ao CodeForge!"\n           STOP RUN.`,
  "Fortran":              `! Fortran\nprogram main\n    print *, "Bem-vindo ao CodeForge!"\nend program main`,
  "Perl":                 `# Perl\nprint("Bem-vindo ao CodeForge!\\n");`,
  "OCaml":                `(* OCaml *)\nlet () = print_endline "Bem-vindo ao CodeForge!"`,
  "Visual Basic":         `' Visual Basic\nModule Main\n    Sub Main()\n        Console.WriteLine("Bem-vindo ao CodeForge!")\n    End Sub\nEnd Module`,
  "Objective-C":          `// Objective-C\n#import <Foundation/Foundation.h>\nint main() {\n    NSLog(@"Bem-vindo ao CodeForge!");\n    return 0;\n}`,
  "Prolog":               `% Prolog\n:- initialization(main).\nmain :- write('Bem-vindo ao CodeForge!'), nl.`,
  "Zig":                  `// Zig\nconst std = @import("std");\npub fn main() void {\n    std.debug.print("Bem-vindo ao CodeForge!\\n", .{});\n}`,
  "Ada":                  `-- Ada\nwith Ada.Text_IO; use Ada.Text_IO;\nprocedure Main is\nbegin\n    Put_Line ("Bem-vindo ao CodeForge!");\nend Main;`,
  "Tcl":                  `# Tcl\nputs "Bem-vindo ao CodeForge!"`,
  "D":                    `// D\nimport std.stdio;\nvoid main() {\n    writeln("Bem-vindo ao CodeForge!");\n}`,
};

const EXAMPLES = {
  "Python": [
    { label: "Fatorial",    code: `def fatorial(n):\n    if n <= 1:\n        return 1\n    return n * fatorial(n - 1)\n\nn = int(input("Digite um número: "))\nprint(f"Fatorial de {n} = {fatorial(n)}")` },
    { label: "Fibonacci",   code: `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a, end=" ")\n        a, b = b, a + b\nfibonacci(10)` },
    { label: "Bubble Sort", code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\nprint("Ordenado:", bubble_sort([64, 34, 25, 12, 22, 11, 90]))` },
    { label: "IMC",         code: `peso = float(input("Peso (kg): "))\naltura = float(input("Altura (m): "))\nimc = peso / (altura ** 2)\nprint(f"IMC: {imc:.2f}")\nif imc < 18.5: print("Abaixo do peso")\nelif imc < 25: print("Peso normal")\nelse: print("Acima do peso")` },
  ],
  "JavaScript (Node.js)": [
    { label: "Fatorial",    code: `function fatorial(n) {\n    if (n <= 1) return 1;\n    return n * fatorial(n - 1);\n}\nconsole.log("Fatorial de 5:", fatorial(5));` },
    { label: "Fibonacci",   code: `function fibonacci(n) {\n    let a = 0, b = 1;\n    for (let i = 0; i < n; i++) {\n        process.stdout.write(a + " ");\n        [a, b] = [b, a + b];\n    }\n}\nfibonacci(10);` },
    { label: "Bubble Sort", code: `function bubbleSort(arr) {\n    for (let i = 0; i < arr.length; i++)\n        for (let j = 0; j < arr.length-i-1; j++)\n            if (arr[j] > arr[j+1]) [arr[j],arr[j+1]] = [arr[j+1],arr[j]];\n    return arr;\n}\nconsole.log(bubbleSort([64,34,25,12,22,11,90]));` },
  ],
  "Java": [
    { label: "Fatorial",  code: `public class Main {\n    static int fatorial(int n) {\n        if (n <= 1) return 1;\n        return n * fatorial(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println("Fatorial de 5: " + fatorial(5));\n    }\n}` },
    { label: "Fibonacci", code: `public class Main {\n    public static void main(String[] args) {\n        int a = 0, b = 1;\n        for (int i = 0; i < 10; i++) {\n            System.out.print(a + " ");\n            int t = a+b; a = b; b = t;\n        }\n    }\n}` },
  ],
  "C": [
    { label: "Fatorial",  code: `#include <stdio.h>\nint fatorial(int n) {\n    if (n <= 1) return 1;\n    return n * fatorial(n - 1);\n}\nint main() {\n    printf("Fatorial de 5: %d\\n", fatorial(5));\n    return 0;\n}` },
    { label: "Fibonacci", code: `#include <stdio.h>\nint main() {\n    int a=0,b=1,t;\n    for(int i=0;i<10;i++){printf("%d ",a);t=a+b;a=b;b=t;}\n    return 0;\n}` },
  ],
  "C++":  [{ label: "Fatorial", code: `#include <iostream>\nusing namespace std;\nint fatorial(int n){return n<=1?1:n*fatorial(n-1);}\nint main(){\n    cout<<"Fatorial de 5: "<<fatorial(5)<<endl;\n}` }],
  "Go":   [{ label: "Fatorial", code: `package main\nimport "fmt"\nfunc fatorial(n int) int {\n    if n<=1{return 1}\n    return n*fatorial(n-1)\n}\nfunc main(){\n    fmt.Println("Fatorial de 5:",fatorial(5))\n}` }],
  "Rust": [{ label: "Fatorial", code: `fn fatorial(n:u64)->u64{if n<=1{1}else{n*fatorial(n-1)}}\nfn main(){\n    println!("Fatorial de 5: {}",fatorial(5));\n}` }],
};

const EXT = {
  "Python": "py",  "JavaScript (Node.js)": "js", "TypeScript": "ts",
  "Java": "java",  "C": "c",                     "C++": "cpp",
  "C#": "cs",      "PHP": "php",                 "SQL": "sql",
  "Lua": "lua",    "Ruby": "rb",                 "Bash / Shell": "sh",
  "R": "r",        "Go": "go",                   "Rust": "rs",
  "Swift": "swift","Kotlin": "kt",               "Dart": "dart",
  "Julia": "jl",   "MATLAB": "m",                "NumPy": "py",
  "Pandas": "py",  "DSA": "py",                  "Haskell": "hs",
  "Scala": "scala","Elixir": "ex",               "Assembly": "asm",
  "Pascal": "pas", "COBOL": "cob",               "Fortran": "f90",
  "Perl": "pl",    "OCaml": "ml",                "Visual Basic": "vb",
  "Objective-C": "m", "Prolog": "pl",            "Zig": "zig",
  "Ada": "adb",    "Tcl": "tcl",                 "D": "d",
};

const LANG_GROUPS = [
  { label: "── Populares ──",          langs: ["Python", "JavaScript (Node.js)", "TypeScript", "Java", "C", "C++", "C#"] },
  { label: "── Web & Script ──",       langs: ["PHP", "SQL", "Lua", "Ruby", "Bash / Shell", "Perl", "Tcl"] },
  { label: "── Ciência & Dados ──",    langs: ["R", "Julia", "MATLAB", "NumPy", "Pandas", "DSA", "Fortran"] },
  { label: "── Algoritmos ──",         langs: ["Prolog"] },
  { label: "── Sistemas & Moderno ──", langs: ["Go", "Rust", "Swift", "Kotlin", "Dart", "Zig", "D", "Ada", "Objective-C"] },
  { label: "── Funcional ──",          langs: ["Haskell", "Scala", "Elixir", "OCaml"] },
  { label: "── Clássicas ──",          langs: ["Pascal", "COBOL", "Visual Basic", "Assembly"] },
];

// Linguagens executadas diretamente no browser (sem API externa):
// Python/NumPy/Pandas/DSA → Pyodide (WebAssembly)
// JavaScript/TypeScript   → eval() com captura de console.log
// Demais linguagens       → exibem mensagem de não suporte

// =============================================================================
// 4. SYNTAX HIGHLIGHTER CONSTANTS  (module-level — built once, never rebuilt)
// =============================================================================

const _KW = {
  Python:     new Set("def class import from return if elif else for while in not and or is None True False try except finally with as pass break continue lambda yield raise del global nonlocal assert async await".split(" ")),
  JavaScript: new Set("const let var function return if else for while do switch case break continue new typeof instanceof class extends import export default async await try catch finally throw null undefined true false this super of in delete void".split(" ")),
  TypeScript: new Set("const let var function return if else for while class extends import export async await try catch null undefined true false this type interface string number boolean readonly enum namespace".split(" ")),
  C:          new Set("int float double char void if else for while do return struct typedef sizeof static const unsigned long short bool true false switch case break continue NULL include define extern register".split(" ")),
  Cpp:        new Set("int float double char void bool if else for while do return class struct new delete namespace using cout cin endl true false const static template typename public private protected virtual override".split(" ")),
  Java:       new Set("public private protected static void int String boolean class interface extends implements new return if else for while try catch finally throw throws import null true false this super final abstract synchronized".split(" ")),
  Go:         new Set("func package import var const type struct interface return if else for range switch case break continue go defer make new nil true false error chan select".split(" ")),
  Rust:       new Set("fn let mut const use mod pub struct enum impl trait return if else for while loop match break continue self true false as where type unsafe extern async await".split(" ")),
  Kotlin:     new Set("fun val var class if else for while return when null true false object import package try catch this super data sealed override".split(" ")),
  Swift:      new Set("func var let class struct if else for while return import nil true false switch case guard in self".split(" ")),
};

// Maps language names → keyword set key
const _KW_ALIAS = {
  "NumPy": "Python",  "Pandas": "Python",  "DSA": "Python",
  "Julia": "Python",  "Ruby": "Python",    "Elixir": "Python",
  "C#": "C",          "Dart": "Java",      "Scala": "Java",
  "Objective-C": "C", "C++": "Cpp",        "JavaScript (Node.js)": "JavaScript",
};

// Comment-style sets — each language belongs to exactly one
const _HASH_COM = new Set(["Python", "Ruby", "Bash / Shell", "R", "Perl", "Tcl", "Julia", "MATLAB", "NumPy", "Pandas", "DSA", "Elixir"]);
const _SQL_COM  = new Set(["SQL", "Lua", "Haskell", "Ada"]); // -- comments only
const _SEMI_COM = new Set(["Assembly"]);
const _PCT_COM  = new Set(["MATLAB", "Prolog"]);
const _BANG_COM = new Set(["Fortran"]);
const _STAR_COM = new Set(["COBOL"]);   // * in column 7

// Languages where bracket checking produces false positives
const _NO_BRACKET_CHECK = new Set([
  "SQL", "Prolog", "COBOL", "Fortran", "Assembly",
  "Pascal", "Ada", "MATLAB", "R", "Haskell", "OCaml",
  "Elixir", "Bash / Shell",
]);

// Auto-close pairs (shared between highlighter and keyboard handler)
const _PAIRS = { "(": ")", "{": "}", "[": "]", '"': '"', "'": "'", "`": "`" };

// Languages where ' is NOT a string delimiter
const _NO_SQ_LANGS = new Set(["Haskell", "OCaml", "Prolog", "Ada"]);

// Control-flow keywords — should NOT be highlighted as function calls
const _CTRL = new Set([
  "if", "elif", "else", "for", "while", "do", "switch", "case",
  "catch", "class", "function", "fn", "func", "def", "unless",
  "when", "match", "loop", "guard", "try", "except", "finally",
  "with", "return", "import", "from",
]);

// =============================================================================
// 5. PURE UTILITY FUNCTIONS
// =============================================================================

/**
 * Tokenizer-based syntax highlighter.
 * Returns an HTML string with colored <span> elements.
 */
function highlight(code, lang, theme) {
  const { kwColor: kw, strColor: str, commentColor: com, numColor: num, funcColor: fn } = theme;
  const kwSet = _KW[_KW_ALIAS[lang] || lang] || new Set();
  const esc   = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const tokens = [];
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    // Single-line: //  (not in hash/SQL languages)
    if (ch === "/" && code[i+1] === "/" && !_HASH_COM.has(lang) && !_SQL_COM.has(lang)) {
      const end = code.indexOf("\n", i);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // Block: /* ... */
    if (ch === "/" && code[i+1] === "*") {
      const end = code.indexOf("*/", i+2);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end+2);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // OCaml: (* ... *)
    if (ch === "(" && code[i+1] === "*" && lang === "OCaml") {
      const end = code.indexOf("*)", i+2);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end+2);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // Hash: #
    if (ch === "#" && _HASH_COM.has(lang)) {
      const end = code.indexOf("\n", i);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // Double-dash: --
    if (ch === "-" && code[i+1] === "-" && _SQL_COM.has(lang)) {
      const end = code.indexOf("\n", i);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // Semicolon: ;  (Assembly)
    if (ch === ";" && _SEMI_COM.has(lang)) {
      const end = code.indexOf("\n", i);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // Percent: %  (MATLAB, Prolog)
    if (ch === "%" && _PCT_COM.has(lang)) {
      const end = code.indexOf("\n", i);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // Bang: !  (Fortran)
    if (ch === "!" && _BANG_COM.has(lang)) {
      const end = code.indexOf("\n", i);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // Pascal block: { ... }
    if (ch === "{" && lang === "Pascal") {
      const end = code.indexOf("}", i);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end+1);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // COBOL: * as first non-space on a line
    if (ch === "*" && _STAR_COM.has(lang) && (i === 0 || code[i-1] === "\n")) {
      const end = code.indexOf("\n", i);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }
    // VB line: '
    if (ch === "'" && lang === "Visual Basic") {
      const end = code.indexOf("\n", i);
      const raw = end < 0 ? code.slice(i) : code.slice(i, end);
      tokens.push({ t: "com", v: raw }); i += raw.length; continue;
    }

    // String literals: "  '  `
    if (ch === '"' || ch === "'" || ch === "`") {
      if (ch === "'" && _NO_SQ_LANGS.has(lang)) {
        tokens.push({ t: "other", v: ch }); i++; continue;
      }
      const q = ch;
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\" && q !== "`") { j += 2; continue; }  // escape
        if (code[j] === q)                 { j++; break; }         // closing
        if (code[j] === "\n" && q !== "`") break;                  // unterminated
        j++;
      }
      tokens.push({ t: "str", v: code.slice(i, j) }); i = j; continue;
    }

    // Numeric literals: hex, binary, float, int
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(code[i+1] || ""))) {
      let j = i;
      if (code[j] === "0" && /[xX]/.test(code[j+1])) {
        j += 2; while (j < code.length && /[0-9a-fA-F_]/.test(code[j])) j++;
      } else if (code[j] === "0" && /[bB]/.test(code[j+1])) {
        j += 2; while (j < code.length && /[01_]/.test(code[j])) j++;
      } else {
        while (j < code.length && /[\d._eE]/.test(code[j])) j++;
        if (code[j] === "-" && /[eE]/.test(code[j-1])) j++;
      }
      tokens.push({ t: "num", v: code.slice(i, j) }); i = j; continue;
    }

    // Identifiers, keywords, function calls
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i;
      while (j < code.length && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);

      // Look ahead past whitespace for '('
      let k = j;
      while (k < code.length && (code[k] === " " || code[k] === "\t")) k++;
      const isFnCall = code[k] === "(" && !_CTRL.has(word) && !kwSet.has(word);

      tokens.push({ t: "word", v: word, kw: kwSet.has(word), fn: isFnCall });
      i = j; continue;
    }

    tokens.push({ t: "other", v: ch }); i++;
  }

  return tokens.map(tok => {
    const e = esc(tok.v);
    switch (tok.t) {
      case "com":  return `<span style="color:${com};font-style:italic">${e}</span>`;
      case "str":  return `<span style="color:${str}">${e}</span>`;
      case "num":  return `<span style="color:${num}">${e}</span>`;
      case "word":
        if (tok.kw) return `<span style="color:${kw};font-weight:600">${e}</span>`;
        if (tok.fn) return `<span style="color:${fn}">${e}</span>`;
        return e;
      default:     return e;
    }
  }).join("");
}

/**
 * Returns true if source code has unmatched bracket pairs.
 * Accepts lang to strip only the comment style of that language,
 * preventing false positives (e.g. ; inside C for-loops).
 */
function checkBrackets(code, lang) {
  // Step 1: replace string contents with spaces
  let s = "";
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const q = ch;
      s += " "; i++;
      while (i < code.length) {
        if (code[i] === "\\") { s += "  "; i += 2; continue; }
        if (code[i] === q)    { s += " "; i++; break; }
        s += " "; i++;
      }
      continue;
    }
    s += ch; i++;
  }

  // Step 2: strip only the comment style(s) relevant to this language
  s = s.replace(/\/\*[\s\S]*?\*\//g, "");            // block /* */  (all)
  if (!_HASH_COM.has(lang))    s = s.replace(/\/\/[^\n]*/g,   ""); // line //
  if (_HASH_COM.has(lang))     s = s.replace(/#[^\n]*/g,      ""); // line #
  if (_SQL_COM.has(lang))      s = s.replace(/--[^\n]*/g,     ""); // line --
  if (_SEMI_COM.has(lang))     s = s.replace(/;[^\n]*/g,      ""); // line ; (Assembly only)
  if (_PCT_COM.has(lang))      s = s.replace(/%[^\n]*/g,      ""); // line %
  if (_BANG_COM.has(lang))     s = s.replace(/![^\n]*/g,      ""); // line !
  if (_STAR_COM.has(lang))     s = s.replace(/^\s*\*.*/gm,    ""); // COBOL *
  if (lang === "Pascal")       s = s.replace(/\{[^}]*\}/g,   ""); // block { }
  if (lang === "Visual Basic") s = s.replace(/'[^\n]*/g,      ""); // line '
  if (lang === "OCaml")        s = s.replace(/\(\*[\s\S]*?\*\)/g, ""); // block (* *)

  // Step 3: balance check
  const stack = [];
  const CLOSE = { ")": "(", "]": "[", "}": "{" };
  const OPEN  = new Set(["(", "[", "{"]);

  for (const ch of s) {
    if (OPEN.has(ch))   { stack.push(ch); }
    else if (CLOSE[ch]) {
      if (stack[stack.length - 1] !== CLOSE[ch]) return true;
      stack.pop();
    }
  }
  return stack.length > 0;
}

/**
 * Extracts the first line number found in a runtime error string.
 */
function parseErrorLine(output) {
  const patterns = [
    /linha\s+(\d+)/i,
    /line\s+(\d+)/i,
    /:(\d+):/,
    /\bat\s+(\d+)\b/i,
    /\[(\d+)\]/,
    /erro.*?(\d+)/i,
  ];
  for (const p of patterns) {
    const m = output.match(p);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

/**
 * Returns summary statistics for an execution output string.
 */
function getOutputStats(output) {
  if (!output || output === "─") return null;
  const lines   = output.split("\n").filter(Boolean);
  const isError = output.startsWith("ERRO") || output.startsWith("❌");
  return {
    lines:   lines.length,
    chars:   output.length,
    isError,
    preview: lines[0]?.slice(0, 40) || "",
  };
}

// =============================================================================
// 6. LOCALSTORAGE PERSISTENCE
// =============================================================================

const LS_KEY = "codeforge_v1";

function lsLoad() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function lsSave(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); }
  catch { /* ignore quota errors */ }
}

// =============================================================================
// =============================================================================
// 7. MAIN COMPONENT
// =============================================================================
export default function CodeForge() {

  // ── Restore persisted state (runs only once at mount) ──────────────────────
  const _ls = useMemo(() => lsLoad(), []);

  // ── UI preferences ─────────────────────────────────────────────────────────
  const [uiLang,       setUiLang]       = useState(() => _ls?.uiLang      ?? "pt");
  const [themeName,    setThemeName]    = useState(() => _ls?.themeName   ?? "dark");
  const [fontSize,     setFontSize]     = useState(() => _ls?.fontSize    ?? 13);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle real browser fullscreen
  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  // Keep isFullscreen state in sync with actual browser fullscreen state
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const [wordWrap,     setWordWrap]     = useState(() => _ls?.wordWrap    ?? true);
  const [highlightOn,  setHighlightOn]  = useState(() => _ls?.highlightOn ?? true);

  // ── Dropdown / overlay visibility ──────────────────────────────────────────
  const [showExamples,  setShowExamples]  = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showThemes,    setShowThemes]    = useState(false);
  const [showHistory,   setShowHistory]   = useState(false);

  // ── File tab rename ─────────────────────────────────────────────────────────
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal,  setRenameVal]  = useState("");

  // ── Resizable output panel ──────────────────────────────────────────────────
  const [outputW,     setOutputW]     = useState(() => _ls?.outputW ?? 360);
  const [sidebarOpen, setSidebarOpen] = useState(() => _ls?.sidebarOpen ?? true);
  const [sidebarTab,  setSidebarTab]  = useState(() => _ls?.sidebarTab  ?? 'explorer');
  const isDraggingRef = useRef(false);
  const dragStartRef  = useRef(0);
  const dragBaseRef   = useRef(0);

  // ── Files ───────────────────────────────────────────────────────────────────
  const fileIdRef = useRef(_ls?.fileIdCounter ?? 2);
  const [files, setFiles] = useState(() => {
    if (_ls?.files?.length) return _ls.files;
    return [{ id: 1, name: "main.py", lang: "Python", code: TEMPLATES["Python"], stdin: "" }];
  });
  const [activeFileId, setActiveFileId] = useState(() => _ls?.activeFileId ?? 1);

  // ── Execution ───────────────────────────────────────────────────────────────
  const [output,       setOutput]       = useState("");
  const [execTime,     setExecTime]     = useState(null);
  const [errorLine,    setErrorLine]    = useState(null);
  const [execHistory,  setExecHistory]  = useState(() => _ls?.execHistory ?? []);
  const [outputCopied, setOutputCopied] = useState(false);
  const [lastRunInfo,  setLastRunInfo]  = useState(null);
  const [isRunning,    setIsRunning]    = useState(false);
  const abortRef    = useRef(null);
  const pyodideRef  = useRef(null);  // Pyodide instance (loaded on demand)

  // ── AI chat ─────────────────────────────────────────────────────────────────

  // ── Editor state ────────────────────────────────────────────────────────────
  const [hlHtml,      setHlHtml]      = useState("");
  const [bracketWarn, setBracketWarn] = useState(false);
  const [savedToast,  setSavedToast]  = useState(false);

  // ── DOM refs ────────────────────────────────────────────────────────────────
  const textareaRef    = useRef(null);
  const highlightRef   = useRef(null);
  const lineNumRef     = useRef(null);
  const renameInputRef = useRef(null);

  // ── Timer refs ──────────────────────────────────────────────────────────────
  const hlTimer    = useRef(null);
  const bkTimer    = useRef(null);
  const lsTimer    = useRef(null);
  const toastTimer = useRef(null);

  // handleRun ref — lets handleKeyDown call the latest run without being in its deps
  const handleRunRef = useRef(null);

  // ── Derived values ──────────────────────────────────────────────────────────
  const t  = T[uiLang];
  const c  = COLOR_THEMES[themeName];
  const af = useMemo(
    () => files.find(f => f.id === activeFileId) || files[0],
    [files, activeFileId]
  );
  const code         = af.code;
  const stdin        = af.stdin;
  const selectedLang = af.lang;

  const lineCount   = useMemo(() => code.split("\n").length, [code]);
  const charCount   = useMemo(() => code.length,             [code]);
  const lineNumbers = useMemo(
    () => code.split("\n").map((_, idx) => ({ n: idx + 1, err: errorLine === idx + 1 })),
    [code, errorLine]
  );
  const examples = useMemo(
    () => EXAMPLES[selectedLang] || [{ label: "Hello World", code: TEMPLATES[selectedLang] }],
    [selectedLang]
  );
  const edStyle = useMemo(
    () => ({ fontFamily: "'Courier New',monospace", fontSize: `${fontSize}px`, lineHeight: "1.65" }),
    [fontSize]
  );
  const SHORTCUTS = useMemo(() => [
    { key: "Ctrl+Enter",         desc: uiLang === "pt" ? "Executar código"       : "Run code" },
    { key: "Tab",                desc: uiLang === "pt" ? "4 espaços"             : "4 spaces" },
    { key: "Enter",              desc: uiLang === "pt" ? "Mantém indentação"     : "Keeps indentation" },
    { key: "( [ { \" '",         desc: uiLang === "pt" ? "Fecha automaticamente" : "Auto-closes" },
    { key: "Backspace",          desc: uiLang === "pt" ? "Apaga par vazio"       : "Delete empty pair" },
    { key: "Ctrl+Z",             desc: uiLang === "pt" ? "Desfazer (nativo)"     : "Undo (native)" },
    { key: "Ctrl+Y",             desc: uiLang === "pt" ? "Refazer (nativo)"      : "Redo (native)" },
    { key: "Duplo clique na aba",desc: uiLang === "pt" ? "Renomear arquivo"      : "Rename file" },
  ], [uiLang]);

  // Button style factory
  const btn = (extra = {}, active = false) => ({
    background:   active ? `${c.accent}22` : c.inputBg,
    border:       `1px solid ${active ? c.accent : c.border}`,
    color:        active ? c.accent : c.text,
    padding:      "5px 9px",
    borderRadius: "6px",
    cursor:       "pointer",
    fontFamily:   "inherit",
    fontSize:     "11px",
    whiteSpace:   "nowrap",
    ...extra,
  });

  // ── File management ─────────────────────────────────────────────────────────

  const updateFile = useCallback(
    patch => setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, ...patch } : f)),
    [activeFileId]
  );

  const addFile = useCallback(() => {
    const id = fileIdRef.current++;
    setFiles(prev => [...prev, { id, name: `arquivo${id}.py`, lang: "Python", code: TEMPLATES["Python"], stdin: "" }]);
    setActiveFileId(id);
  }, []);

  const removeFile = useCallback(id => {
    setFiles(prev => {
      if (prev.length === 1) return prev;
      const remaining = prev.filter(f => f.id !== id);
      // Schedule outside the updater to avoid React batching issues
      setTimeout(() => setActiveFileId(cur => cur === id ? remaining[remaining.length - 1].id : cur), 0);
      return remaining;
    });
  }, []);

  const startRename = useCallback((f, e) => {
    e.stopPropagation();
    setRenamingId(f.id);
    setRenameVal(f.name);
  }, []);

  const commitRename = useCallback(() => {
    if (renameVal.trim()) {
      setFiles(prev => prev.map(f => f.id === renamingId ? { ...f, name: renameVal.trim() } : f));
    }
    setRenamingId(null);
  }, [renameVal, renamingId]);

  const handleLangChange = useCallback(newLang => {
    const ext = EXT[newLang] || "txt";
    setFiles(prev => prev.map(f => {
      if (f.id !== activeFileId) return f;
      const base = f.name.replace(/\.\w+$/, "");
      return { ...f, lang: newLang, code: TEMPLATES[newLang] || `// ${newLang}\n`, stdin: "", name: `${base}.${ext}` };
    }));
    setOutput(""); setErrorLine(null); setShowExamples(false);
  }, [activeFileId]);

  const handleReset = useCallback(() => {
    const msg = uiLang === "pt" ? "Resetar código para o template?" : "Reset code to template?";
    if (!window.confirm(msg)) return;
    updateFile({ code: TEMPLATES[selectedLang] || "", stdin: "" });
    setOutput(""); setErrorLine(null);
  }, [selectedLang, updateFile, uiLang]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = af.name || "main.txt"; a.click();
    URL.revokeObjectURL(url);
  }, [code, af.name]);

  // ── Run handler ─────────────────────────────────────────────────────────────

  const handleRun = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    // ── Pré-processamento por linguagem ──────────────────────────────────────
    // Detectores de uso de stdin por linguagem
    const INPUT_PATTERNS = {
      "Python":               /\binput\s*\(/,
      "C":                    /\bscanf\b|\bfgets\b|\bgetchar\b|\bgets\b/,
      "C++":                  /\bcin\s*>>|\bgetline\b/,
      "Java":                 /\bScanner\b|\bBufferedReader\b/,
      "JavaScript (Node.js)": /readline|process\.stdin/,
      "TypeScript":           /readline|process\.stdin/,
      "Ruby":                 /\bgets\b|\breadline\b|\bSTDIN\b/,
      "PHP":                  /\bfgets\s*\(\s*STDIN\b|\breadline\b/,
      "Go":                   /\bfmt\.Scan|\bfmt\.Fscan|\bbufio\.NewReader/,
      "Rust":                 /\bstdin\(\)|read_line/,
      "Haskell":              /\bgetLine\b|\bgetContents\b|\bgetChar\b/,
      "Kotlin":               /\breadLine\b|\bSystem\.`in`/,
      "Scala":                /\bStdIn\b|\breadLine\b|\bConsole\.in\b/,
      "Swift":                /\breadLine\b/,
      "Lua":                  /\bio\.read\b/,
      "Perl":                 /<STDIN>|\breadline\b/,
      "R":                    /\breadLines\b|\bscan\b|\bfile\("stdin"\)/,
      "Bash / Shell":         /\bread\s+/,
      "Pascal":               /\bReadLn\b|\bRead\b/,
      "Fortran":              /\bread\s*\*/,
    };

    const inputPattern = INPUT_PATTERNS[selectedLang];
    const needsStdin   = inputPattern && inputPattern.test(code);

    // Java: Judge0 exige que a classe pública se chame "Main"
    let processedCode = code;
    if (selectedLang === "Java") {
      // Renomeia a classe pública para Main (Judge0 exige o nome Main)
      const classMatch = processedCode.match(/public\s+class\s+(\w+)/);
      if (classMatch && classMatch[1] !== "Main") {
        // Substitui apenas a declaração da classe, não outras ocorrências do nome
        processedCode = processedCode
          .replace(`public class ${classMatch[1]}`, "public class Main")
          .replace(new RegExp(`(new\s+)${classMatch[1]}\s*\(`, "g"), "$1Main(");
      }
      if (!processedCode.match(/public\s+class\s+Main/)) {
        processedCode = processedCode.replace(/public\s+class\s+\w+/, "public class Main");
      }
    }

    // C#: Garante namespace e classe válidos
    if (selectedLang === "C#" && !processedCode.includes("class ")) {
      processedCode = `using System;\nclass Program {\n  static void Main() {\n${processedCode}\n  }\n}`;
    }

    setIsRunning(true);
    setOutput("Executando...");
    setErrorLine(null);

    const t0 = Date.now();

    // Linguagens que rodam 100% no browser (sem fetch, sem CORS)
    const BROWSER_LANGS = new Set(["Python", "JavaScript (Node.js)", "TypeScript", "NumPy", "Pandas", "DSA"]);

    try {
      let result;

      // ── PYTHON — Pyodide (WebAssembly) ──────────────────────────────────────
      if (selectedLang === "Python" || selectedLang === "NumPy" || selectedLang === "Pandas" || selectedLang === "DSA") {
        setOutput("⏳ Carregando Python (Pyodide)...");
        try {
          if (!pyodideRef.current) {
            if (!window.loadPyodide) {
              await new Promise((res, rej) => {
                const s = document.createElement("script");
                s.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
                s.onload = res; s.onerror = rej;
                document.head.appendChild(s);
              });
            }
            pyodideRef.current = await window.loadPyodide();
          }

          const pyodide = pyodideRef.current;

          // Instala pacotes se necessário (numpy, pandas)
          if (selectedLang === "NumPy" || /import numpy/i.test(processedCode)) {
            await pyodide.loadPackage("numpy");
          }
          if (selectedLang === "Pandas" || /import pandas/i.test(processedCode)) {
            await pyodide.loadPackage("pandas");
          }

          // Redireciona stdout/stderr
          pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
          `);

          // Injeta stdin
          if (stdin.trim()) {
            const lines = JSON.stringify(stdin.trim().split("\n"));
            pyodide.runPython(`
import builtins
_stdin_lines = iter(${lines})
builtins.input = lambda prompt="": (print(prompt, end="", flush=True) or next(_stdin_lines))
            `);
          } else {
            pyodide.runPython(`
import builtins
builtins.input = lambda prompt="": (print(prompt, end="", flush=True) or "")
            `);
          }

          try {
            pyodide.runPython(processedCode);
          } catch (_) {}

          const stdout = pyodide.runPython("sys.stdout.getvalue()");
          const stderr = pyodide.runPython("sys.stderr.getvalue()");
          result = (stdout + (stderr ? `\n--- stderr ---\n${stderr}` : "")).trim() || "(sem saída)";
        } catch (e) {
          result = `ERRO: ${e.message}`;
        }

      // ── JAVASCRIPT / TYPESCRIPT — eval com captura de console ───────────────
      } else if (selectedLang === "JavaScript (Node.js)" || selectedLang === "TypeScript") {
        try {
          const logs = [];
          const fakeConsole = {
            log:   (...a) => logs.push(a.map(x => typeof x === "object" ? JSON.stringify(x, null, 2) : String(x)).join(" ")),
            error: (...a) => logs.push("ERRO: " + a.join(" ")),
            warn:  (...a) => logs.push("⚠ " + a.join(" ")),
            info:  (...a) => logs.push(a.join(" ")),
          };

          // Injeta stdin simples como array de respostas
          const stdinLines = stdin.trim() ? stdin.trim().split("\n") : [];
          let stdinIdx = 0;
          const fakeReadline = () => stdinLines[stdinIdx++] ?? "";

          // Para TypeScript remove type annotations básicos antes de eval
          let evalCode = processedCode;
          if (selectedLang === "TypeScript") {
            evalCode = evalCode
              .replace(/:\s*(string|number|boolean|void|any|null|undefined|never)(\[\])?/g, "")
              .replace(/\bReadonly</g, "")
              .replace(/interface\s+\w+\s*\{[^}]*\}/g, "")
              .replace(/type\s+\w+\s*=\s*[^;]+;/g, "")
              .replace(/<\w+>/g, "");
          }

          // Substitui console e process.stdin
          const fn = new Function(
            "console", "readline", "prompt",
            `"use strict";\n${evalCode}`
          );
          fn(fakeConsole, fakeReadline, fakeReadline);
          result = logs.join("\n") || "(sem saída)";
        } catch (e) {
          result = `ERRO: ${e.message}`;
        }

      // ── OUTRAS LINGUAGENS — sem suporte no browser ──────────────────────────
      } else {
        const langMsg = uiLang === "pt"
          ? `⚠ ${selectedLang} não pode ser executado diretamente no browser.\n\nLinguagens disponíveis para execução:\n• Python (e NumPy, Pandas)\n• JavaScript\n• TypeScript\n\nPara executar ${selectedLang}, seria necessário um servidor backend.`
          : `⚠ ${selectedLang} cannot run directly in the browser.\n\nAvailable languages:\n• Python (and NumPy, Pandas)\n• JavaScript\n• TypeScript\n\nRunning ${selectedLang} requires a backend server.`;
        result = langMsg;
      }

      const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
      setOutput(result);
      setExecTime(elapsed);
      setErrorLine(result.startsWith("ERRO") ? parseErrorLine(result) : null);

      const stats = getOutputStats(result);
      setLastRunInfo({ lang: selectedLang, time: elapsed, stats, ts: new Date().toLocaleTimeString() });
      setExecHistory(prev =>
        [{ id: Date.now(), lang: selectedLang, output: result, time: elapsed, ts: new Date().toLocaleTimeString() }, ...prev].slice(0, 8)
      );

    } catch (err) {
      if (err.name === "AbortError") {
        setOutput("Execução cancelada.");
      } else {
        setOutput(`❌ Erro: ${err.message || "falha na conexão"}`);
      }
      setExecTime(null);
    } finally {
      setIsRunning(false);
    }
  }, [code, stdin, selectedLang, uiLang]);

  // Keep ref current so keyboard handler can call it without being in deps
  useEffect(() => { handleRunRef.current = handleRun; }, [handleRun]);

  // ── Misc handlers ───────────────────────────────────────────────────────────

  const handleCopyOutput = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setOutputCopied(true);
      setTimeout(() => setOutputCopied(false), 1800);
    });
  }, [output]);

  const handleClearStorage = useCallback(() => {
    const msg = uiLang === "pt" ? "Apagar todos os dados salvos?" : "Clear all saved data?";
    if (!window.confirm(msg)) return;
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
    setSavedToast(false);
  }, [uiLang]);

  const closeAllMenus = useCallback(() => {
    setShowExamples(false);
    setShowThemes(false);
    setShowHistory(false);
    setShowShortcuts(false);
  }, []);

  const syncScroll = useCallback(() => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (highlightRef.current) {
      highlightRef.current.scrollTop  = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
    if (lineNumRef.current) {
      lineNumRef.current.scrollTop = scrollTop;
    }
  }, []);

  const startDrag = useCallback(e => {
    isDraggingRef.current = true;
    dragStartRef.current  = e.clientX;
    dragBaseRef.current   = outputW;
    e.preventDefault();
  }, [outputW]);

  // Keyboard handler — only depends on selectedLang (handleRun accessed via ref)
  const handleKeyDown = useCallback(e => {
    const ta    = e.target;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;

    // Ctrl+Enter → Run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunRef.current?.();
      return;
    }

    // Tab → insert 4 spaces (preserves native undo stack via execCommand)
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertText", false, "    ");
      return;
    }

    // Enter → smart indent (continues current line's indentation)
    if (e.key === "Enter") {
      e.preventDefault();
      const lines  = ta.value.substring(0, start).split("\n");
      const cur    = lines[lines.length - 1];
      const indent = cur.match(/^(\s*)/)[1];
      const extra  = /[{(\[:]\s*$/.test(cur.trimEnd()) ? "    " : "";
      document.execCommand("insertText", false, "\n" + indent + extra);
      return;
    }

    // Auto-close bracket / quote pairs
    if (_PAIRS[e.key] !== undefined) {
      if (e.key === "'" && _NO_SQ_LANGS.has(selectedLang)) return;
      e.preventDefault();
      if (start !== end) {
        // Wrap selected text with the pair
        const sel = ta.value.substring(start, end);
        ta.setSelectionRange(start, end);
        document.execCommand("insertText", false, e.key + sel + _PAIRS[e.key]);
        setTimeout(() => ta.setSelectionRange(start + 1, end + 1), 0);
      } else if (ta.value[start] === _PAIRS[e.key] && e.key === _PAIRS[e.key]) {
        // Skip over an existing closing char
        ta.setSelectionRange(start + 1, start + 1);
      } else {
        document.execCommand("insertText", false, e.key + _PAIRS[e.key]);
        setTimeout(() => ta.setSelectionRange(start + 1, start + 1), 0);
      }
      return;
    }

    // Backspace → delete both chars of an empty pair
    if (e.key === "Backspace" && start === end) {
      if (_PAIRS[ta.value[start - 1]] === ta.value[start]) {
        e.preventDefault();
        ta.setSelectionRange(start - 1, start + 1);
        document.execCommand("insertText", false, "");
      }
    }
  }, [selectedLang]);

  // ==========================================================================
  // 9. EFFECTS
  // ==========================================================================

  // Persist state to localStorage (debounced 800ms)
  useEffect(() => {
    if (lsTimer.current) clearTimeout(lsTimer.current);
    lsTimer.current = setTimeout(() => {
      lsSave({
        uiLang, themeName, fontSize, wordWrap, highlightOn,
        outputW, sidebarOpen, sidebarTab, files, activeFileId, execHistory,
        fileIdCounter: fileIdRef.current,
      });
      setSavedToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setSavedToast(false), 1500);
    }, 800);
    return () => clearTimeout(lsTimer.current);
  }, [uiLang, themeName, fontSize, wordWrap, highlightOn, outputH, files, activeFileId, execHistory]);

  // Debounced syntax highlighting
  // 150ms for short files, 400ms for medium files, disabled for >10k chars
  useEffect(() => {
    if (!highlightOn || code.length > 10000) { setHlHtml(""); return; }
    if (hlTimer.current) clearTimeout(hlTimer.current);
    const delay = code.length > 5000 ? 400 : 150;
    hlTimer.current = setTimeout(() => setHlHtml(highlight(code, selectedLang, c) + "\n"), delay);
    return () => clearTimeout(hlTimer.current);
  }, [code, selectedLang, themeName, highlightOn]);

  // Debounced bracket check (300ms, skipped for languages with false positives)
  useEffect(() => {
    if (bkTimer.current) clearTimeout(bkTimer.current);
    if (_NO_BRACKET_CHECK.has(selectedLang)) { setBracketWarn(false); return; }
    bkTimer.current = setTimeout(() => setBracketWarn(checkBrackets(code, selectedLang)), 300);
    return () => clearTimeout(bkTimer.current);
  }, [code, selectedLang]);



  // Focus the rename input when it appears
  useEffect(() => { if (renamingId && renameInputRef.current) renameInputRef.current.focus(); }, [renamingId]);

  // Drag-to-resize output panel (global mouse events)
  useEffect(() => {
    const onMove = e => {
      if (!isDraggingRef.current) return;
      const delta = dragStartRef.current - e.clientX;
      setOutputW(Math.max(200, Math.min(700, dragBaseRef.current + delta)));
    };
    const onUp = () => { isDraggingRef.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  // ==========================================================================
  // 10. RENDER
  // ==========================================================================

  return (
    <div
      style={{ height:"100vh", display:"flex", flexDirection:"column", background:c.bg, color:c.text, fontFamily:"'Courier New',monospace", overflow:"hidden", transition:"background 0.2s" }}
      onClick={closeAllMenus}
    >

      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <div
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px", height:"38px", background:c.topbar, borderBottom:`1px solid ${c.border}`, flexShrink:0, gap:"8px" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left: logo + language */}
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ color:c.accent, fontSize:"13px", fontWeight:"bold", letterSpacing:"2.5px", whiteSpace:"nowrap" }}>
            ⌨ CODEFORGE
          </span>
          <select
            value={selectedLang}
            onChange={e => handleLangChange(e.target.value)}
            style={{ background:c.inputBg, border:`1px solid ${c.border}`, color:c.text, padding:"3px 8px", borderRadius:"4px", fontFamily:"inherit", fontSize:"12px", cursor:"pointer", maxWidth:"185px" }}
          >
            {LANG_GROUPS.map(g => (
              <optgroup key={g.label} label={g.label}>
                {g.langs.map(l => <option key={l} value={l}>{l}</option>)}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Right controls */}
        <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>

          {/* Theme dropdown */}
          <div style={{ position:"relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowThemes(s => !s)} style={btn({}, showThemes)}>
              {c.name} ▾
            </button>
            {showThemes && (
              <div style={{ position:"absolute", top:"calc(100% + 4px)", right:0, zIndex:9999, background:c.topbar, border:`1px solid ${c.border}`, borderRadius:"8px", overflow:"hidden", minWidth:"130px", boxShadow:"0 8px 24px rgba(0,0,0,0.5)" }}>
                {Object.entries(COLOR_THEMES).map(([key, th]) => (
                  <button key={key}
                    onClick={() => { setThemeName(key); setShowThemes(false); }}
                    style={{ display:"block", width:"100%", textAlign:"left", background: themeName===key ? `${c.accent}18` : "transparent", border:"none", color: themeName===key ? c.accent : c.text, padding:"8px 14px", cursor:"pointer", fontFamily:"inherit", fontSize:"12px" }}
                  >{themeName===key ? "✓ " : ""}{th.name}</button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setUiLang(uiLang==="pt" ? "en" : "pt")}
            style={btn({ color:c.accent, border:`1px solid ${c.accent}44`, background:`${c.accent}11` })}
          >{t.switchLang}</button>

          <button onClick={handleFullscreen} style={btn()}>
            {isFullscreen ? t.exitFs : t.fullscreen}
          </button>

          <button onClick={handleClearStorage} title={t.clearStorage}
            style={btn({ fontSize:"11px", opacity:0.4, padding:"5px 8px" })}
          >⊗</button>
        </div>
      </div>

      {/* ── MAIN AREA ───────────────────────────────────────────────────────── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ACTIVITY BAR */}
        <div style={{ width:"44px", background:c.topbar, borderRight:`1px solid ${c.border}`, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"6px", gap:"3px", flexShrink:0, zIndex:10 }}>
          {[
            { id:"explorer", icon:"◫", labelPt:"Explorador", labelEn:"Explorer" },
            { id:"history",  icon:"◷", labelPt:"Histórico",  labelEn:"History"  },
            { id:"info",     icon:"⋮⋮", labelPt:"Info",      labelEn:"Info"     },
          ].map(item => {
            const active = sidebarOpen && sidebarTab === item.id;
            return (
              <button key={item.id}
                onClick={() => { setSidebarTab(item.id); setSidebarOpen(s => sidebarTab===item.id ? !s : true); }}
                title={uiLang==="pt" ? item.labelPt : item.labelEn}
                style={{ width:"36px", height:"36px", background: active ? `${c.accent}20` : "transparent", border: active ? `1px solid ${c.accent}40` : "1px solid transparent", borderRadius:"6px", cursor:"pointer", fontSize:"15px", display:"flex", alignItems:"center", justifyContent:"center", color: active ? c.accent : c.subtext, transition:"all 0.15s" }}
                onMouseEnter={e => { if(!active) e.currentTarget.style.background = c.inputBg; }}
                onMouseLeave={e => { if(!active) e.currentTarget.style.background = "transparent"; }}
              >{item.icon}</button>
            );
          })}
        </div>

        {/* SIDEBAR (collapsible) */}
        {sidebarOpen && (
          <div
            style={{ width:"220px", background:c.panelBg, borderRight:`1px solid ${c.border}`, display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sidebar header */}
            <div style={{ padding:"6px 10px 6px 12px", fontSize:"10px", fontWeight:"bold", color:c.subtext, letterSpacing:"1px", textTransform:"uppercase", borderBottom:`1px solid ${c.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
              <span>
                {sidebarTab==="explorer" ? (uiLang==="pt" ? "Explorador" : "Explorer")
                  : sidebarTab==="history" ? (uiLang==="pt" ? "Histórico" : "History")
                  : (uiLang==="pt" ? "Informações" : "Info")}
              </span>
              <button onClick={() => setSidebarOpen(false)}
                style={{ background:"transparent", border:"none", color:c.subtext, cursor:"pointer", fontSize:"13px", lineHeight:1, padding:"2px 4px", borderRadius:"3px" }}
                onMouseEnter={e => e.currentTarget.style.color=c.text}
                onMouseLeave={e => e.currentTarget.style.color=c.subtext}
              >✕</button>
            </div>

            {/* ── EXPLORER TAB ── */}
            {sidebarTab==="explorer" && (
              <div style={{ flex:1, overflow:"auto", padding:"6px" }}>
                <div style={{ fontSize:"10px", color:c.subtext, padding:"4px 6px 6px", letterSpacing:"0.5px" }}>
                  {uiLang==="pt" ? "ARQUIVOS" : "FILES"}
                </div>
                {files.map(f => (
                  <div key={f.id}
                    onClick={() => setActiveFileId(f.id)}
                    onDoubleClick={e => startRename(f, e)}
                    style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 8px", borderRadius:"4px", cursor:"pointer", background: f.id===activeFileId ? `${c.accent}15` : "transparent", marginBottom:"1px", transition:"background 0.1s" }}
                    onMouseEnter={e => { if(f.id!==activeFileId) e.currentTarget.style.background=c.inputBg; }}
                    onMouseLeave={e => { if(f.id!==activeFileId) e.currentTarget.style.background="transparent"; }}
                  >
                    {renamingId===f.id ? (
                      <input ref={renameInputRef} value={renameVal}
                        onChange={e => setRenameVal(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={e => { if(e.key==="Enter") commitRename(); if(e.key==="Escape") setRenamingId(null); e.stopPropagation(); }}
                        onClick={e => e.stopPropagation()}
                        style={{ flex:1, background:c.inputBg, border:`1px solid ${c.accent}`, color:c.text, fontFamily:"inherit", fontSize:"11px", padding:"1px 4px", borderRadius:"3px", outline:"none" }}
                      />
                    ) : (
                      <>
                        <span style={{ fontSize:"11px", color: f.id===activeFileId ? c.accent : c.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                          📄 {f.name}
                        </span>
                        {files.length > 1 && (
                          <span
                            onClick={e => { e.stopPropagation(); removeFile(f.id); }}
                            style={{ fontSize:"12px", color:c.subtext, cursor:"pointer", padding:"0 2px", flexShrink:0, opacity:0 }}
                            onMouseEnter={e => { e.target.style.color="#FF6B6B"; e.target.style.opacity="1"; }}
                            onMouseLeave={e => { e.target.style.color=c.subtext; e.target.style.opacity="0"; }}
                          >×</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <button onClick={addFile}
                  style={{ display:"flex", alignItems:"center", gap:"5px", width:"100%", padding:"5px 8px", background:"transparent", border:`1px dashed ${c.border}`, borderRadius:"4px", color:c.subtext, cursor:"pointer", fontFamily:"inherit", fontSize:"11px", marginTop:"8px", transition:"all 0.15s", boxSizing:"border-box" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=c.accent; e.currentTarget.style.color=c.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=c.border; e.currentTarget.style.color=c.subtext; }}
                >+ {t.newFile}</button>
              </div>
            )}

            {/* ── HISTORY TAB ── */}
            {sidebarTab==="history" && (
              <div style={{ flex:1, overflow:"auto", padding:"6px" }}>
                {execHistory.length===0
                  ? <div style={{ fontSize:"11px", color:c.subtext, padding:"8px" }}>{t.noHistory}</div>
                  : execHistory.slice().reverse().map(h => (
                    <div key={h.id}
                      onClick={() => { setOutput(h.output); setExecTime(h.time); }}
                      style={{ marginBottom:"6px", padding:"8px", background:c.inputBg, borderRadius:"6px", cursor:"pointer", borderLeft:`2px solid ${h.output.startsWith("ERRO") || h.output.startsWith("❌") ? "#FF6B6B" : c.accent}`, transition:"background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background=c.border}
                      onMouseLeave={e => e.currentTarget.style.background=c.inputBg}
                    >
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"9px", color:c.subtext, marginBottom:"3px" }}>
                        <span style={{ color: h.output.startsWith("ERRO") || h.output.startsWith("❌") ? "#FF6B6B" : c.accent }}>{h.lang}</span>
                        <span>{h.ts} · {h.time}s</span>
                      </div>
                      <div style={{ fontSize:"10px", color:c.text, whiteSpace:"pre-wrap", maxHeight:"36px", overflow:"hidden", opacity:0.8 }}>
                        {h.output.slice(0,80)}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            {/* ── INFO TAB ── */}
            {sidebarTab==="info" && (
              <div style={{ flex:1, overflow:"auto", padding:"8px" }}>

                {/* Language */}
                <div style={{ marginBottom:"14px" }}>
                  <div style={{ fontSize:"10px", color:c.subtext, letterSpacing:"0.8px", marginBottom:"6px" }}>
                    {uiLang==="pt" ? "LINGUAGEM" : "LANGUAGE"}
                  </div>
                  <div style={{ background:`${c.accent}10`, border:`1px solid ${c.accent}30`, borderRadius:"7px", padding:"9px 11px" }}>
                    <div style={{ fontSize:"13px", color:c.accent, fontWeight:"bold" }}>{selectedLang}</div>
                    <div style={{ fontSize:"10px", color:c.subtext, marginTop:"2px" }}>.{EXT[selectedLang] || "txt"}</div>
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{ marginBottom:"14px" }}>
                  <div style={{ fontSize:"10px", color:c.subtext, letterSpacing:"0.8px", marginBottom:"6px" }}>
                    {uiLang==="pt" ? "ESTATÍSTICAS" : "STATS"}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px" }}>
                    {[
                      { label: uiLang==="pt" ? "Linhas" : "Lines", value: lineCount },
                      { label: "Chars",                             value: charCount },
                      { label: uiLang==="pt" ? "Arquivos" : "Files", value: files.length },
                      { label: uiLang==="pt" ? "Execuções" : "Runs", value: execHistory.length },
                    ].map(s => (
                      <div key={s.label} style={{ background:c.inputBg, borderRadius:"5px", padding:"7px 9px" }}>
                        <div style={{ fontSize:"9px", color:c.subtext, marginBottom:"2px" }}>{s.label}</div>
                        <div style={{ fontSize:"15px", color:c.text, fontWeight:"bold" }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last run */}
                {lastRunInfo && (
                  <div style={{ marginBottom:"14px" }}>
                    <div style={{ fontSize:"10px", color:c.subtext, letterSpacing:"0.8px", marginBottom:"6px" }}>
                      {uiLang==="pt" ? "ÚLTIMA EXECUÇÃO" : "LAST RUN"}
                    </div>
                    <div style={{ background: lastRunInfo.stats?.isError ? "rgba(255,80,80,0.1)" : `${c.accent}10`, border:`1px solid ${lastRunInfo.stats?.isError ? "rgba(255,80,80,0.3)" : `${c.accent}30`}`, borderRadius:"7px", padding:"9px 11px" }}>
                      <div style={{ fontSize:"11px", color: lastRunInfo.stats?.isError ? "#FF6B6B" : c.accent, fontWeight:"bold" }}>
                        {lastRunInfo.stats?.isError ? "✗ ERRO" : "✓ OK"} — {lastRunInfo.time}s
                      </div>
                      <div style={{ fontSize:"9px", color:c.subtext, marginTop:"3px" }}>{lastRunInfo.ts}</div>
                      {lastRunInfo.stats?.preview && (
                        <div style={{ fontSize:"10px", color:c.text, marginTop:"5px", background:c.inputBg, padding:"3px 6px", borderRadius:"4px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {lastRunInfo.stats.preview}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shortcuts */}
                <div>
                  <div style={{ fontSize:"10px", color:c.subtext, letterSpacing:"0.8px", marginBottom:"6px" }}>
                    {uiLang==="pt" ? "ATALHOS" : "SHORTCUTS"}
                  </div>
                  {SHORTCUTS.map((s, idx) => (
                    <div key={idx}
                      style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom: idx < SHORTCUTS.length-1 ? `1px solid ${c.border}` : "none", alignItems:"center", gap:"8px" }}
                    >
                      <code style={{ fontSize:"9px", color:c.accent, background:c.inputBg, padding:"2px 5px", borderRadius:"3px", whiteSpace:"nowrap", flexShrink:0 }}>{s.key}</code>
                      <span style={{ fontSize:"9px", color:c.subtext, textAlign:"right" }}>{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── EDITOR + OUTPUT SPLIT ─────────────────────────────────────────── */}
        <div style={{ flex:1, display:"flex", overflow:"hidden", minWidth:0 }}>

          {/* EDITOR COLUMN */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

            {/* File tabs */}
            <div
              style={{ display:"flex", alignItems:"center", background:c.topbar, borderBottom:`1px solid ${c.border}`, flexShrink:0, overflowX:"auto" }}
              onClick={e => e.stopPropagation()}
            >
              {files.map(f => (
                <div key={f.id}
                  onClick={() => setActiveFileId(f.id)}
                  onDoubleClick={e => startRename(f, e)}
                  title={t.dblClickRename}
                  style={{ display:"flex", alignItems:"center", gap:"5px", padding:"7px 14px", borderRight:`1px solid ${c.border}`, cursor:"pointer", background: f.id===activeFileId ? c.bg : "transparent", borderTop: f.id===activeFileId ? `2px solid ${c.accent}` : "2px solid transparent", flexShrink:0, minWidth:"70px", transition:"background 0.12s" }}
                >
                  {renamingId===f.id ? (
                    <input ref={renameInputRef} value={renameVal}
                      onChange={e => setRenameVal(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={e => { if(e.key==="Enter") commitRename(); if(e.key==="Escape") setRenamingId(null); e.stopPropagation(); }}
                      onClick={e => e.stopPropagation()}
                      style={{ width:"80px", background:c.inputBg, border:`1px solid ${c.accent}`, color:c.text, fontFamily:"inherit", fontSize:"11px", padding:"1px 4px", borderRadius:"4px", outline:"none" }}
                    />
                  ) : (
                    <span style={{ fontSize:"12px", color: f.id===activeFileId ? c.text : c.subtext, maxWidth:"100px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {f.name}
                    </span>
                  )}
                  {files.length > 1 && renamingId !== f.id && (
                    <span
                      onClick={e => { e.stopPropagation(); removeFile(f.id); }}
                      style={{ fontSize:"13px", color:c.subtext, cursor:"pointer", lineHeight:1, padding:"0 1px", flexShrink:0 }}
                      onMouseEnter={e => e.target.style.color="#FF6B6B"}
                      onMouseLeave={e => e.target.style.color=c.subtext}
                    >×</span>
                  )}
                </div>
              ))}
            </div>

            {/* TOOLBAR */}
            <div
              style={{ display:"flex", alignItems:"center", gap:"3px", padding:"5px 10px", background:c.topbar, borderBottom:`1px solid ${c.border}`, flexShrink:0, flexWrap:"wrap" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Run button */}
              <button onClick={handleRun} disabled={isRunning}
                style={{ background: isRunning ? c.inputBg : `linear-gradient(135deg, ${c.accent}, ${c.accent}CC)`, color: isRunning ? c.subtext : "#000", border:"none", padding:"5px 14px", borderRadius:"5px", cursor: isRunning ? "not-allowed" : "pointer", fontFamily:"inherit", fontSize:"12px", fontWeight:"bold", flexShrink:0, boxShadow: isRunning ? "none" : `0 2px 10px ${c.accent}44`, transition:"all 0.2s" }}
              >
                {isRunning ? "⏳" : "▶"} {isRunning ? (uiLang==="pt" ? "Executando..." : "Running...") : t.run}
              </button>

              {isRunning && (
                <button onClick={() => abortRef.current?.abort()}
                  style={{ background:"rgba(255,80,80,0.1)", border:"1px solid rgba(255,80,80,0.3)", color:"#FF6B6B", padding:"5px 10px", borderRadius:"5px", cursor:"pointer", fontFamily:"inherit", fontSize:"11px", flexShrink:0 }}
                >■ {uiLang==="pt" ? "Parar" : "Stop"}</button>
              )}

              {bracketWarn && (
                <span style={{ fontSize:"10px", color:"#FF6B6B", background:"rgba(255,80,80,0.08)", border:"1px solid rgba(255,80,80,0.2)", padding:"3px 7px", borderRadius:"5px", whiteSpace:"nowrap", flexShrink:0 }}>
                  ⚠ {t.bracketWarn}
                </span>
              )}

              <div style={{ width:"1px", height:"18px", background:c.border, margin:"0 3px", flexShrink:0 }} />

              {/* Examples */}
              <div style={{ position:"relative", flexShrink:0 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowExamples(s => !s)} style={btn({}, showExamples)}>
                  {t.examples} ▾
                </button>
                {showExamples && (
                  <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:9999, background:c.topbar, border:`1px solid ${c.border}`, borderRadius:"8px", minWidth:"150px", overflow:"hidden", boxShadow:"0 8px 24px rgba(0,0,0,0.5)" }}>
                    {examples.map((ex, idx) => (
                      <button key={idx}
                        onClick={() => { updateFile({ code: ex.code }); setShowExamples(false); }}
                        style={{ display:"block", width:"100%", textAlign:"left", background:"transparent", border:"none", color:c.text, padding:"8px 12px", cursor:"pointer", fontFamily:"inherit", fontSize:"11px", borderBottom: idx<examples.length-1 ? `1px solid ${c.border}` : "none" }}
                        onMouseEnter={e => e.target.style.background=c.inputBg}
                        onMouseLeave={e => e.target.style.background="transparent"}
                      >{ex.label}</button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleReset}    title={t.reset}    style={btn({ flexShrink:0 })}>↺</button>
              <button onClick={handleDownload} title={t.download} style={btn({ flexShrink:0 })}>↓</button>

              <div style={{ width:"1px", height:"18px", background:c.border, margin:"0 3px", flexShrink:0 }} />

              {/* Font size */}
              <button onClick={() => setFontSize(f => Math.max(10, f-1))} style={btn({ padding:"5px 7px", flexShrink:0 })}>A−</button>
              <span style={{ fontSize:"11px", color:c.subtext, minWidth:"20px", textAlign:"center", flexShrink:0 }}>{fontSize}</span>
              <button onClick={() => setFontSize(f => Math.min(22, f+1))} style={btn({ padding:"5px 7px", flexShrink:0 })}>A+</button>

              <div style={{ width:"1px", height:"18px", background:c.border, margin:"0 3px", flexShrink:0 }} />

              <button onClick={() => setHighlightOn(h => !h)} style={btn({ flexShrink:0 }, highlightOn)} title={uiLang==="pt" ? "Coloração" : "Syntax colors"}>
                {highlightOn ? "◉" : "○"} {uiLang==="pt" ? "Cor" : "Color"}
              </button>
              <button onClick={() => setWordWrap(w => !w)} style={btn({ flexShrink:0 }, wordWrap)} title={t.wrap}>
                {wordWrap ? "◉" : "○"} {uiLang==="pt" ? "Quebra" : "Wrap"}
              </button>

              <div style={{ width:"1px", height:"18px", background:c.border, margin:"0 3px", flexShrink:0 }} />

              {/* Shortcuts dropdown */}
              <div style={{ position:"relative", flexShrink:0 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowShortcuts(s => !s)} style={btn({}, showShortcuts)}>
                  {uiLang==="pt" ? "Atalhos" : "Keys"}
                </button>
                {showShortcuts && (
                  <div style={{ position:"absolute", top:"calc(100% + 4px)", right:0, zIndex:9999, background:c.topbar, border:`1px solid ${c.border}`, borderRadius:"8px", padding:"10px 12px", minWidth:"240px", boxShadow:"0 8px 24px rgba(0,0,0,0.5)" }}>
                    <div style={{ fontSize:"11px", color:c.accent, marginBottom:"8px", fontWeight:"bold" }}>⌨ {t.shortcuts}</div>
                    {SHORTCUTS.map((s, idx) => (
                      <div key={idx} style={{ display:"flex", justifyContent:"space-between", gap:"12px", padding:"4px 0", borderBottom: idx < SHORTCUTS.length-1 ? `1px solid ${c.border}` : "none", alignItems:"center" }}>
                        <code style={{ fontSize:"10px", color:c.accent, background:c.inputBg, padding:"2px 6px", borderRadius:"4px", whiteSpace:"nowrap", flexShrink:0 }}>{s.key}</code>
                        <span style={{ fontSize:"10px", color:c.subtext, textAlign:"right" }}>{s.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* EDITOR AREA */}
            <div style={{ flex:1, display:"flex", overflow:"hidden", background:c.editorBg }}>

              {/* Line numbers */}
              <div ref={lineNumRef}
                style={{ padding:"12px 8px 12px 10px", ...edStyle, color:c.lineNum, userSelect:"none", minWidth:"46px", textAlign:"right", background:c.editorBg, flexShrink:0, borderRight:`1px solid ${c.border}44`, overflowY:"hidden" }}
              >
                {lineNumbers.map(ln => (
                  <div key={ln.n}
                    style={{ background: ln.err ? "rgba(255,80,80,0.18)" : "transparent", color: ln.err ? "#FF6B6B" : c.lineNum, paddingRight:"4px", borderRadius:"2px" }}
                  >{ln.n}</div>
                ))}
              </div>

              {/* Editor + highlight */}
              <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
                {highlightOn && code.length > 10000 && (
                  <div style={{ position:"absolute", top:"6px", right:"10px", zIndex:10, fontSize:"10px", color:c.subtext, background:c.topbar, padding:"2px 7px", borderRadius:"4px", pointerEvents:"none", opacity:0.8 }}>
                    highlight off (&gt;{Math.round(code.length/1000)}k chars)
                  </div>
                )}
                {highlightOn && hlHtml && (
                  <div ref={highlightRef} aria-hidden="true"
                    style={{ position:"absolute", inset:0, padding:"12px", ...edStyle, color:c.text, whiteSpace: wordWrap ? "pre-wrap" : "pre", wordBreak: wordWrap ? "break-word" : "normal", overflow:"auto", pointerEvents:"none", zIndex:1 }}
                    dangerouslySetInnerHTML={{ __html: hlHtml }}
                  />
                )}
                <textarea ref={textareaRef} value={code}
                  onChange={e => updateFile({ code: e.target.value })}
                  onScroll={syncScroll}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  style={{ position:"absolute", inset:0, background:"transparent", border:"none", color: highlightOn ? "transparent" : c.text, caretColor:c.accent, ...edStyle, padding:"12px", resize:"none", outline:"none", zIndex:2, overflow:"auto", whiteSpace: wordWrap ? "pre-wrap" : "pre", overflowWrap: wordWrap ? "break-word" : "normal" }}
                />
              </div>
            </div>

            {/* STDIN */}
            <div
              style={{ borderTop:`1px solid ${c.border}`, background:c.outputBg, flexShrink:0 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding:"3px 14px", fontSize:"10px", color:c.subtext, borderBottom:`1px solid ${c.border}40`, display:"flex", alignItems:"center", gap:"5px" }}>
                <span style={{ color:c.accent, opacity:0.6 }}>▸</span> {t.stdinLabel}
              </div>
              <textarea value={stdin}
                onChange={e => updateFile({ stdin: e.target.value })}
                placeholder={t.stdinPlaceholder}
                rows={2}
                style={{ width:"100%", background:"transparent", border:"none", color:c.text, fontFamily:"inherit", fontSize:"12px", padding:"5px 14px", resize:"none", outline:"none", boxSizing:"border-box" }}
              />
            </div>

          </div>

          {/* VERTICAL DRAG HANDLE */}
          <div
            onMouseDown={startDrag}
            style={{ width:"4px", background:c.border, cursor:"ew-resize", flexShrink:0, transition:"background 0.15s" }}
            onMouseEnter={e => e.target.style.background=c.accent}
            onMouseLeave={e => e.target.style.background=c.border}
          />

          {/* OUTPUT PANEL */}
          <div style={{ width:`${outputW}px`, background:c.outputBg, display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>

            {/* Output header */}
            <div
              style={{ padding:"5px 10px", fontSize:"10px", color:c.subtext, borderBottom:`1px solid ${c.border}`, display:"flex", alignItems:"center", gap:"5px", flexShrink:0, background:c.topbar }}
              onClick={e => e.stopPropagation()}
            >
              <span style={{ color: errorLine ? "#FF6B6B" : c.subtext, fontWeight:"bold" }}>
                ▸ {t.outputLabel}
              </span>
              {execTime && (
                <span style={{ color:c.accent, marginLeft:"4px" }}>⏱ {execTime}s</span>
              )}
              <div style={{ flex:1 }} />

              {/* History dropdown */}
              <div style={{ position:"relative" }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowHistory(s => !s)} style={btn({ padding:"2px 6px", fontSize:"10px" }, showHistory)}>
                  {t.history}
                </button>
                {showHistory && (
                  <div style={{ position:"absolute", top:"calc(100% + 4px)", right:0, zIndex:9999, background:c.topbar, border:`1px solid ${c.border}`, borderRadius:"8px", padding:"10px", minWidth:"260px", maxHeight:"260px", overflowY:"auto", boxShadow:"0 8px 24px rgba(0,0,0,0.5)" }}>
                    <div style={{ fontSize:"11px", color:c.accent, marginBottom:"8px", fontWeight:"bold" }}>{t.history}</div>
                    {execHistory.length===0
                      ? <div style={{ fontSize:"11px", color:c.subtext }}>{t.noHistory}</div>
                      : execHistory.slice().reverse().map(h => (
                        <div key={h.id}
                          onClick={() => { setOutput(h.output); setExecTime(h.time); setShowHistory(false); }}
                          style={{ marginBottom:"6px", padding:"7px", background:c.inputBg, borderRadius:"6px", cursor:"pointer" }}
                          onMouseEnter={e => e.currentTarget.style.background=c.border}
                          onMouseLeave={e => e.currentTarget.style.background=c.inputBg}
                        >
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", color:c.subtext, marginBottom:"3px" }}>
                            <span>{h.lang}</span><span>{h.ts} — {h.time}s</span>
                          </div>
                          <div style={{ fontSize:"11px", color: h.output.startsWith("ERRO") ? "#FF6B6B" : c.accent, whiteSpace:"pre-wrap", maxHeight:"40px", overflow:"hidden" }}>
                            {h.output}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>

              {output && (
                <button onClick={handleCopyOutput}
                  style={{ ...btn({ padding:"2px 7px", fontSize:"10px" }), color: outputCopied ? c.accent : c.subtext }}
                  title={t.copyOutput}
                >{outputCopied ? "✓" : "⎘"}</button>
              )}
              {output && (
                <button onClick={() => { setOutput(""); setExecTime(null); setErrorLine(null); }}
                  style={btn({ padding:"2px 7px", fontSize:"10px" })}
                  title={t.clearOutput}
                >✕</button>
              )}
            </div>

            {/* Output content */}
            <div style={{ flex:1, padding:"10px 14px", ...edStyle, color: errorLine ? "#FF6B6B" : c.accent, whiteSpace:"pre-wrap", overflowY:"auto", overflowX:"auto" }}>
              {output || <span style={{ color:c.subtext, opacity:0.35 }}>─</span>}
            </div>

          </div>

        </div>
      </div>

      {/* ── STATUS BAR ──────────────────────────────────────────────────────── */}
      <div style={{ height:"22px", background:c.accent, display:"flex", alignItems:"center", padding:"0 14px", gap:"16px", flexShrink:0 }}>
        <span style={{ fontSize:"11px", color:"rgba(0,0,0,0.85)", fontWeight:"bold" }}>{selectedLang}</span>
        <span style={{ fontSize:"11px", color:"rgba(0,0,0,0.65)" }}>
          {lineCount} {t.lines} · {charCount} {t.chars}
        </span>
        {execTime && (
          <span style={{ fontSize:"11px", color:"rgba(0,0,0,0.65)" }}>⏱ {execTime}s</span>
        )}
        {bracketWarn && (
          <span style={{ fontSize:"10px", background:"rgba(0,0,0,0.2)", color:"rgba(0,0,0,0.85)", padding:"1px 7px", borderRadius:"3px" }}>
            ⚠ brackets
          </span>
        )}
        {isRunning && (
          <span style={{ fontSize:"11px", color:"rgba(0,0,0,0.7)" }}>
            ● {uiLang==="pt" ? "Executando" : "Running"}…
          </span>
        )}
        <div style={{ flex:1 }} />
        {savedToast && (
          <span style={{ fontSize:"10px", color:"rgba(0,0,0,0.6)" }}>✓ {t.saved}</span>
        )}
        <span style={{ fontSize:"10px", color:"rgba(0,0,0,0.4)", letterSpacing:"1px" }}>CODEFORGE</span>
      </div>

    </div>
  );
}
