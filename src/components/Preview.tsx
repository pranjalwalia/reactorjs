import { iFrameIdentifier } from '../utils/sandboxNameGenerator';
import { useRef } from 'react';
import { useEffect } from 'react';

export interface IPreviewPayload {
    bundledCode: string | null;
}

const Preview: React.FC<IPreviewPayload> = ({ bundledCode }: IPreviewPayload) => {
    const iFrameRef = useRef<any>();

    useEffect(() => {
        if (iFrameRef.current) {
            iFrameRef.current.srcdoc = iFramePayload;

            setTimeout(() => {
                iFrameRef.current?.contentWindow?.postMessage(bundledCode, '*');
            }, 50);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bundledCode]);

    const iFramePayload: string = `
    <html>
        <head></head>
        <body>
            <div id="root">
                <script>
                    window.addEventListener('message', (event) => {
                        try {
                            eval(event.data);
                          } catch (err) {
                            const root = document.querySelector('#root');
                            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
                            console.error(err);
                          }
                    }, false)
                </script>
            </div>
        </body>
    </html>`;

    const iFrameTitle: string = `iframe-${iFrameIdentifier(bundledCode!.length % 123)}`;

    return (
        <iframe
            ref={iFrameRef}
            src="/frameSource.html"
            title={iFrameTitle}
            sandbox="allow-scripts"
            srcDoc={iFramePayload}
        />
    );
};

export default Preview;
