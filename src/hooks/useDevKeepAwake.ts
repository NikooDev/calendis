import { useKeepAwake } from '@sayem314/react-native-keep-awake';

const useDevKeepAwake = () => {
	if (__DEV__) {
		useKeepAwake();
	}
}

export default useDevKeepAwake;
