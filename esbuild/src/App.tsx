import { ReactElement, useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

export const App: React.FC = (): ReactElement => {
  const [input, setinput] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const ref = useRef<any>();

  const startService = async (): Promise<void> => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
    ref.current = true;
  };

  useEffect((): void => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    const buildResult = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });
    const { outputFiles } = buildResult;
    setCode(outputFiles[0].text);
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
