import type {AccountData, BalanceData} from '@/lib/types';
import {sql} from '@vercel/postgres';
import {Card} from '@/components/Tremor/Card';
import BalanceChart from '@/components/BalanceChart';

export default async function Home() {
	// TODO: Move to utils.ts
	const accountResult = await sql`SELECT * FROM accounts WHERE owner=${process.env.USERID} AND name='Net Worth'`;
	const account = accountResult.rows[0] as AccountData;
	const balancesResult = await sql`SELECT amount, date FROM balances WHERE account = ${account.id}`;
	const balances = balancesResult.rows as BalanceData[];
	const formattedBalances: BalanceData[] = balances
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((balance) => ({
			...balance,
			date: new Intl.DateTimeFormat('en-GB', {
				month: 'short',
				year: 'numeric'
			}).format(new Date(balance.date)),
			amount: balance.amount ? parseFloat(balance.amount) || 0 : 0
		}));
	return (
		<main>
			<Card className="h-60 w-full md:h-[350px] md:w-2/3">
				<BalanceChart data={formattedBalances} type={account.type} />
			</Card>
		</main>
	);
}
