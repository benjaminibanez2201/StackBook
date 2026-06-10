import { Fragment } from "react";

const tokenPattern =
  /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$|--.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|if|else|for|while|class|extends|import|from|export|default|async|await|try|catch|throw|new|this|true|false|null|undefined|def|lambda|in|is|not|and|or|None|True|False|public|private|protected|static|void|int|string|boolean|namespace|using|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|JOIN|ON|AS|AND|OR|NOT|NULL|VALUES|INTO|SET)\b|\b\d+(?:\.\d+)?\b|[{}()[\].,;:+\-*/%=<>!&|?]+)/gm;

function getTokenType(token) {
  if (
    token.startsWith("//") ||
    token.startsWith("/*") ||
    token.startsWith("#") ||
    token.startsWith("--")
  ) {
    return "comment";
  }

  if (/^["'`]/.test(token)) {
    return "string";
  }

  if (/^\d/.test(token)) {
    return "number";
  }

  if (/^[{}()[\].,;:+\-*/%=<>!&|?]+$/.test(token)) {
    return "operator";
  }

  if (/^(true|false|null|undefined|None|True|False|NULL)$/.test(token)) {
    return "constant";
  }

  return "keyword";
}

function highlightLine(line, lineIndex) {
  const parts = [];
  let lastIndex = 0;

  for (const match of line.matchAll(tokenPattern)) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }

    parts.push(
      <span
        className={`code-token code-token--${getTokenType(match[0])}`}
        key={`${lineIndex}-${match.index}`}
      >
        {match[0]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
}

function CodeBlock({ content }) {
  const lines = content.split("\n");

  return (
    <pre className="code-viewer">
      <code>
        {lines.map((line, index) => (
          <Fragment key={`line-${index}`}>
            <span className="code-viewer__line">
              <span className="code-viewer__line-number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="code-viewer__line-content">
                {highlightLine(line, index)}
              </span>
            </span>
            {index < lines.length - 1 ? "\n" : null}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}

export default CodeBlock;
