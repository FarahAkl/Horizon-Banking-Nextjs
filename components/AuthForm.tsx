"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Field, FieldGroup } from "./ui/field";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import CustomInput from "./CustomInput";
import { useRouter } from "next/navigation";

const formSchema = (type: string) =>
  z.object({
    email: z.email({ message: "Enter a valid email" }),
    password: z.string().min(8, { message: "Please enter a valid password" }),
    firstName:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2, { message: "Please enter a valid name" }),
    lastName:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2, { message: "Please enter a valid name" }),
    address1:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2, { message: "Please enter a valid address" }),
    state:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2, { message: "Please enter a valid state" }),
    city:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2, { message: "Please enter a valid city" }),
    postalCode:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2, { message: "Please enter a valid postal code" }),
    dob:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2, { message: "Please enter a valid date" }),
    ssn:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2, { message: "Please enter a valid ssn" }),
  });

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const validFormSchema = formSchema(type);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm<z.infer<typeof validFormSchema>>({
    resolver: zodResolver(validFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof validFormSchema>) => {
    setIsLoading(true);
    try {
      // Sign up with Appwrite & create a plain link token

      if (type === "sign-in") {
        // const res = await signIn({
        //   email: data.email,
        //   password: data.password,
        // });

        // if (res) router.push("/");
      }

      if (type === "sign-up") {
        // const newUser = await signUp(data);
        // setUser(newUser);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      control={control}
                    />
                    <CustomInput
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                      control={control}
                    />
                  </div>
                  <CustomInput
                    name="address1"
                    label="Address"
                    placeholder="Enter your address"
                    control={control}
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      name="state"
                      label="State"
                      placeholder="ex: NYC"
                      control={control}
                    />
                    <CustomInput
                      name="postalCode"
                      label="Postal Code"
                      placeholder="ex: 12345"
                      control={control}
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      name="dob"
                      type="date"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                      control={control}
                    />
                    <CustomInput
                      name="city"
                      label="City"
                      placeholder="ex: NYC"
                      control={control}
                    />
                  </div>
                  <CustomInput
                    name="ssn"
                    label="SSN"
                    placeholder="ex: 12345"
                    control={control}
                  />
                </>
              )}
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
              <Field
                orientation="horizontal"
                className="flex flex-col gap-4"
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  form="form-rhf-input"
                  className={"form-btn w-full"}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign in"
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <footer className="flex justify-center gap-1">
            <p className="font-normal text-14 text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
