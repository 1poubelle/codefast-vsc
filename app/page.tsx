import Buttonlogin from "@/components/Buttonlogin";
import FAQListItems from "@/components/FAQListItems";
import Image from "next/image";
import ProductDemojpeg from "@/app/productDemo.jpeg";

// Removed unused imports

export default async function Home() {
  // Utiliser le handler NextAuth pour récupérer la session côté serveur
  const session = await fetch("/api/auth/session")
    .then((res) => res.json())
    .catch(() => null);

  const pricingFeatureList = ["a", "b", "c", "d"];

  return (
    <main>
      {/* header */}
      <section className="bg-base-200 ">
        <div className="bg-base-200 flex justify-between items-center px-8 py-2 max-w-5xl mx-auto">
          <div className=" font-bold">CodeFastSaas</div>
          <div className="space-x-4  max-md:hidden">
            <a className=" link link-hover" href="#pricing">
              Pricing
            </a>
            <a className=" link link-hover " href="#faq">
              F.A.Q
            </a>
          </div>
          <div className="">
            <Buttonlogin session={session} />
          </div>
        </div>
      </section>
      {/* HERO */}
      <section className=" px-8 text-center lg:text-left items-center py-32  max-w-5xl mx-auto flex flex-col lg:flex-row gap-14 lg:items-start">
        <Image
          src={ProductDemojpeg}
          alt="ProductDemojpeg"
          className="w-96 rounded-xl"
        />
        <div>
          <h1 className="lg:text-5xl text-center font-extrabold mb-6">
            Best title ever
          </h1>
          <div className=" opacity-90 mb-10">Best description ever okokok</div>
          <Buttonlogin session={session} />
        </div>
      </section>
      {/* PRICING */}
      <section className="bg-base-200" id="pricing">
        <div className=" px-8 text-center py-32  max-w-3xl mx-auto"></div>
        <p className="text-sm text-center uppercase font- text-primary mb-4">
          {" "}
          Pricing
        </p>
        <h2 className="lg:text-3xl text-center font-extrabold mb-30">
          A pricing that adapts to your needs
        </h2>
        <div className=" space-y-6 mt-8 items-baseline bg-white p-6 rounded-2xl shadow w-80 mx-auto">
          <div className="mb-4">
            <span className="text-4xl font-extrabold text-gray-900">$19</span>
            <span className="ml-1 text-lg text-gray-500 font-medium">
              /MONTH
            </span>
          </div>
          <ul className="  space-y-3 text-gray-800 text-base">
            {pricingFeatureList.map((priceItem) => {
              return (
                <li className="flex gap-2 items-center" key={priceItem}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="text-green-600 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  {priceItem}
                </li>
              );
            })}
          </ul>
          <Buttonlogin session={session} extraStyle="w-full" />
        </div>
      </section>
      {/* FAQ */}
      <section className="bg-base-200" id="faq">
        <div className=" px-8 text-left py-32  max-w-3xl mx-auto">
          <p className="text-sm text-left uppercase font- text-primary mb-4">
            {" "}
            FAQ
          </p>
          <h2 className="lg:text-3xl text-left font-extrabold mb-30">
            Frequently asked questions
          </h2>
          <ul className="mx-center">
            {[
              { question: "Qestion 1 ", answer: "Reponse 1" },
              { question: "Qestion 2 ", answer: "Reponse 2" },
              { question: "Qestion 3 ", answer: "Reponse 3" },
            ].map((qa) => (
              <FAQListItems key={qa.question} qa={qa} />
            ))}

            {/* answers*/}
          </ul>
        </div>
      </section>
    </main>
  );
}
