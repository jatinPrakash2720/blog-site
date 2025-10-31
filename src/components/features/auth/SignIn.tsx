"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import Checkbox from "@/components/common/wrappers/Checkbox";
import Label from "@/components/common/wrappers/Label";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { useAuth } from "@/store/auth";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas/signInSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchMethod, setSearchMethod] = useState<"email" | "username">(
    "email"
  );
  const { continueWithGoogle, continueWithGithub, login } = useAuth();

  const handleResetPassword = () => {
    navigate("/auth/forgot-password");
  };

  const handleCreateAccount = () => {
    navigate("/auth/register");
  };
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
      saveLogin: false,
    },
  });
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await login(data);
      console.log("response :", response);
      console.log("response status :", response?.statusCode);
      
      if(response?.statusCode===409){
        toast.success(response?.message);
        continueWithGoogle();
      }
      if(response?.statusCode===408){
        toast.success(response?.message);
        continueWithGithub();
      }
      if(response?.statusCode!==409 && response?.statusCode!==408){
        toast.error(response?.message);
      }
      toast.success(response?.message);
      // Success handling is done in auth store (navigation)
    } catch {
      toast.error("Error while Login");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="h-screen flex flex-col md:flex-row font-sans w-screen flex-1 items-center justify-center p-4 overflow-hidden ">
      {/* Right column: hero image + testimonials */}

      {/* Left column: sign-in form */}
      <div className="w-full max-w-lg py-8 px-10 bg-white dark:bg-zinc-950  border dark:border-zinc-800/60 border-zinc-200/60 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl  font-semibold leading-tight text-foreground dark:text-muted-foreground">
            Welcome, Back !
          </h1>
          <p className=" lg:py-2 py-1 text-foreground dark:text-muted-foreground text-sm md:text-base lg:text-lg">
            Access your account and continue your journey with us
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
              <div className="animate-app-fade-in duration-200">
                <div className="flex gap-2 bg-muted/30 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMethod("email");
                      form.setValue("identifier", "");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      searchMethod === "email"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-foreground"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMethod("username");
                      form.setValue("identifier", "");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      searchMethod === "username"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-foreground"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Username
                  </button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2">
                      {searchMethod === "email" ? "Email Address" : "Username"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={searchMethod === "email" ? "email" : "text"}
                        placeholder={
                          searchMethod === "email"
                            ? "Enter your email address"
                            : "Enter your username"
                        }
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
                    <FormLabel className="text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter Your Password"
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

              <div className=" flex items-center justify-between text-sm">
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
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleResetPassword();
                  }}
                  className="hover:underline text-blue-500 dark:text-blue-500 transition-colors"
                >
                  Reset password
                </a>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl p-3 text-base font-medium h-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" /> Please wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <p className=" py-2 text-end text-sm text-foreground dark:text-muted-foreground">
            New to our platform?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCreateAccount();
              }}
              className="text-blue-500 hover:underline transition-colors"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
