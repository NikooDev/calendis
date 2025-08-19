'use client';

import React from 'react';
import { AppProgressProvider } from '@bprogress/next';

const Navprogress = () => {
	return <AppProgressProvider color="#fff" spinnerPosition="top-left"/>;
};

export default Navprogress;