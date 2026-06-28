"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const authBtnClass =
  "inline-flex items-center justify-center rounded-sm border border-line bg-paper-pure px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition hover:border-ink/25 hover:bg-paper";

export function AuthControls() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className={authBtnClass}>
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className={`${authBtnClass} border-orange hover:border-orange-bright`}
          >
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 rounded-sm",
            },
          }}
        />
      </Show>
    </div>
  );
}