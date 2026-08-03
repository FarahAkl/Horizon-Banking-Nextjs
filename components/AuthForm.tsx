"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Field, FieldGroup } from "./ui/field";
import { Button } from "./ui/button";
import CustomInput from "./CustomInput";

const formSchema = z.object({
  email: z.email({ message: "Enter a valid email" }),
  password: z.string().min(8,{message:'Please enter a valid password'}),
});

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);

  const { handleSubmit, control, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link
          href="/"
          className="cursor-pointer flex items-center gap-1"
        >
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={34}
            height={34}
            className="size-6 max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link you account to get started"
                : "Please enter you details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* Plaid Link */}</div>
      ) : (
        <>
          <form
            id="form-rhf-input"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <CustomInput
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                control={control}
              />
              <CustomInput
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                control={control}
              />
              <Field orientation="horizontal">
                <Button
                  type="submit"
                  form="form-rhf-input"
                  className={"form-btn"}
                >
                  Save
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </>
      )}
    </section>
  );
};

export default AuthForm;
