import { Memory } from "./05";
import { mkState, execute } from "./09";
import { isProduction, withKeypress } from "./process";

import input from "./17.input.json";

export const gatherOutput = async (code: Memory): Promise<string> => {
  let output = "";

  try {
    await execute(
      mkState(code),
      () => {
        throw new Error("no input possible");
      },
      async n => {
        output += String.fromCharCode(n);
      }
    );
  } catch (e) {}

  return output;
};

if (isProduction()) {
  console.log("Hi <3><");
  withKeypress(() => {});
  (async () => {
    const output = await gatherOutput(input);
    console.log(output);
    process.exit(0);
  })();
}
