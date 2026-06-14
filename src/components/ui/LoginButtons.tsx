import { signIn, signOut } from "next-auth/react";
import { loginGoogle, loginGithub } from "@/lib/authActions";
import { Button } from "./button";

export const GoogleButton = () => {
  return (
    <Button
      onClick={loginGoogle}
      variant="outline"
      type="button"
      className="hover:bg-gray-200"
    >
      <svg xmlns="http://w3.org" viewBox="0 0 48 48" width="100%" height="100%">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.5 24c0-1.63-.15-3.2-.43-4.75H24v9h12.75c-.55 2.96-2.22 5.48-4.73 7.16l7.35 5.69C43.68 36.8 46.5 31.02 46.5 24z"
        />
        <path
          fill="#FBBC05"
          d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.35-5.69c-2.03 1.36-4.64 2.18-8.54 2.18-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
      Login with Google
    </Button>
  );
};

export const GithubButton = () => {
  return (
    <Button
      className="bg-gray-800 hover:bg-gray-700 hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white text-white w-full  font-semibold shadow-md"
      onClick={loginGithub}
      variant="outline"
      type="button"
    >
      <svg
        height="20"
        width="20"
        viewBox="0 0 16 16"
        version="1.1"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        ></path>
      </svg>
      Login with Github
    </Button>
  );
};
