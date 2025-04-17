const Hero = () => {
  return (
    <>
      <section className="relative bg-white overflow-hidden  px-18">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Manage Tasks with Ease and Efficiency
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline your workflow, collaborate seamlessly, and achieve
                more with our intuitive task management platform.
              </p>
              <button className="inline-block shrink-0 rounded-md border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-transparent hover:text-blue-600">
                Get Started Free
              </button>
            </div>
            <div className="relative">
              <img
                src="http://localhost:5070/Photos/task1.png"
                alt="TaskFlow Interface"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
