import * as esbuild from "esbuild-wasm";
import { ReactElement, useState, useEffect } from "react";

export const App: React.FC = (): ReactElement => {
  const [input, setinput] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const startService = async () => {
    await esbuild
      .initialize({
        worker: true,
        wasmURL: "/esbuild.wasm",
      })
      .then((service) => console.log(service));
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
