import React from 'react';
import { Spinner } from '@/components/ui/icons';

const Loading: React.FC = () => {
	return (
		<div className="flex h-screen items-center justify-center">
			<Spinner />
		</div>
	);
};

export default Loading;
