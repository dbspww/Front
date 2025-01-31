import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Loginnavbar from '../navbar/Loginnavbar';
import Cud from '../../api/cud';
import useAuth from '../../hooks/useAuth';

const FirstMainDiv = styled.div`
	width: calc(100% - 250px);
	height: 100vh;
	background-image: url('https://tistory1.daumcdn.net/tistory/4939852/skin/images/allLogo2.jpg');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	margin-left: 250px;
	position: fixed;
`;

const Filter = styled.div`
	width: 100%;
	height: 100%;
	background-color: rgba(0, 2, 18, 0.568);
`;

const ScrollableContent = styled.div`
	z-index: 999;
	background-color: white;
	position: absolute;
	top: 17%;
	width: 85%;
	left: 50%;
	transform: translate(-50%, 0%);
	overflow-y: auto;
	height: 75vh;
`;

function Write() {
	const titleref = useRef<HTMLInputElement>(null);
	const subtitleref = useRef<HTMLInputElement>(null);
	const detailref = useRef<HTMLTextAreaElement>(null);
	const { authority } = useAuth();

	useEffect(() => {
		authority();
	});

	async function submit() {
		const title = titleref.current?.value;
		const subtitle = subtitleref.current?.value;
		let board_text: string = '';
		if (detailref.current?.value) {
			board_text = detailref.current.value;
		}

		const data = {
			title,
			sub_title: subtitle,
			board_text,
		};

		if (title && subtitle && board_text) {
			console.log(data);
			await Cud.create(JSON.stringify(data));
		}
	}

	return (
		<FirstMainDiv>
			<Filter />
			<Loginnavbar />
			<ScrollableContent>
				<div style={{ padding: '50px', textAlign: 'center' }}>
					<h1 style={{ marginBottom: '30px' }}>글쓰기</h1>
					<label style={{ fontSize: '25px' }}>제목:</label>
					<br />
					<input
						type='text'
						style={{
							width: '80%',
							fontSize: '20px',
							fontWeight: '700',
							borderRadius: '5px',
							border: '1px solid black',
							height: '30px',
							padding: '10px',
							marginBottom: '30px',
						}}
						ref={titleref}
					/>
					<br />
					<label style={{ fontSize: '20px' }}>부제목:</label>
					<br />
					<input
						type='text'
						style={{
							width: '80%',
							fontSize: '16px',
							fontWeight: '700',
							borderRadius: '5px',
							border: '1px solid black',
							height: '30px',
							padding: '10px',
							marginBottom: '30px',
						}}
						ref={subtitleref}
					/>
					<br />
					<label>내용:</label>
					<br />
					<textarea
						style={{
							whiteSpace: 'pre-wrap',
							width: '80%',
							padding: '10px',
							resize: 'vertical',
							height: '200px',
							borderRadius: '5px',
							marginBottom: '30px',
						}}
						ref={detailref}
					/>
					<br />
					<button
						style={{
							backgroundColor: '#007bff',
							color: 'white',
							padding: '10px',
							width: '80px',
							fontWeight: '800',
							border: 'none',
							borderRadius: '15px',
							marginRight: '20px',
						}}
						onClick={submit}
					>
						완료
					</button>
					<button
						style={{
							backgroundColor: '#ff1100',
							color: 'white',
							padding: '10px',
							width: '80px',
							fontWeight: '800',
							border: 'none',
							borderRadius: '15px',
						}}
					>
						초기화
					</button>
				</div>
			</ScrollableContent>
		</FirstMainDiv>
	);
}

export default Write;
