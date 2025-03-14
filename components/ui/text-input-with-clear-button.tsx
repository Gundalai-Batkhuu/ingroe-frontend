import { Search } from 'lucide-react';
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';

type InputWithClearProps = {
	placeholder?: string;
	onChange: (value: string) => void;
	onKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export const TextInputWithClearButton = ({
	placeholder = 'Enter text...',
	onChange
}: InputWithClearProps) => {
	const [value, setValue] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setValue(newValue);
		onChange(newValue);
	};

	const handleClear = () => {
		setValue('');
		onChange('');
		inputRef.current?.focus();
	};

	return (
		<div className="relative">
			<input
				ref={inputRef}
				type="text"
				className="w-full rounded-md border border-input bg-background py-2.5 pl-3 pr-10 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
			/>
			<div className="absolute inset-y-0 right-0 flex items-center pr-3">
				{value ? (
					<button
						type="button"
						onClick={handleClear}
						className="text-muted-foreground hover:text-foreground"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="size-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				) : (
					<Search className="size-5 text-muted-foreground" />
				)}
			</div>
		</div>
	);
};
