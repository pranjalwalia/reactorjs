import * as esbuild from "esbuild-wasm";
import { ReactElement, useState, useEffect } from "react";

const esbuildConfig = {
  worker: true,
  wasmURL: "./node_modules/esbuild-wasm/esbuild.wasm",
};

export const App: React.FC = (): ReactElement => {
  const [input, setinput] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const startService = async (): Promise<void> => {
    esbuild
      .initialize(esbuildConfig)
      .then((x) => console.log(x))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = (): void => {
    const transpiledCode = "";
    setCode(transpiledCode);
    console.log(input);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setinput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};
