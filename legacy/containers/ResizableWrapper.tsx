import { ResizableBox, ResizableBoxProps } from 'react-resizable';

export interface IResizableProps {
    direction: 'horizontal' | 'vertical';
}

const ResizableComponentProvider: React.FC<IResizableProps> = ({ direction, children }) => {
    let resizableDirectionalProps: ResizableBoxProps;

    if (direction === 'horizontal') {
        resizableDirectionalProps = {
            // className: 'resize-horizontal',
            height: Infinity,
            width: window.innerWidth * 0.75,
            maxConstraints: [window.innerWidth * 0.2, Infinity],
            minConstraints: [window.innerWidth * 0.75, Infinity],
            resizeHandles: ['e']
        };
    } else {
        resizableDirectionalProps = {
            height: 400,
            width: Infinity,
            maxConstraints: [Infinity, window.innerHeight * 0.9],
            minConstraints: [Infinity, 150],
            resizeHandles: ['s']
        };
    }

    return <ResizableBox {...resizableDirectionalProps}>{children}</ResizableBox>;
};

export default ResizableComponentProvider;
