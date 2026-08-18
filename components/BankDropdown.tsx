"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { formUrlQuery, formatAmount } from "@/lib/utils";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSeclected] = useState(accounts[0]);

  const handleBankChange = (id: string | null) => {
    if (!id) return;
    const account = accounts.find((account) => account.appwriteItemId === id)!;

    setSeclected(account);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: id,
    });
    router.push(newUrl, { scroll: false });

    if (setValue) {
      setValue("senderBank", id);
    }
  };

  return (
    <Select
      defaultValue={selected.id}
      onValueChange={(value) => handleBankChange(value)}
    >
      <SelectTrigger className={`flex w-full! gap-3 md:w-75 ${otherStyles}`}>
        <Image
          src="icons/credit-card.svg"
          width={20}
          height={20}
          alt="account"
        />
        <p className="line-clamp-1 w-full text-left">{selected.name}</p>
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={false}
        align="start"
        className="
    w-(--anchor-width)
    min-w-(--anchor-width)
    rounded-xl
    border
    border-gray-200!
    outline-0
    bg-white
    p-1
    shadow-lg
  "
      >
        <SelectGroup>
          <SelectLabel className="px-3! py-2! text-xs font-medium text-gray-500">
            Select a bank to display
          </SelectLabel>

          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.appwriteItemId}
              className="
          cursor-pointer
          rounded-lg
          px-3!
          py-3!
          outline-none
          focus:bg-gray-50
          data-highlighted:bg-gray-50
        "
            >
              <div className="flex w-full items-center gap-3">
                <Image
                  src="/icons/credit-card.svg"
                  width={18}
                  height={18}
                  alt="account"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {account.name}
                  </p>

                  <p className="text-xs font-medium text-blue-600">
                    {formatAmount(account.currentBalance)}
                  </p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
