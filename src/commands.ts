import {
  getNode,
  getPathString,
  listDirectory,
  resolvePath,
} from "./filesystem";
import { renderMarkdown, escapeHtml } from "./renderer";

export interface CommandContext {
  currentPath: string[];
  history: string[];
  output: (html: string) => void;
  clear: () => void;
  setPath: (path: string[]) => void;
}

export interface CommandResult {
  success: boolean;
}

type CommandHandler = (args: string[], ctx: CommandContext) => CommandResult;

const commands: Record<string, CommandHandler> = {
  ls: (args, ctx) => {
    const targetPath = args[0]
      ? resolvePath(ctx.currentPath, args[0])
      : ctx.currentPath;

    if (!targetPath) {
      ctx.output(
        '<span class="error">ls: cannot access: No such file or directory</span>',
      );
      return { success: false };
    }

    const items = listDirectory(targetPath);
    if (!items) {
      ctx.output(
        '<span class="error">ls: cannot access: Not a directory</span>',
      );
      return { success: false };
    }

    if (items.length === 0) {
      return { success: true };
    }

    const output = items
      .map((item) => {
        if (item.type === "directory") {
          return `<span class="directory">${escapeHtml(item.name)}/</span>`;
        } else if (item.name.endsWith(".md")) {
          return `<span class="file-md">${escapeHtml(item.name)}</span>`;
        } else {
          return `<span class="file">${escapeHtml(item.name)}</span>`;
        }
      })
      .join("  ");

    ctx.output(output);
    return { success: true };
  },

  cat: (args, ctx) => {
    if (args.length === 0) {
      ctx.output('<span class="error">cat: missing file operand</span>');
      return { success: false };
    }

    const targetPath = resolvePath(ctx.currentPath, args[0]);
    if (!targetPath) {
      ctx.output(
        `<span class="error">cat: ${escapeHtml(args[0])}: No such file or directory</span>`,
      );
      return { success: false };
    }

    const node = getNode(targetPath);
    if (!node) {
      ctx.output(
        `<span class="error">cat: ${escapeHtml(args[0])}: No such file or directory</span>`,
      );
      return { success: false };
    }

    if (node.type === "directory") {
      ctx.output(
        `<span class="error">cat: ${escapeHtml(args[0])}: Is a directory</span>`,
      );
      return { success: false };
    }

    if (!node.content) {
      ctx.output("");
      return { success: true };
    }

    // Render markdown files beautifully
    if (node.name.endsWith(".md")) {
      ctx.output(renderMarkdown(node.content));
    } else {
      ctx.output(`<pre>${escapeHtml(node.content)}</pre>`);
    }

    return { success: true };
  },

  cd: (args, ctx) => {
    const target = args[0] || "~";

    if (target === "~" || target === "") {
      ctx.setPath([]);
      return { success: true };
    }

    const newPath = resolvePath(ctx.currentPath, target);
    if (!newPath) {
      ctx.output(
        `<span class="error">cd: ${escapeHtml(target)}: No such file or directory</span>`,
      );
      return { success: false };
    }

    // Check if the path is empty (home directory)
    if (newPath.length === 0) {
      ctx.setPath([]);
      return { success: true };
    }

    const node = getNode(newPath);
    if (!node) {
      ctx.output(
        `<span class="error">cd: ${escapeHtml(target)}: No such file or directory</span>`,
      );
      return { success: false };
    }

    if (node.type !== "directory") {
      ctx.output(
        `<span class="error">cd: ${escapeHtml(target)}: Not a directory</span>`,
      );
      return { success: false };
    }

    ctx.setPath(newPath);
    return { success: true };
  },

  pwd: (_args, ctx) => {
    ctx.output(getPathString(ctx.currentPath));
    return { success: true };
  },

  clear: (_args, ctx) => {
    ctx.clear();
    return { success: true };
  },

  help: (_args, ctx) => {
    const helpText = `
<span class="info">Available commands:</span>

  <span class="success">ls</span> [path]      List directory contents
  <span class="success">cat</span> &lt;file&gt;     Display file contents (renders markdown)
  <span class="success">cd</span> [path]      Change directory
  <span class="success">pwd</span>            Print working directory
  <span class="success">clear</span>          Clear the terminal
  <span class="success">help</span>           Show this help message

<span class="info">Easter eggs:</span>

  <span class="success">whoami</span>         Who are you?
  <span class="success">neofetch</span>       System information
  <span class="success">echo</span> &lt;text&gt;    Print text
  <span class="success">date</span>           Show current date
  <span class="success">history</span>        Show command history

<span class="info">Tips:</span>
  - Use <span class="success">Tab</span> for autocompletion
  - Use <span class="success">↑/↓</span> arrows to navigate command history
  - Try <span class="success">cat about.md</span> to learn more about me!
`;
    ctx.output(helpText.trim());
    return { success: true };
  },

  // Easter egg commands
  whoami: (_args, ctx) => {
    ctx.output("visitor");
    return { success: true };
  },

  neofetch: (_args, ctx) => {
    const ascii = `
<span class="ascii-art">       _
      (_)_   __
      | \\ \\ / /
      | |\\ V /
     _/ | \\_/
    |__/                  </span>`;

    const info = `
<span class="neofetch-label">visitor</span><span class="neofetch-value">@</span><span class="neofetch-label">janvavrina.github.io</span>
<span class="neofetch-value">--------------------------</span>
<span class="neofetch-label">OS:</span> <span class="neofetch-value">Terminal Portfolio v1.0</span>
<span class="neofetch-label">Host:</span> <span class="neofetch-value">GitHub Pages</span>
<span class="neofetch-label">Shell:</span> <span class="neofetch-value">janvavrina-sh</span>
<span class="neofetch-label">Theme:</span> <span class="neofetch-value">Catppuccin Mocha</span>
<span class="neofetch-label">Terminal:</span> <span class="neofetch-value">Web Browser</span>
<span class="neofetch-label">Languages:</span> <span class="neofetch-value">TypeScript, JavaScript</span>
<span class="neofetch-label">Uptime:</span> <span class="neofetch-value">Since you opened this page</span>
`;

    ctx.output(
      `<div style="display: flex; gap: 20px; align-items: flex-start;">${ascii}<div>${info}</div></div>`,
    );
    return { success: true };
  },

  sudo: (args, ctx) => {
    if (args.length === 0) {
      ctx.output('<span class="error">usage: sudo command</span>');
      return { success: false };
    }

    const responses = [
      '<span class="error">Nice try, but you\'re just a visitor here!</span>',
      '<span class="error">Permission denied: you are not in the sudoers file. This incident will be reported.</span>',
      '<span class="error">sudo: command not found in this dimension</span>',
      '<span class="warning">I appreciate the confidence, but no.</span>',
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    ctx.output(randomResponse);
    return { success: false };
  },

  echo: (args, ctx) => {
    ctx.output(escapeHtml(args.join(" ")));
    return { success: true };
  },

  date: (_args, ctx) => {
    const now = new Date();
    ctx.output(now.toString());
    return { success: true };
  },

  history: (_args, ctx) => {
    if (ctx.history.length === 0) {
      ctx.output('<span class="info">No commands in history</span>');
      return { success: true };
    }

    const output = ctx.history
      .map((cmd, i) => `  ${i + 1}  ${escapeHtml(cmd)}`)
      .join("\n");

    ctx.output(`<pre>${output}</pre>`);
    return { success: true };
  },
};

export function executeCommand(
  input: string,
  ctx: CommandContext,
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: true };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const handler = commands[cmd];
  if (!handler) {
    ctx.output(`<span class="error">Command not found: ${escapeHtml(cmd)}</span>
<span class="info">Type 'help' to see available commands.</span>`);
    return { success: false };
  }

  return handler(args, ctx);
}

export function getCompletions(input: string, currentPath: string[]): string[] {
  const parts = input.split(/\s+/);

  // Command completion
  if (parts.length === 1) {
    const partial = parts[0].toLowerCase();
    return Object.keys(commands).filter((cmd) => cmd.startsWith(partial));
  }

  // File/directory completion
  const cmd = parts[0].toLowerCase();
  if (["cat", "cd", "ls"].includes(cmd)) {
    const partial = parts[parts.length - 1] || "";
    const items = listDirectory(currentPath);

    if (!items) return [];

    return items
      .map((item) => item.name + (item.type === "directory" ? "/" : ""))
      .filter((name) => name.toLowerCase().startsWith(partial.toLowerCase()));
  }

  return [];
}
