import { ReactElement, useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm";

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

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    const transpilation = await esbuild.transform(input, {
      loader: "jsx",
      target: "es2015",
    });
    setCode(transpilation.code);
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
