import axios from "axios";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react"
import { AuthInterface } from "../lib/auth";
import { backOff } from "exponential-backoff";
import { Event, User } from "../lib/entities";
import Preloader from "../components/Preloader";
import ListRenderer, { Everything } from "../components/ListRenderer";

const IndexPage = ({ user }: AuthInterface) => {
	const [data, setData] = useState<Everything | undefined>();
	const [filter, setFilter] = useState(true);
	const [preloader, setPreloader] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			backOff(() => axios('/api/everything'))
				.then(res => res.data)
				.then(({ events, users: userArray }: { events: Event[], users: User[] }) => {
					const users = {};
					for (const user of userArray) {
						users[user._id] = user;
					}

					return {
						events: events
							.map(event => {
								return {
									...event,
									people: (event.people ?? [])
										.map(id => users[id])
										.filter(x => typeof x !== 'undefined')
								}
							}),
						users
					}
				})
				.then(setData)
				.catch(alert);
		}
	}, []);

	return (
		<div className="select-none p-4 max-w-5xl mx-auto flex flex-col overflow-hidden h-screen">
			<title>KCL Timetables</title>
			<meta property="og:title" content="KCL Timetables" />
			<meta property="og:type" content="website" />
			<meta property="og:url" content="https://kcl.insrt.uk/" />
			<meta property="og:description" content="Share timetable information with friends and figure out who's in your lectures and groups." />

			<Navbar user={user} />

			<div className="flex items-center">
				<input className="mr-1" type="checkbox" id="self" name="self" checked={filter} onChange={() => setFilter(!filter)} disabled={!user} />
				<label htmlFor="self" className={user ? "hover:text-gray-900" : "text-gray-500"}>Filter my events.</label>
			</div>

			{/*<div className="flex items-center">
				<input className="mr-1" type="checkbox" id="prel" name="prel" checked={preloader} onChange={() => setPreloader(!preloader)} />
				<label htmlFor="prel" className={"hover:text-gray-900"}>Appreciate the preloader.</label>
			</div>*/}

			{ (preloader || typeof data === 'undefined') && <Preloader /> }
			{ !preloader && data && <ListRenderer {...data} filter={user && filter} user={user?._id} /> }
		</div>
	)
}

export { getServerSideProps } from '../lib/auth';
export default IndexPage;
