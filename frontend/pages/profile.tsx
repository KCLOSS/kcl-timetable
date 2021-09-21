import axios from "axios";
import { useState } from "react";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { AuthInterface } from "../lib/auth";

interface FieldProps {
	title: string;
	value: string;
	disabled?: boolean;
	onChange?: (v: string) => void;
	onKeyDown?: () => void;
}

function Field({ title, value, onChange, disabled, onKeyDown }: FieldProps) {
	return (
		<div>
			<div className="mt-2">{ title }</div>
			<Input
				value={value}
				onKeyDown={onKeyDown}
				onChange={e => onChange(e.currentTarget.value)}
				disabled={disabled} />
		</div>
	)
}

const ProfilePage = ({ user }: AuthInterface) => {
	if (!user) return <Navbar />;

	const [surname, setSurname] = useState(user.surname ?? '');
	const [avatar, setAvatar] = useState(user.avatar ?? '');

	const [state, setState] = useState<'unchanged' | 'changed' | 'processing'>('unchanged');
	const [error, setError] = useState<string | undefined>();

	function save() {
		setState('processing');
		setError(undefined);

		axios.post(
			'/api/update',
			{
				surname,
				avatar
			}
		)
		.catch(error => setError(error?.response?.data ?? (''+error)))
		.finally(() => setState('unchanged'))
	}

	return (
		<div className="select-none p-4 max-w-5xl mx-auto flex flex-col">
			<Navbar user={{ ...user, surname, avatar }} />
			<Field
				title="First Name"
				value={user.firstname}
				disabled={true}
			/>
			<Field
				title="Surname"
				value={surname}
				onChange={setSurname}
				disabled={state === 'processing'}
				onKeyDown={() => state !== 'changed' && setState('changed')}
			/>
			<Field
				title="Avatar"
				value={avatar}
				onChange={setAvatar}
				disabled={state === 'processing'}
				onKeyDown={() => state !== 'changed' && setState('changed')}
			/>
			<span className="text-sm py-2">
				<b>Whitelisted origins:</b>
				<ul>
					<li>cdn.discordapp.com</li>
					<li>autumn.revolt.chat</li>
				</ul>
			</span>
			<div>
				<Button
					type="submit"
					onClick={save}
					disabled={state !== 'changed'}>
					Save
				</Button>
			</div>
			{
				error &&
				<div className="text-red-700 mt-4">
					{ ''+error }
				</div>
			}
			<div className="mx-auto py-16">
				<a href='/api/logout'>
					<Button>Logout</Button>
				</a>
			</div>
		</div>
	)
}

export { getServerSideProps } from '../lib/auth';
export default ProfilePage;
