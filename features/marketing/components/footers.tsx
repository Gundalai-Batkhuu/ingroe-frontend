export function Footer() {
  return (
    <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © 2024 Knowledge Commons. All rights reserved.
      </p>
      <nav className="flex gap-4 sm:ml-auto sm:gap-6">
        <a className="text-xs underline-offset-4 hover:underline" href="#">
          Terms of Service
        </a>
        <a className="text-xs underline-offset-4 hover:underline" href="#">
          Privacy
        </a>
      </nav>
    </footer>
  );
}