import React from "react";
import CompanyIntro from "./CompanyIntro";
import Features from "./Features";
import Plans from "../customer-dashboard/plans";
import Reviews from "./Reviews";
import Contact from "./Contact";


export default function Home() {
    return (
        <div className=" min-h-screen">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
                {/* Left Content */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-700 mb-4">
                        Track your shipment
                    </h1>
                    <p className="text-teal-700 mb-6 text-base sm:text-lg max-w-md mx-auto md:mx-0">
                        Ship27 is your trusted partner for fast and reliable parcel delivery worldwide. We provide real-time tracking and seamless shipping solutions to keep your packages safe and on time.
                    </p>

                    <form className="flex flex-col sm:flex-row max-w-md mx-auto md:mx-0 gap-4">
                        <input
                            type="text"
                            placeholder="My shipment tracking number"
                            className="flex-grow border border-teal-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <button
                            type="submit"
                            className="bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-md px-6 py-3 text-teal-900 font-semibold"
                        >
                            Track
                        </button>
                    </form>
                </div>

                {/* Right Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src="src/assets/11.jpg"
                        alt="Shipment dashboard and boxes"
                        className="w-full max-w-sm sm:max-w-md md:max-w-full h-auto "
                    />
                </div>
            </section>

            {/* Plans */}
            <section>
                <Plans />
            </section>

            {/* Features Section */}
            <section>
                <Features />
            </section>

            {/* Testimonials */}
            <section>
                <Reviews />
            </section>


            {/* Contact Us */}
            <section>
                <Contact />
            </section>

        </div>
    );
}
