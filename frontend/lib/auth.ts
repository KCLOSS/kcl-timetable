import { User } from "./entities";
import { connectToDatabase } from "./mongodb";

export async function findUser(Identity?: string) {
    if (!Identity) return { };

    const client = await connectToDatabase();
    return {
        user: await client
            .db('timetables')
            .collection('users')
            .findOne({ _id: Identity }) as User,
        client
    }
}

export async function getServerSideProps(context: any): Promise<{ props: AuthInterface }> {
	const { Identity } = context.req.cookies;
    const { user } = await findUser(Identity);

    if (!user) return { props: {} };
	return {
		props: {
			user
		}
	}
}

export interface AuthInterface {
    user?: User
}
