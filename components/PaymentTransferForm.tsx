"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import CustomInput from "./CustomInput";
import { BankDropdown } from "./BankDropdown";
import { createTransaction } from "@/lib/actions/transaction.actions";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),

  name: z.string().optional(),

  amount: z.string().min(1, "Please enter an amount"),

  senderBank: z.string().min(4, "Please select a valid bank account"),

  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const receiverAccountId = decryptId(data.sharableId);

      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });

      const senderBank = await getBank({
        documentId: data.senderBank,
      });

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };

      // Create transfer
      const transfer = await createTransfer(transferParams);

      // Create transaction
      if (transfer) {
        const transaction = {
          name: data.name || "",
          amount: data.amount,
          senderId: senderBank.userId,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId,
          receiverBankId: receiverBank.$id,
          email: data.email,
        };

        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="flex flex-"
    >
      <FieldGroup>
        {/* Source Bank */}
        <Controller
          control={form.control}
          name="senderBank"
          render={({ fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="border-t border-gray-200"
            >
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FieldLabel className="text-14 font-medium text-gray-700">
                    Select Source Bank
                  </FieldLabel>

                  <FieldDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FieldDescription>
                </div>

                <div className="flex w-full flex-col relative">
                  <BankDropdown
                    accounts={accounts}
                    setValue={form.setValue}
                    otherStyles="w-full! px-2! py-3!"
                  />

                  {fieldState.error && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </Field>
          )}
        />

        {/* Transfer Note */}
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="border-t border-gray-200"
            >
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FieldLabel className="text-14 font-medium text-gray-700">
                    Transfer Note (Optional)
                  </FieldLabel>

                  <FieldDescription className="text-12 font-normal text-gray-600">
                    Please provide any additional information or instructions
                    related to the transfer
                  </FieldDescription>
                </div>

                <div className="flex w-full flex-col">
                  <Textarea
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    placeholder="Write a short note here"
                    className="input-class focus:outline-bankGradient!"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </Field>
          )}
        />

        {/* Bank Account Details */}
        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Bank account details
          </h2>

          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div>

        {/* Recipient Email */}
        <CustomInput
          control={form.control}
          name="email"
          label="Recipient's Email Address"
          placeholder="ex: johndoe@gmail.com"
          type="email"
        />

        {/* Receiver Sharable ID */}
        <CustomInput
          control={form.control}
          name="sharableId"
          label="Receiver's Plaid Sharable Id"
          placeholder="Enter the public account number"
        />

        {/* Amount */}
        <CustomInput
          control={form.control}
          name="amount"
          label="Amount"
          placeholder="ex: 5.00"
        />

        {/* Submit */}
        <div className="payment-transfer_btn-box">
          <Button
            type="submit"
            className="payment-transfer_btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                &nbsp; Sending...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default PaymentTransferForm;
