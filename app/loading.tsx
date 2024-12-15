import React from 'react';
import { Spinner } from '@/components/ui/icons';

const Loading: React.FC = () => {
    return (
        <div className="flex h-screen justify-center items-center">
            <Spinner/>
        </div>
    );
};

export default Loading;