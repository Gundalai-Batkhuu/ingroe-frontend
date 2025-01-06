import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
	return (
		<Link href="/company" passHref className="size-10">
			<Image
				src="/logo.svg"
				width={65}
				height={65}
				alt="App logo"
				style={{ cursor: 'pointer' }}
			/>
		</Link>
	);
};

export default Logo;
