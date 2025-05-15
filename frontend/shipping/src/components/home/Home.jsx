import React from "react";
import Header from "./Header";
import CompanyIntro from "./CompanyIntro";
import Features from "./Features";
import PlanSection from "./PlanSection"; // Make sure the file is named correctly
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Top navigation and logo */}
      <Header />

      {/* Company Introduction */}
      <section>
        <CompanyIntro />
      </section>

      {/* Features Section */}
      <section>
        <Features />
      </section>

      {/* Plans */}
      <section>
        <PlanSection />
      </section>

      {/* Testimonials */}
      <section>
        <Testimonials />
      </section>

      {/* Contact Us */}
      <section>
        <Contact />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
