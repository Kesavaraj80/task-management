"use client";

import { userSignUpSchema } from "@/schema/signupform.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  //   FormLabel,
  FormMessage,
} from "../../components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SignUp = () => {
  const router = useRouter();
  const { toast } = useToast();
  const onSubmit = async (user: z.infer<typeof userSignUpSchema>) => {
    axios
      .post("/api/user", {
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .then((res) => {
        if (res.data) {
          router.push("/login");
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        if (err.response) {
          const data = err.response.data as unknown as { message: string };
          toast({
            variant: "destructive",
            description: data.message,
          });
        }
      });
  };

  const queryParams = useSearchParams();

  const userSignUpForm = useForm<z.infer<typeof userSignUpSchema>>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const name = queryParams.get("name");
    const email = queryParams.get("email");
    if (name && email) {
      userSignUpForm.setValue("name", name);
      userSignUpForm.setValue("email", email);
    }
  }, [queryParams, userSignUpForm]);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="h-[60%] w-[40%]">
        <div className="h-[10%] w-full grid justify-center items-center">
          <span className="text-2xl">Create an account</span>
        </div>
        <Form {...userSignUpForm}>
          <form
            className="h-[80%] w-full grid grid-rows-5 justify-center"
            onSubmit={userSignUpForm.handleSubmit(onSubmit)}
          >
            <div>
              <FormField
                control={userSignUpForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        className="w-96 h-14"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={userSignUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        className="w-96 h-14"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={userSignUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        className="w-96 h-14"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={userSignUpForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Re Enter your password"
                        className="w-96 h-14"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Button
                className="w-96 text-xl h-12 "
                variant="default"
                type="submit"
                //   disabled={!userSignUpForm.formState.isValid}
              >
                Sign up
              </Button>
            </div>
          </form>
        </Form>

        <div className="h-[10%] w-full flex justify-center">
          <div className="w-80 h-full flex justify-center  items-center">
            <span>Already have an account?</span>
            <button
              className="ml-2 text-primary hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
