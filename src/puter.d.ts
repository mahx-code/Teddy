// Puter.js SDK TypeScript declarations

interface PuterUser {
  username: string;
  uuid: string;
  email?: string;
  email_confirmed?: boolean;
}

interface PuterAuth {
  signIn(): Promise<PuterUser>;
  signOut(): Promise<void>;
  isSignedIn(): boolean;
  getUser(): Promise<PuterUser | null>;
}

interface PuterFSItem {
  name: string;
  path: string;
  is_dir: boolean;
  size?: number;
  created?: string;
  modified?: string;
}

interface PuterFS {
  write(
    path: string,
    content: string | Blob,
    options?: { overwrite?: boolean; createMissingParents?: boolean }
  ): Promise<PuterFSItem>;
  read(path: string): Promise<Blob>;
  mkdir(
    path: string,
    options?: { createMissingParents?: boolean }
  ): Promise<PuterFSItem>;
  readdir(path: string): Promise<PuterFSItem[]>;
  delete(path: string, options?: { recursive?: boolean }): Promise<void>;
  stat(path: string): Promise<PuterFSItem>;
}

interface PuterAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface PuterAIOptions {
  model?: string;
  messages?: PuterAIMessage[];
  stream?: boolean;
  max_tokens?: number;
}

interface PuterAIResponse {
  message: {
    content: string;
    role: string;
  };
}

interface PuterAI {
  chat(prompt: string, options?: PuterAIOptions): Promise<PuterAIResponse>;
}

interface Puter {
  auth: PuterAuth;
  fs: PuterFS;
  ai: PuterAI;
}

declare const puter: Puter;
