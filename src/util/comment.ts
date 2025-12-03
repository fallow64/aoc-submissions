export function wrapComments(lines: string[], language: string): string {
  const commentStyle: Record<
    string,
    { start?: string; end?: string; line?: string }
  > = {
    rust: { line: "//" },
    python: { line: "#" },
    javascript: { line: "//" },
    typescript: { line: "//" },
    java: { line: "//" },
    c: { line: "//" },
    cpp: { line: "//" },
    go: { line: "//" },
    ruby: { line: "#" },
    php: { line: "//" },
    swift: { line: "//" },
    kotlin: { line: "//" },
    scala: { line: "//" },
    r: { line: "#" },
    perl: { line: "#" },
    shell: { line: "#" },
    bash: { line: "#" },
    lua: { line: "--" },
    sql: { line: "--" },
    html: { start: "<!--", end: "-->" },
    xml: { start: "<!--", end: "-->" },
    css: { start: "/*", end: "*/" },
  };

  const style = commentStyle[language.toLowerCase()] || { line: "//" };

  if (style.line) {
    return lines.map((line) => `${style.line} ${line}`).join("\n");
  } else if (style.start && style.end) {
    return `${style.start}\n${lines.join("\n")}\n${style.end}`;
  }

  return lines.join("\n");
}
