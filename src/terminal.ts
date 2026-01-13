import { getPathString } from "./filesystem";
import {
  executeCommand,
  getCompletions,
  type CommandContext,
} from "./commands";
import { escapeHtml } from "./renderer";

export class Terminal {
  private outputEl: HTMLElement;
  private inputEl: HTMLInputElement;
  private promptEl: HTMLElement;

  // Type assertion helper
  private getInputElement(): HTMLInputElement {
    return document.getElementById("input") as HTMLInputElement;
  }
  private currentPath: string[] = [];
  private commandHistory: string[] = [];
  private historyIndex: number = -1;
  private tempInput: string = "";

  constructor() {
    this.outputEl = document.getElementById("output")!;
    this.inputEl = this.getInputElement();
    this.promptEl = document.getElementById("prompt")!;

    this.setupEventListeners();
    this.updatePrompt();
    this.showWelcome();
    this.focusInput();
  }

  private setupEventListeners(): void {
    this.inputEl.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Focus input when clicking anywhere on terminal
    document.getElementById("terminal")?.addEventListener("click", () => {
      this.focusInput();
    });
  }

  private handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case "Enter":
        this.handleEnter();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.navigateHistory(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        this.navigateHistory(1);
        break;
      case "Tab":
        e.preventDefault();
        this.handleTab();
        break;
      case "c":
        if (e.ctrlKey) {
          e.preventDefault();
          this.handleCtrlC();
        }
        break;
      case "l":
        if (e.ctrlKey) {
          e.preventDefault();
          this.clear();
        }
        break;
    }
  }

  private handleEnter(): void {
    const input = this.inputEl.value;

    // Echo the command with prompt
    this.echoCommand(input);

    // Add to history if not empty and not duplicate
    if (
      input.trim() &&
      this.commandHistory[this.commandHistory.length - 1] !== input
    ) {
      this.commandHistory.push(input);
    }
    this.historyIndex = -1;
    this.tempInput = "";

    // Execute command
    const ctx: CommandContext = {
      currentPath: this.currentPath,
      history: this.commandHistory,
      output: (html: string) => this.output(html),
      clear: () => this.clear(),
      setPath: (path: string[]) => {
        this.currentPath = path;
        this.updatePrompt();
      },
    };

    executeCommand(input, ctx);

    // Clear input and scroll to bottom
    this.inputEl.value = "";
    this.scrollToBottom();
  }

  private navigateHistory(direction: number): void {
    if (this.commandHistory.length === 0) return;

    // Save current input if just starting to navigate
    if (this.historyIndex === -1 && direction === -1) {
      this.tempInput = this.inputEl.value;
    }

    const newIndex = this.historyIndex + direction;

    if (direction === -1) {
      // Going back in history
      if (this.historyIndex === -1) {
        this.historyIndex = this.commandHistory.length - 1;
      } else if (newIndex >= 0) {
        this.historyIndex = newIndex;
      }
    } else {
      // Going forward in history
      if (newIndex >= this.commandHistory.length) {
        // Restore temp input
        this.historyIndex = -1;
        this.inputEl.value = this.tempInput;
        return;
      } else if (newIndex >= 0) {
        this.historyIndex = newIndex;
      }
    }

    if (
      this.historyIndex >= 0 &&
      this.historyIndex < this.commandHistory.length
    ) {
      this.inputEl.value = this.commandHistory[this.historyIndex];
    }
  }

  private handleTab(): void {
    const input = this.inputEl.value;
    const completions = getCompletions(input, this.currentPath);

    if (completions.length === 0) return;

    if (completions.length === 1) {
      // Single completion - apply it
      const parts = input.split(/\s+/);
      if (parts.length === 1) {
        this.inputEl.value = completions[0] + " ";
      } else {
        parts[parts.length - 1] = completions[0];
        this.inputEl.value = parts.join(" ");
      }
    } else {
      // Multiple completions - show them
      this.echoCommand(input);
      this.output(completions.join("  "));
    }
  }

  private handleCtrlC(): void {
    this.echoCommand(this.inputEl.value + "^C");
    this.inputEl.value = "";
  }

  private echoCommand(input: string): void {
    const promptHtml = this.getPromptHtml();
    this.output(`${promptHtml} ${escapeHtml(input)}`);
  }

  private getPromptHtml(): string {
    const pathStr = getPathString(this.currentPath);
    return `<span class="prompt-user">visitor</span><span class="prompt-at">@</span><span class="prompt-host">janvavrina</span><span class="prompt-separator">:</span><span class="prompt-path">${pathStr}</span><span class="prompt-symbol">$</span>`;
  }

  private updatePrompt(): void {
    this.promptEl.innerHTML = this.getPromptHtml();
  }

  private output(html: string): void {
    const line = document.createElement("div");
    line.className = "output-line";
    line.innerHTML = html;
    this.outputEl.appendChild(line);
    this.scrollToBottom();
  }

  private clear(): void {
    this.outputEl.innerHTML = "";
  }

  private scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  private focusInput(): void {
    this.inputEl.focus();
  }

  private showWelcome(): void {
    const banner = `
<span class="welcome-banner">
     _             __     __            _
    | | __ _ _ __  \\ \\   / /_ ___   ___ (_)_ __   __ _
 _  | |/ _\` | '_ \\  \\ \\ / / _\` \\ \\ / / || | '_ \\ / _\` |
| |_| | (_| | | | |  \\ V / (_| |\\ V /| || | | | | (_| |
 \\___/ \\__,_|_| |_|   \\_/ \\__,_| \\_/ |_||_|_| |_|\\__,_|
</span>
<span class="info">Welcome to my terminal portfolio!</span>

Type <span class="success">help</span> to see available commands.
Try <span class="success">ls</span> to see files, or <span class="success">cat about.md</span> to learn about me.
`;
    this.output(banner.trim());
  }
}
