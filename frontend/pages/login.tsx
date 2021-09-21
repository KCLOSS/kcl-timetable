import { useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import { AuthInterface } from "../lib/auth";

const UUID = `[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}`;
const URL_RE = `^https:\/\/scientia-eu-v2-4-api-d4-02.azurewebsites.net\/api\/ical\/(${UUID})\/(${UUID})\/timetable.ics$`;

const LoginPage = ({ user }: AuthInterface) => {
	const [id, setId] = useState('');

	useEffect(() => {
		let match = id.match(URL_RE);
		if (match) {
			setId(match[2]);
		}
	}, [ id ]);

	return (
		<div className="select-none p-4 max-w-5xl mx-auto flex flex-col overflow-hidden h-screen">
			<Navbar user={user} />
			<form className="w-full max-w-md m-auto flex flex-col gap-4" method="POST" action="/api/login">
				<Input placeholder="Enter UUID or subscribe URL" name="id" value={id} onChange={e => setId(e.currentTarget.value)} />
				<Button type="submit">Login</Button>
				<a className="text-center text-gray-700 hover:text-gray-900 underline" href="https://autumn.revolt.chat/attachments/gsXjnExz_NnKq-qgUzAdZ-dRui97Ul2DHvwF8gdeC5/image.png">How to get my subscribe URL?</a>
			</form>
		</div>
	)
}

export { getServerSideProps } from '../lib/auth';
export default LoginPage;
