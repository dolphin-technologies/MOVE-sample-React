import { API_TOKEN, URL } from './api';

// registers user if it doesn't exist, fetches new auth code if user exists
export const getUserAuthCode = async (userId: string) => {
	try {
		const response = await fetch(`${URL}?userId=` + userId, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${API_TOKEN}`,
			},
		});
		const data = await response.json();
		return data;
	} catch (err) {
		console.log('catch registerUser', err);
	}
};
