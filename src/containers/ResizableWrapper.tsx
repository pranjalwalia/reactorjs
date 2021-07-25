import { ResizableBox } from 'react-resizable';

export interface IResizableProps {
    direction: 'horizontal' | 'vertical';
}

const ResizableComponentProvider: React.FC<IResizableProps> = ({ direction, children }) => {
    return (
        <ResizableBox height={400} width={400} resizeHandles={['s']}>
            {children}
        </ResizableBox>
    );
};

export default ResizableComponentProvider;
