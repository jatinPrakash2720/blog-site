"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/common/wrappers/Checkbox";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const USERNAME_AVAILABLE_DISPLAY_DURATION = 1000; // milliseconds

export const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [showUsernameAvailable, setShowUsernameAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { continueWithGoogle, continueWithGithub, signUp, uniqueUsername } =
    useAuth();
  const navigate = useNavigate();
  const debounced = useDebounceCallback(setUsername, 300);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      saveLogin: false,
    },
  });

  const handleSignInNav = () => navigate("/auth/login");
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("data :", data);
      const response = await signUp(data);
      console.log("response :", response);
      if (!response?.success) {
        toast.warning(response?.message);
        setIsSubmitting(false);
        return;
      }
      toast.success(response?.message);
      setIsSubmitting(false);
      return;
    } catch {
      toast.error("Sign Up failed, Please try again");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        setShowUsernameAvailable(false);
        try {
          const response = await uniqueUsername(username);
          setUsernameMessage(response?.message);
          if (response?.message === "Username is available") {
            setShowUsernameAvailable(true);
            setTimeout(() => {
              setShowUsernameAvailable(false);
            }, USERNAME_AVAILABLE_DISPLAY_DURATION);
          }
        } catch {
          setUsernameMessage("Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);
  return (
    <div className="h-screen flex flex-col md:flex-row font-sans w-screen flex-1 items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-lg py-8 px-10 hover:shadow-3xl bg-white dark:bg-zinc-950 backdrop-blur-xl border dark:border-zinc-800/60 border-zinc-200/60 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col  gap-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground dark:text-muted-foreground">
            Create Account
          </h1>
          <p className=" lg:py-2 py-1 text-foreground dark:text-muted-foreground text-sm md:text-base lg:text-lg">
            Join our community and start your journey with us
          </p>
          <div className="flex justify-center items-center">
            <button
              onClick={continueWithGoogle}
              className=" w-1/2 rounded-r-none rounded-2xl p-3 text-base font-medium h-auto bg-background border border-input hover:bg-accent hover:text-accent-foreground shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              onClick={continueWithGithub}
              className=" w-1/2 rounded-l-none rounded-2xl p-3 text-base font-medium h-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <GithubIcon />
              Github
            </button>
          </div>

          <div className=" py-2 relative flex items-center justify-center">
            <span className="px-4  text-sm  text-foreground dark:text-muted-foreground absolute">
              Or continue with
            </span>
          </div>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2">
                      Username <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Choose Username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                          className="w-full h-12 focus:ring-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:border-none focus:shadow-none bg-zinc-100 hover:bg-zinc-200  dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-300 placeholder:text-muted-foreground sm:text-sm md:text-base lg:text-lg p-3 rounded-2xl focus:outline-none focus:border-primary"
                        />
                        <span
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[11px] md:text-[12px] text-green-500 pointer-events-none transition-all duration-300 ${
                            showUsernameAvailable
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 translate-x-2 pointer-events-none"
                          }`}
                        >
                          Username is available
                        </span>
                        {isCheckingUsername && !showUsernameAvailable && (
                          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
                        )}
                      </div>
                    </FormControl>
                    {usernameMessage &&
                      usernameMessage !== "Username is available" && (
                        <div className="">
                          <p className="text-[11px] md:text-[12px] text-red-500">
                            {usernameMessage}
                          </p>
                        </div>
                      )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sm:text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Email"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        className="w-full h-12 focus:ring-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:border-none focus:shadow-none bg-zinc-100 hover:bg-zinc-200  dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-300 placeholder:text-muted-foreground sm:text-sm md:text-base lg:text-lg p-3 rounded-2xl focus:outline-none focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sm:text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2">
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Create Password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          className="w-full h-12 focus:ring-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:border-none focus:shadow-none bg-zinc-100 hover:bg-zinc-200  dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-300 placeholder:text-muted-foreground sm:text-sm md:text-base lg:text-lg p-3 rounded-2xl focus:outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-foreground hover:text-foreground transition-colors" />
                          ) : (
                            <Eye className="w-5 h-5 text-foreground hover:text-foreground transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" flex items-center justify-end text-sm">
                <div className="flex items-center gap-2 ">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    className="border-2 border-gray-400 dark:border-gray-500"
                    checked={form.watch("saveLogin")}
                    onCheckedChange={(checked) => {
                      form.setValue("saveLogin", checked === true);
                    }}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-foreground/90 cursor-pointer"
                  >
                    Keep me signed in
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className=" w-full rounded-2xl p-3 text-base font-medium h-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> PLease wait
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>
          <p className=" py-2 text-end text-sm text-foreground">
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSignInNav();
              }}
              className=" text-blue-500 hover:underline transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
