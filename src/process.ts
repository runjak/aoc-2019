import readline from "readline";

export const isProduction = (): boolean =>
  process.env["NODE_ENV"] === "production";

export const withKeypress = (λ: (str: string) => void | Promise<void>) => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (str, key) => {
    if (key && key.ctrl && key.name === "c") {
      process.exit();
    } else {
      λ(str);
    }
  });
};
