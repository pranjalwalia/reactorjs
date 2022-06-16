import { iFrameIdentifier } from '../utils/sandboxNameGenerator';
import { useRef } from 'react';
import { useEffect } from 'react';

import './styles/Preview.css';

export interface IPreviewPayload {
    bundledCode: string | null;
}

const Preview: React.FC<IPreviewPayload> = ({ bundledCode }: IPreviewPayload) => {
    const iFrameRef = useRef<any>();

    useEffect(() => {
        if (iFrameRef.current) {
            iFrameRef.current.srcdoc = iFramePayload;
            setTimeout(() => {
                iFrameRef.current.contentWindow.postMessage(bundledCode, '*');
                console.log('bundledCode: ', bundledCode);
            }, 3000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bundledCode]);

    const iFramePayload: string = `
    <html>
        <head>
            <style>
            html {
                background-color: white
            }
            </style>
        </head>
            <body>
                <div id="root"></div>
                    <script>
                        const handleError = (err)=>{
                        const root = document.querySelector('#root');
                        root.innerHTML = '<div style="color: red;"> <h4>Runtime Error</h4>' + err +  '</div>';
                        console.error(err)
                        }
                        window.addEventListener('error', (event)=>{
                        event.preventDefault();
                        handleError(event.error)
                        });
                        
                        window.addEventListener('message', (event) => {
                        try{
                            eval(event.data);
                        }catch(err) {
                            handleError(err)
                        }
                        }, false);
                </script>
            </body>
        </html>
    `;

    const iFrameTitle: string = `iframe-${iFrameIdentifier(bundledCode!.length % 123)}`;

    return (
        <div className="preview-wrapper">
            <iframe
                ref={iFrameRef}
                src="/frameSource.html"
                title={iFrameTitle}
                sandbox="allow-scripts"
                srcDoc={iFramePayload}
            />
        </div>
    );
};

export default Preview;
