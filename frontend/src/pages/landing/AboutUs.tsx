import { ProgressIcon, TaskIcon, TeamIcon } from "../../constants/icons";

const AboutUs = () => {
  return (
    <>
      <section className="bg-gray-50 py-24 px-18">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose TaskFlow?
            </h2>
            <p className="text-xl text-gray-600">
              Discover how we can transform your task management experience
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-custom text-3xl mb-4">
                <TaskIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Task Organization
              </h3>
              <p className="text-gray-600">
                Efficiently organize and prioritize tasks with our intuitive
                interface and smart categorization features.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-custom text-3xl mb-3 mt-1">
                <TeamIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                Work together seamlessly with real-time updates, shared
                workspaces, and integrated communication tools.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-custom text-3xl mb-3 mt-1">
                <ProgressIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Monitor project progress with detailed analytics, milestone
                tracking, and customizable reports.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
