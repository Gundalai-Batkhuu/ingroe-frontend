import Image from "next/image";

export default function Home() {
  return (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl font-bold">Welcome to the Legal AI App!</h1>
            <p className="text-lg text-center">
                Get started by choosing a country to view the legal information.
            </p>
        </div>
      </div>
  );
}
