'use client';

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import Input from '@Calendis/components/ui/form/input';
import { twMerge } from 'tailwind-merge';
import { InvisibleIcon, VisibleIcon } from '@Calendis/components/ui/icons';
import Tippy from '@tippyjs/react';
import Loader from '@Calendis/components/ui/loader/loader';
import { isEmailRegex } from '@Calendis/utils/constants.util';
import { NetworkEnum } from '@Calendis/types/app';
import { delay } from '@Calendis/utils/functions.util';
import { signIn } from '@Calendis/actions/auth.action';
import { IAuth } from '@Calendis/types/auth';
import { useSelector } from 'react-redux';
import { RootState } from '@Calendis/store/reducers';
import './login.css';
import AuthService from '@Calendis/services/auth.service';
import { useRouter } from 'next/navigation';

const Login = () => {
	const [login, setLogin] = useState<IAuth>({ email: '', password: '' });
	const [pending, setPending] = useState<boolean>(false);
	const [fieldError, setFieldError] = useState<Record<string, string>>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [formValid, setFormValid] = useState<boolean>(false);
	const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement[]>([]);
	const togglePasswordRef = useRef<HTMLButtonElement | null>(null);
	const online = useSelector((state: RootState) => state.app.online);
	const router = useRouter();

	useEffect(() => {
		if ((login.email.trim() && isEmailRegex.test(login.email) && login.password.trim()) && online === NetworkEnum.ONLINE) {
			setFormValid(true);
		} else {
			setFormValid(false);
		}
	}, [login, online]);

	const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
		if (el) {
			inputRef.current[index] = el;
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;

		setFieldError((prev) => ({ ...prev, [target.name]: '' }));
		setFormValid(false);
		setLogin({ ...login, [target.name]: target.value });
	}

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		if (!login.email.trim() || !login.password.trim()) {
			if (!login.email.trim()) {
				inputRef.current[0].focus();
			} else if (!login.password.trim()) {
				inputRef.current[1].focus();
			}

			return;
		}

		if (!isEmailRegex.test(login.email)) {
			setFieldError({ email: 'L\'adresse e-mail est incorrecte.' });
			return;
		}

		setFieldError({});
		setFormError(null);
		setPending(true);

		await delay(2000);

		const { ok, ...res } = await signIn(login.email, login.password);

		if (!ok) {
			setPending(false);
			setFormValid(false);

			if (res.fieldErrors) setFieldError(res.fieldErrors);
			if (res.formError) setFormError(res.formError);

			const fields = Object.keys(res.fieldErrors ?? {}) as ('email' | 'password')[];

			if (fields.length === 1) {
				fields[0] === 'email' ? inputRef.current[0]?.focus() : inputRef.current[1]?.focus();
			} else if (res.formError) {
				inputRef.current[0]?.focus();
			}

			return;
		}

		//AuthService.setSigningIn(true);

		const { user, token } = res;

		const response = await fetch('/api/auth', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ token })
		});

		if (!response.ok) {
			console.error('POST /api/auth failed:', response.status);
			setPending(false);
			setFormValid(false);
			setFormError('Impossible de créer la session.');
			//AuthService.setSigningIn(false);
			return;
		}

		//AuthService.setSigningIn(false);
		router.replace('/admin');
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col" method="post">
			<div className="flex flex-col mb-4 text-white">
				<Input label="Adresse e-mail"
							 type="text"
							 id="email"
							 name="email"
							 autoFocus
							 pending={pending}
							 filled={!!login.email}
							 error={fieldError['email']}
							 autoComplete="email"
							 onChange={handleChange}
							 themeAdmin={false}
							 ref={setInputRef(0)}/>
			</div>
			<div className="flex flex-col mb-6 relative text-white">
				<Input label="Mot de passe"
							 type={showPassword ? 'text' : 'password'}
							 id="password"
							 name="password"
							 pending={pending}
							 filled={!!login.password}
							 onFocus={() => setPasswordFocus(!passwordFocus)}
							 onBlur={() => setPasswordFocus(false)}
							 error={fieldError['password']}
							 inputClassName="pr-14"
							 onChange={handleChange}
							 themeAdmin={false}
							 ref={setInputRef(1)}/>
				<div className={twMerge(fieldError['password'] ? 'bottom-11' : 'bottom-2', 'absolute right-2')}>
					<button type="button" ref={togglePasswordRef} aria-label="Afficher ou masquer le mot de passe" className={twMerge((passwordFocus || login.password) ? 'text-theme-500 hover:bg-white/50' : 'text-white hover:bg-white/20', 'rounded-full p-1.5 flex items-center justify-center leading-none overflow-hidden transition-colors duration-300')} onClick={() => setShowPassword(!showPassword)}>
						<div key={'key'+showPassword} className="w-6 h-6">
							{
								showPassword ? (
									<VisibleIcon aria-hidden={true}/>
								) : (
									<InvisibleIcon aria-hidden={true}/>
								)
							}
						</div>
					</button>
					<Tippy reference={togglePasswordRef.current} content={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} theme="light" hideOnClick="toggle" placement="top-end" animation="shift-away" offset={[8,14]} arrow={false}/>
				</div>
			</div>
			<button type="submit" disabled={pending || !formValid} className="flex items-center justify-center relative overflow-hidden outline-0 focus-within:bg-pink-800/80 bg-pink-600/70 hover:bg-pink-800/80 disabled:bg-white/20 disabled:hover:!cursor-default shadow transition-colors duration-200 rounded-10 h-12 text-lg font-semibold">
				{ pending && (<Loader size={24} color="#fff" className="mr-4"/>) }
				<span className="text-white">{ pending ? 'Connexion...' : 'Se connecter' }</span>
				{ pending && (<div className="button-shimmer-wrapper"><div className="button-shimmer-bar"/></div>) }
			</button>

			{ formError && (
				<div className="bg-red-500/80 rounded-lg py-2 mt-4">
					<p className="text-sm font-semibold text-center text-white">{ formError }</p>
				</div>
			)}
		</form>
	);
};

export default Login;