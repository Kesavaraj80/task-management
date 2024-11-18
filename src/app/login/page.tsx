/* eslint-disable @next/next/no-img-element */
"use client";

import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { userLoginSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  //   FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { handleCredentialsSignIn } from "../actions/authActions";

const Login = () => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", {
        redirect: true,
        redirectTo: "/task",
      });
      console.log(result);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast.error("An error occurred while signing in. Please try again.");
    }
  };
  const onSubmit = async (values: z.infer<typeof userLoginSchema>) => {
    try {
      const result = await handleCredentialsSignIn({
        email: values.email,
        password: values.password,
      });
      if (result?.message) {
        toast.error(result.message);
      } else {
        toast.success("Login Success");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {}
  };

  const userLoginForm = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="h-[50%] w-[30%]">
        <div className="h-[10%] w-full grid justify-center items-center">
          <span className="text-2xl">Login</span>
        </div>

        <Form {...userLoginForm}>
          <form
            className="h-[50%] w-full grid justify-center items-center"
            onSubmit={userLoginForm.handleSubmit(onSubmit)}
          >
            <div>
              <FormField
                control={userLoginForm.control}
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
                control={userLoginForm.control}
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
              <LoadingButton pending={userLoginForm.formState.isSubmitting} />
            </div>
          </form>
        </Form>
        <div className="h-auto w-full flex justify-center">
          <div className="w-80 h-full flex justify-center ">
            <span>Don&apos;t have an account?</span>
            <button
              className="ml-2 text-primary hover:underline"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </button>
          </div>
        </div>
        <div className=" mt-2 w-full h-auto flex justify-center items-center flex-row  before:border-2 after:border-2">
          <span className="text-sm">OR</span>
        </div>
        <div className="h-[15%] w-full grid justify-center items-center">
          <button
            className="px-4 py-2 border w-96 h-14  flex justify-center items-center gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
            // onClick={(e) => {
            //   e.preventDefault();
            //   signIn("google", { redirect: true, redirectTo: "/task" });
            // }}

            onClick={handleGoogleSignIn}
          >
            <img
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
            <span>Login with Google</span>
          </button>
          {/* <Button
            onClick={(e) => {
              e.preventDefault();
              signIn("google", { callbackUrl: "http://localhost:3000/task" });
            }}
            className="w-80"
          >
            Login With Google
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
