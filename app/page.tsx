//
// page.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// home page
//

import { Header } from "@/components/header";
import { stackServerApp } from "./stack";
import ChatPage from "./chat/page";
import SignInPage from "./signin/page";

export default async function Home() {
  const user = await stackServerApp.getUser();

  return (
    <div>
      <Header />
      {user ? <ChatPage /> : <SignInPage />}
    </div>
  );
}
