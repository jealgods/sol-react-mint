import { TOKEN_CONSTANTS } from "../constants/token";

export const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} {TOKEN_CONSTANTS.NAME}. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
