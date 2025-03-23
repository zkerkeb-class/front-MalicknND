import Image from "next/image";
import React from "react";

const Testimonials = () => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-2">Customer testimonials</h2>
      <p className="text-gray-600 mb-12">What Our Users Are Saying</p>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            name: "Donald Jackson",
            role: "Graphic Designer",
            image: "/avatar-1.jpg",
          },
          {
            name: "Richard Nelson",
            role: "Content Creator",
            image: "/avatar-2.jpg",
          },
          {
            name: "James Washington",
            role: "Co-Founder",
            image: "/avatar-3.jpg",
          },
        ].map((testimonial, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
            <Image
              src="https://cdn.pixabay.com/photo/2023/07/19/03/18/people-8135977_1280.png"
              alt={testimonial.name}
              width={64}
              height={64}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="font-semibold">{testimonial.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{testimonial.role}</p>
            <div className="flex justify-center text-yellow-400 mb-4">
              {"★".repeat(5)}
            </div>
            <p className="text-gray-600">
              I&apos;ve been using imagify for nearly two years now for my
              Instagram, and it has been incredibly user-friendly, making my
              work much easier.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
