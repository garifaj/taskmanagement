import { useEffect, useRef } from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager at Tech Co",
    image: "http://localhost:5070/Photos/woman.png",
    feedback:
      "TaskFlow has revolutionized how our team manages projects. The interface is intuitive, and the collaboration features are game-changing.",
  },
  {
    name: "Michael Chen",
    role: "Team Lead at Innovation Inc",
    image: "http://localhost:5070/Photos/man.png",
    feedback:
      "The progress tracking features have helped us stay on top of deadlines and deliver projects more efficiently than ever before.",
  },
  {
    name: "Emily Rodriguez",
    role: "Startup Founder",
    image: "http://localhost:5070/Photos/woman.png",
    feedback:
      "As a startup founder, TaskFlow has been essential in keeping our small team organized and focused on what matters most.",
  },
];

const Testimonials = () => {
  const glideRef = useRef(null);

  useEffect(() => {
    if (glideRef.current) {
      const glide = new Glide(glideRef.current, {
        type: "carousel",
        perView: 3,
        gap: 32,
        autoplay: 5000, // Slide every 5 seconds
        animationDuration: 2500, // Smooth transition duration
        breakpoints: {
          768: {
            perView: 1,
          },
        },
      });

      glide.mount();
    }
  }, []);

  return (
    <section className="bg-white py-24 px-18">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
          What Our Users Say
        </h2>
        <div className="glide" ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {testimonials.map((item, idx) => (
                <li className="glide__slide" key={idx}>
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <div className="flex items-center mb-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-gray-600">{item.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600">"{item.feedback}"</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
