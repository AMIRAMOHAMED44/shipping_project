import React, { useRef } from 'react';

const Messages = () => {
    const ref = useRef();
    return <h1 ref={ref}>Messages Page</h1>;
};

export default Messages;
