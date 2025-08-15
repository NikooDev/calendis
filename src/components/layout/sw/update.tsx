import React, { useState } from 'react';
import { ISWUpdate } from '@Calendis/types/sw';
import { FLAG } from '@Calendis/utils/constants.util';
import Loader from '@Calendis/components/ui/loader/loader';
import toast from 'react-hot-toast';

const Update = ({ waiting, toastId }: ISWUpdate) => {
	const [loading, setLoading] = useState(false);

	const onClick = () => {
		if (!waiting) return;
		setLoading(true);

		const start = performance.now();
		let settled = false;

		const done = () => {
			if (settled) return;
			settled = true;

			const elapsed = performance.now() - start;
			const wait = Math.max(0, 3000 - elapsed);

			setTimeout(() => {
				sessionStorage.setItem(FLAG, '1');
				toast.dismiss(toastId);
				location.reload();
			}, wait);
		};

		navigator.serviceWorker.addEventListener('controllerchange', done, { once: true });

		waiting.addEventListener('statechange', () => {
			if (waiting.state === 'activated') done();
		}, { once: true });

		try { waiting.postMessage({ type: 'SKIP_WAITING' }); } catch {}

		setTimeout(done, 7000);
	};

	return (
		<div className="flex items-center justify-between gap-4">
			<span className="font-bold text-[.9rem] text-slate-700 w-1/2">Nouvelle version disponible.</span>
			<button
				onClick={onClick}
				disabled={loading}
				className="flex justify-center bg-pink-600 hover:bg-pink-800 disabled:cursor-default disabled:bg-pink-800 transition-colors duration-300 rounded-lg py-1.5 px-4 text-white font-bold text-sm disabled:opacity-60"
			>
				{loading ? (
					<span className="inline-flex items-center gap-2 w-full">
            <Loader size={18} color="#fff" strokeWidth={8} className="mr-1"/>
            Mise à jour…
          </span>
				) : (
					'Installer'
				)}
			</button>
		</div>
	);
};

export default Update;