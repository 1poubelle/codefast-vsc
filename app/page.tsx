import Buttonlogin from "@/components/Buttonlogin";

export default function Home() {
  const IsLoggedIn = true;
  const Name = "Ana";
  return (
    <main>
      <section className="bg-base-200">
        <div className="bg-base-200 flex justify-between items-center px-8 py-2 max-w-3xl mx-auto">
          <div className=" font-bold">CodeFastSaas</div>
          <div className="space-x-4  max-md:hidden">
            <a className=" link link-hover">Pricing</a>
            <a className=" link link-hover ">F.A.Q</a>
          </div>
          <div className="">
            <Buttonlogin IsLoggedIn={IsLoggedIn} name={Name} />
          </div>
        </div>
      </section>

      <section className=" px-8 text-center py-32  max-w-3xl mx-auto">
        <h1 className="lg:text-5xl text-center font-extrabold mb-6">
          Best title ever
        </h1>
        <div className="text-center opacity-90 mb-10">
          Best description ever
        </div>

        <Buttonlogin IsLoggedIn={IsLoggedIn} name={Name} />
      </section>
    </main>
  );
}
