import { useState, useEffect } from 'react';

const Comp = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        setInterval(() => {
            setTime(new Date());
        }, 1000);
    }, []);

    return <h1>{time.toLocaleString()} </h1>;
};

// show(<Comp />);
