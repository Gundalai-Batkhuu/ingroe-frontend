import Image from 'next/image';

export const VoiceCommandIcon = () => {
	return (
		<div className="mx-auto w-fit">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="100"
				height="100"
				viewBox="0 0 48 48"
			>
				<linearGradient
					id="7Zr_n0zs~4_3KKC4ezMi7a_82prHjCOFaAH_gr1"
					x1="16.414"
					x2="29.362"
					y1="2.562"
					y2="18.93"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#a1aab3"></stop>
					<stop offset="1" stopColor="#8f979e"></stop>
				</linearGradient>
				<path
					fill="url(#7Zr_n0zs~4_3KKC4ezMi7a_82prHjCOFaAH_gr1)"
					d="M33,20H15V5c0-1.105,0.895-2,2-2h14c1.105,0,2,0.895,2,2V20z"
				></path>
				<linearGradient
					id="7Zr_n0zs~4_3KKC4ezMi7b_82prHjCOFaAH_gr2"
					x1="18.638"
					x2="30.135"
					y1="18.858"
					y2="30.751"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#6d7479"></stop>
					<stop offset="1" stopColor="#323538"></stop>
				</linearGradient>
				<path
					fill="url(#7Zr_n0zs~4_3KKC4ezMi7b_82prHjCOFaAH_gr2)"
					d="M15,20h18v8c0,1.105-0.895,2-2,2H17c-1.105,0-2-0.895-2-2V20z"
				></path>
				<linearGradient
					id="7Zr_n0zs~4_3KKC4ezMi7c_82prHjCOFaAH_gr3"
					x1="22.825"
					x2="25.43"
					y1="23.384"
					y2="26.967"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#e96120"></stop>
					<stop offset="1" stopColor="#cf410b"></stop>
				</linearGradient>
				<circle
					cx="24"
					cy="25"
					r="2.5"
					fill="url(#7Zr_n0zs~4_3KKC4ezMi7c_82prHjCOFaAH_gr3)"
					className="animate-pulse"
				></circle>
				<linearGradient
					id="7Zr_n0zs~4_3KKC4ezMi7d_82prHjCOFaAH_gr4"
					x1="24"
					x2="24"
					y1="36.985"
					y2="44.014"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#484b4f"></stop>
					<stop offset=".23" stopColor="#656d75"></stop>
					<stop offset=".367" stopColor="#727d86"></stop>
				</linearGradient>
				<path
					fill="url(#7Zr_n0zs~4_3KKC4ezMi7d_82prHjCOFaAH_gr4)"
					d="M31,40h-5v-3h-4v3h-5c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1h14c0.552,0,1-0.448,1-1v-2	C32,40.448,31.552,40,31,40z"
				></path>
				<linearGradient
					id="7Zr_n0zs~4_3KKC4ezMi7e_82prHjCOFaAH_gr5"
					x1="22.306"
					x2="26.296"
					y1="16.977"
					y2="36.358"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#a1aab3"></stop>
					<stop offset="1" stopColor="#767d84"></stop>
				</linearGradient>
				<path
					fill="url(#7Zr_n0zs~4_3KKC4ezMi7e_82prHjCOFaAH_gr5)"
					d="M35,17h-2v15c0,1.105-0.895,2-2,2H17c-1.105,0-2-0.895-2-2V17h-2c-0.552,0-1,0.448-1,1v14	c0,2.761,2.239,5,5,5h14c2.761,0,5-2.239,5-5V18C36,17.448,35.552,17,35,17z"
				></path>
			</svg>
		</div>
	);
};

export const AiChatIcon = () => {
	return (
		<div className="mx-auto w-fit">
			<Image
				src="https://img.icons8.com/?size=100&id=1RueIplXPGd2&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-auto animate-small-bounce"
				priority
			/>
		</div>
	);
};

export const DatabaseIcon = () => {
	return (
		<div className="mx-auto w-fit">
			<Image
				src="https://img.icons8.com/?size=100&id=43155&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-auto"
				priority
			/>
		</div>
	);
};

export const AICommunicationIcon = () => {
	return (
		<div className="mx-auto flex w-fit">
			<Image
				src="https://img.icons8.com/?size=100&id=j11I22jYGwW5&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-20 m-auto"
				priority
			/>
		</div>
	);
};

export const AccessibilityIcon = () => {
	return (
		<div className="mx-auto flex w-fit">
			<Image
				src="https://img.icons8.com/?size=100&id=68693&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-20 m-auto"
				priority
			/>
		</div>
	);
};

export const IntelligenceIcon = () => {
	return (
		<div className="mx-auto flex w-fit">
			<Image
				src="https://img.icons8.com/?size=100&id=121694&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-20 m-auto"
				priority
			/>
		</div>
	);
};

export const SmartDatabaseManagementIcon = () => {
	return (
		<div className="mx-auto flex w-fit">
			<Image
				src="https://img.icons8.com/?size=100&id=110478&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-20 m-auto"
				priority
			/>
		</div>
	);
};

export const ModernUIIcon = () => {
	return (
		<div className="mx-auto flex w-fit">
			<Image
				src="https://img.icons8.com/?size=100&id=116999&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-20 m-auto"
				priority
			/>
		</div>
	);
};

export const SecurityIcon = () => {
	return (
		<div className="flex w-fit mb-4">
			<Image
				src="https://img.icons8.com/?size=100&id=TJtAWRO3Gpa9&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-20 m-auto"
				priority
			/>	
		</div>
	);
};

export const ApiIntegrationIcon = () => {
	return (
		<div className="flex w-fit mb-4">
			<Image
				src="https://img.icons8.com/?size=100&id=b3uCTpcS-NiY&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-20 m-auto"
				priority
			/>	
		</div>
	);
};

export const DocumentationIcon = () => {
	return (
		<div className="flex w-fit mb-4">
			<Image
				src="https://img.icons8.com/?size=100&id=FbQwYNq0op8d&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-20 m-auto"
				priority
			/>	
		</div>
	);
};

export const TrainingProgramsIcon = () => {
	return (
		<div className="flex w-fit mb-4">
			<Image
				src="https://img.icons8.com/?size=100&id=113845&format=png&color=000000"
				width={100}
				height={100}
				alt="AI Chat Animation"
				className="size-20 m-auto"
				priority
			/>	
		</div>
	);
};





