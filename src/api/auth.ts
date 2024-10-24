// export const fetchSignUp = async (url: string, data: any) => {
//     await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
// }

class Auth {
	static fetchSignup = async (signupUrl: string, data: any) => {
		let response = await fetch(signupUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		return response;
	};

	static fetchCheckDuplicatedEmail = async (url: string, email: string) => {
		const response = await fetch(`${url}/api/user/checkEmail?email=${email}`);
		const data = await response.json();
		return data;
	};

	static fetchSginIn = async (loginUrl: string, formData: any) => {
		const response = await fetch(loginUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString(),
		});
		return response;
	};
}

export default Auth;
