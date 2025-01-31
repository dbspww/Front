import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Loginnavbar from '../navbar/Loginnavbar';
import Board from '../../api/board';
import Member from '../../api/member';
import Auth from '../../api/auth';

// 블로그 포스트 인터페이스
interface BlogPost {
	id: number;
	title: string;
	sub_title: string;
	name: string;
	uptime: string;
	board_text: string;
}

// 댓글 데이터의 타입 정의
interface Comment {
	id: number;
	comment_text: string;
	name: string;
	writer_email: string;
	board_id: number;
	uptime: string;
	user_id: string;
}

// 스타일링
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

function PostDetail() {
	const { id } = useParams<{ id: string }>();
	const [post, setPost] = useState<BlogPost | null>(null);
	const [comment, setComment] = useState<Comment[]>([]);
	const [input, setInput] = useState('');
	const [lengths, setLengths] = useState(0);
	const [auth, setAuth] = useState(false);
	const [key, setKey] = useState('');
	const PostOne = async () => {
		const data = await Board.fetchPost(id as string);
		setPost(data);
	};
	const commentView = async (id: string) => {
		try {
			const result = await Member.Viewcomment(id);
			console.log(result);
			setComment(result);
			setLengths(result.length);
		} catch (error) {
			console.error('Error fetching comments:', error);
		}
	};

	const authoritys = async () => {
		const response = await Auth.fetchAuthority();
		let data = await response.json();
		if (response.ok) {
			if (data.user.role === 'admin') {
				setAuth(true);
				setKey(data.user.id);
			} else {
				setAuth(false);
				setKey(data.user.id);
			}
		} else {
			setAuth(false);
			alert('토큰이 유효하지 않습니다. 재로그인 해주세요.');
			window.location.href = '../signin';
		}
	};

	useEffect(() => {
		authoritys();
		PostOne();
		commentView(id as string);
	}, []);

	async function write() {
		const data = {
			comment_text: input,
		};
		// if (data.comment_text === '') {
		// 	return alert('댓글을 입력하세요.');
		// }
		console.log(data);
		await Member.CreateComment(id as string, data);
		setInput('');

		const result = await Member.Viewcomment(id as string);
		setComment(result);
		setLengths(result.length);
	}

	function handlechange(e: any) {
		setInput(e.target.value);
	}

	const deletes = async (commentsId: number) => {
		await Member.deleteComments(commentsId as number);

		const result = await Member.Viewcomment(id as string);
		setComment(result);
		setLengths(result.length);
	};

	if (!post) return <div>Loading...</div>;

	return (
		<FirstMainDiv>
			<Filter />
			<Loginnavbar />
			<ScrollableContent>
				<div style={{ padding: '50px' }}>
					<h1 style={{ textAlign: 'center' }}>{post.title}</h1>
					<h2 style={{ textAlign: 'center' }}>{post.sub_title}</h2>
					<div
						style={{ textAlign: 'left', paddingTop: '80px' }}
						dangerouslySetInnerHTML={{
							__html: post.board_text.replace(/\n/g, '<br />'),
						}}
					/>

					<div style={{ bottom: '20px', right: '40px' }}>
						<p style={{ textAlign: 'right' }}>작성자: {post.name}</p>
						<p style={{ textAlign: 'right' }}>
							날짜: {post.uptime.split(' ')[0]}
						</p>
						<div style={{ border: '1px solid black' }}></div>
						<div
							style={{
								marginBottom: '50px',
								marginTop: '50px',
							}}
						>
							<h2>댓글 작성하기</h2>
							<div style={{ display: 'flex' }}>
								<input
									type='text'
									onChange={handlechange}
									style={{ width: '90%', padding: '10px' }}
									value={input}
								/>
								<button onClick={write} type='submit'>
									작성하기
								</button>
							</div>
						</div>
						<h2>댓글 {lengths}개</h2>
						{(comment || []).map((item) => (
							<ul
								key={item.id}
								style={{ listStyleType: 'none', margin: '30px' }}
							>
								<li
									style={{
										borderBottom: '1px solid gray',
										width: '80%',
										position: 'relative',
										marginBottom: '50px',
										paddingTop: '0 !important',
										paddingLeft: '50px',
										paddingBottom: '25px',
										left: '50%',
										transform: 'translate(-50%, 0)',
									}}
								>
									<strong>{item.name}</strong>: {item.comment_text}
									<br />
									<span style={{ position: 'absolute', right: 0, top: '0' }}>
										{item.uptime.split(' ')[0]}
									</span>
									<span
										style={{
											display: item.user_id == key || auth ? 'block' : 'none',
										}}
									>
										<button onClick={() => deletes(item.id)}>삭제 버튼</button>
									</span>
								</li>
							</ul>
						))}
					</div>
				</div>
			</ScrollableContent>
		</FirstMainDiv>
	);
}

export default PostDetail;
