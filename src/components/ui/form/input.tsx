import React from 'react';
import { InputProps } from '@Calendis/types/ui';
import { twMerge } from 'tailwind-merge';

const _Input = (
	{
		id,
		label,
		containerClassName,
		inputClassName,
		themeAdmin = false,
		filled,
		error,
		pending = false,
		...rest
	}: InputProps,
	ref: React.Ref<HTMLInputElement>
) => {
	const autoId = React.useId();
	const inputId = id ?? autoId;

	const _wrapper = themeAdmin ? twMerge(

	) : twMerge(
		'bg-white/20 focus-within:bg-white/50 border-2 focus-within:border-white/50 rounded-10 overflow-hidden',
		filled && 'bg-white/50! border-white/50!',
		error ? 'border-red-500!' : 'border-white/20!'
	);

	const _input = themeAdmin ? twMerge(

	) : twMerge(
		'text-theme-600 font-semibold w-full outline-0 px-4 h-12'
	);

	const wrapper = twMerge(
		'relative transition-all duration-300',
		pending && 'opacity-50',
		_wrapper,
		containerClassName
	);

	const input = twMerge(
		_input,
		inputClassName
	);

	return (
		<>
			<label htmlFor={inputId} className="mb-1.5 hover:cursor-pointer font-semibold">
				{ label }
			</label>
			<div className={wrapper}>
				<input {...rest} id={inputId} className={input} ref={ref} disabled={pending}/>
				{ error && <p key={error} className="bg-red-500 text-sm font-semibold text-white pt-2 px-3 pb-2">{ error }</p> }
			</div>
		</>
	);
};

const Input = React.forwardRef(_Input) as React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
Input.displayName = 'Input';

export default Input;