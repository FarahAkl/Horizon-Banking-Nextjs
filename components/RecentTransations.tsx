import Link from "next/link";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";

const RecentTransations = ({
  accounts,
  transactions,
  appwriteItemId,
  page,
}: RecentTransactionsProps) => {
  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          className="view-all-btn"
          href={`/transaction-history/?id=${appwriteItemId}`}
        >
          View all
        </Link>
      </header>

      {appwriteItemId && (
        <Tabs
          defaultValue={appwriteItemId}
          className="w-full flex-col"
        >
          <TabsList className={"recent-transactions-tablist"}>
            {accounts.map((account: Account) => (
              <TabsTrigger
                key={account.id}
                value={account.appwriteItemId}
              >
                <BankTabItem
                  account={account}
                  key={account.id}
                  appwriteItemId={appwriteItemId}
                />
              </TabsTrigger>
            ))}
          </TabsList>

          {accounts.map((account: Account) => (
            <TabsContent
              key={account.id}
              value={account.appwriteItemId}
              className={"space-y-4"}
            >
              <BankInfo
                account={account}
                appwriteItemId={appwriteItemId}
                type="full"
              />
              <TransactionsTable transactions={transactions} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  );
};

export default RecentTransations;
