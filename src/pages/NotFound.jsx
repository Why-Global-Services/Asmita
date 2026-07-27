import Button from "../components/common/Button";
export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 py-10 text-center sm:min-h-[55vh] sm:px-6">
      <section className="mx-auto max-w-md">
        <p className="font-serif text-7xl font-bold text-[#79259c] sm:text-8xl">
          404
        </p>
        <h2 className="mt-4 text-xl font-bold sm:text-2xl">
          Page Not Found
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
          The page you requested is unavailable or has moved.
        </p>
       <a className="mt-8 inline-block w-full sm:mt-6 sm:w-auto" href="#/">
          <Button>Back to Home</Button>
        </a>
      </section>
    </main>
  );
}
