const Navbar = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-18">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <img
              className="h-8 w-auto mb-4 mt-4"
              src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
              alt="TaskFlow"
            />
            <div className="flex items-center space-x-4">
              <button className="inline-block shrink-0 rounded-md border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-transparent hover:text-blue-600">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
