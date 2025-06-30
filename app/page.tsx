import { Header } from "@/components/header";
import { stackServerApp } from "./stack";
import ChatPage from "./chat/page";

export default async function Home() {
  const user = await stackServerApp.getUser();

  return (
    <div>
      <Header />
      {user ? <ChatPage /> : <p>Please log in to access the chat.</p>}
      {/* Or redirect to login if you prefer */}
    </div>
  );
}
