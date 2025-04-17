import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "../../constants/icons";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white px-18">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img
                className="h-8 w-auto mb-4"
                src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
                alt="TaskFlow"
              />
              <p className="text-gray-400">
                Empowering teams to achieve more through efficient task
                management and collaboration.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: contact@taskflow.com</li>
                <li className="text-gray-400">Phone: (555) 123-4567</li>
                <li className="text-gray-400">
                  Address: 123 Task Street, SF, CA
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white text-xl">
                  <InstagramIcon />
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xl">
                  <LinkedInIcon />
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xl">
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
