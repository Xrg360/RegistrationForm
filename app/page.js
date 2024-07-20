
import Navbar from "./common/Navbar";
import Landing from "./home/landing";

export default function Home() {
  return (
    <main className="h-screen w-full justify-center items-center flex">
      <Navbar/>
      <Landing/>
    </main>
  );
}
