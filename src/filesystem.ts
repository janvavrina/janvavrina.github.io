export interface FileSystemNode {
  type: "file" | "directory";
  name: string;
  content?: string;
  children?: FileSystemNode[];
}

// Dynamically import all markdown files from content directory
const contentModules = import.meta.glob("/content/**/*.md", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>;

function buildFilesystem(): FileSystemNode {
  const root: FileSystemNode = {
    type: "directory",
    name: "~",
    children: [],
  };

  // Process each imported file
  for (const [path, content] of Object.entries(contentModules)) {
    // Remove '/content/' prefix and split path
    const relativePath = path.replace("/content/", "");
    const parts = relativePath.split("/");

    let currentNode = root;

    // Navigate/create directory structure
    for (let i = 0; i < parts.length - 1; i++) {
      const dirName = parts[i];

      if (!currentNode.children) {
        currentNode.children = [];
      }

      let dirNode = currentNode.children.find(
        (child) => child.type === "directory" && child.name === dirName,
      );

      if (!dirNode) {
        dirNode = {
          type: "directory",
          name: dirName,
          children: [],
        };
        currentNode.children.push(dirNode);
      }

      currentNode = dirNode;
    }

    // Add the file
    const fileName = parts[parts.length - 1];
    if (!currentNode.children) {
      currentNode.children = [];
    }

    currentNode.children.push({
      type: "file",
      name: fileName,
      content: content as string,
    });
  }

  return root;
}

export const filesystem: FileSystemNode = buildFilesystem();

export function resolvePath(
  currentPath: string[],
  targetPath: string,
): string[] | null {
  const parts = targetPath.split("/").filter((p) => p !== "");
  let newPath = [...currentPath];

  for (const part of parts) {
    if (part === "..") {
      if (newPath.length > 0) {
        newPath.pop();
      }
    } else if (part === "." || part === "") {
      // Stay in current directory
    } else if (part === "~") {
      newPath = [];
    } else {
      newPath.push(part);
    }
  }

  return newPath;
}

export function getNode(path: string[]): FileSystemNode | null {
  let current: FileSystemNode = filesystem;

  for (const segment of path) {
    if (current.type !== "directory" || !current.children) {
      return null;
    }
    const child = current.children.find((c) => c.name === segment);
    if (!child) {
      return null;
    }
    current = child;
  }

  return current;
}

export function getPathString(path: string[]): string {
  if (path.length === 0) {
    return "~";
  }
  return "~/" + path.join("/");
}

export function listDirectory(path: string[]): FileSystemNode[] | null {
  const node = path.length === 0 ? filesystem : getNode(path);
  if (!node || node.type !== "directory") {
    return null;
  }
  return node.children || [];
}
