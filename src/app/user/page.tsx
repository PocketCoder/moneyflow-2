import Image from 'next/image';
import {getSession} from '@auth0/nextjs-auth0';
import {UserProfile} from '@auth0/nextjs-auth0/client';

export default async function User() {
	const session = await getSession();
	const user: UserProfile | undefined = session?.user;
	if (!user) {
		return <div>Not logged in</div>;
	}
	return (
		user && (
			<div>
				<Image src={user.picture!} width={100} height={100} alt={user.name!} />
				<h2>{user.name}</h2>
				<p>{user.email}</p>
			</div>
		)
	);
}
