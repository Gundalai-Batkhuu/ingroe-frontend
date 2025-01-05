import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
	return (
		<Link href="/test" passHref>
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
