import React, { useState, useEffect, use } from "react";
import axios from "axios";
import {
  FileText,
  Newspaper,
  Library,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StatCard from "../Components/StatCard";
import banerimg from "../assets/banerimg.png";
import { useNavigate } from "react-router-dom";

import Image1 from "../assets/Image1.jpg";
import Image2 from "../assets/Image2.jpg";
import Image3 from "../assets/Image3.jpg";
import Image4 from "../assets/Image4.jpg";
import Image5 from "../assets/Image5.jpg";
import Image6 from "../assets/Image6.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [standardsCount, setStandardsCount] = useState(0);
  const [periodicalsCount, setPeriodicalsCount] = useState(0);
  const [abstractsCount, setAbstractsCount] = useState(0);
  const [KCMembersCount, setKCMembersCount] = useState(0);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { img: Image1, url: "http://172.31.2.211:8080/jspui/" },
    { img: Image2, url: "https://library.araiindia.com/" },
    { img: Image3, url: "https://koha.araiindia.com/cgi-bin/koha/mainpage.pl" },
    { img: Image4, url: "https://www.onos.gov.in/" },
    { img: Image5, url: "https://saemobilus.sae.org/" },
    { img: Image6, url: "https://standards.bsb.co.in/home.aspx" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const fetchStandardsCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/standards`,
        );
        console.log("Server Response:", response.data); // CHECK THIS IN BROWSER CONSOLE
        if (response.data && response.data.success) {
          setStandardsCount(response.data.totalRecords);
        }
      } catch (error) {
        console.error("Error fetching standards count:", error);
      }
    };

    const fetchPeriodicalsCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/periodicals`,
        );
        if (response.data && response.data.success) {
          setPeriodicalsCount(response.data.totalRecords);
        }
      } catch (error) {
        console.error("Error fetching periodicals count:", error);
      }
    };

    const fetchAbstractsCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/abstracts`,
        );
        if (response.data && response.data.success) {
          setAbstractsCount(response.data.totalRecords);
        }
      } catch (error) {
        console.error("Error fetching abstracts count:", error);
      }
    };

    const fetchKCMembersCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/kcmembers`,
        );
        if (response.data && response.data.success) {
          setKCMembersCount(response.data.totalRecords);
        }
      } catch (error) {
        console.error("Error fetching KC Members count:", error);
      }
    };

    fetchKCMembersCount();
    fetchAbstractsCount();
    fetchPeriodicalsCount();
    fetchStandardsCount();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-indigo-50 rounded-3xl px-12 py-15 flex justify-between items-center mb-10 relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Knowledge Center Modules
          </h1>
          <p className="text-sm text-gray-500">
            Ready to start your day with some updates?
          </p>
        </div>
        <img
          src={banerimg}
          alt="Illustration"
          className="absolute right-6 bottom-0 h-50 opacity-90"
        />
      </div>

      <h3 className="text-gray-500 font-semibold uppercase tracking-wider text-xs mb-4">
        Overview
      </h3>

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-7 mb-10 ">
        <StatCard
          label="Standards"
          value={standardsCount}
          subLabel="STANDARDS"
          color="bg-amber-400"
          icon={<FileText className="text-white w-6 h-6" />}
          onClick={() => navigate("/standards")}
        />
        <StatCard
          label="Periodicals"
          value={periodicalsCount}
          subLabel="PERIODICALS"
          color="bg-indigo-600"
          icon={<Newspaper className="text-white w-6 h-6" />}
          onClick={() => navigate("/periodicals")}
        />
        <StatCard
          label="Abstracts"
          value={abstractsCount}
          subLabel="ABSTRACT"
          color="bg-rose-500"
          icon={<Library className="text-white w-6 h-6" />}
          onClick={() => navigate("/abstracts")}
        />
        <StatCard
          label="Total Views"
          value={KCMembersCount}
          subLabel="TOTAL MEMBERS"
          color="bg-green-500"
          icon={<Eye className="text-green-100 w-6 h-6" />}
          onClick={() => navigate("/kcmembers")}
        />
      </div>

      {/* Image Slideshow Section */}
      <h3 className="text-gray-500 font-semibold uppercase tracking-wider text-xs mb-4">
        Featured Updates
      </h3>
      <div className="relative group w-full h-[400px] overflow-hidden rounded-3xl shadow-sm border border-gray-100 bg-white">
        <a
          href={slides[currentSlide].url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-full"
        >
          <img
            src={slides[currentSlide].img}
            alt={`Slide ${currentSlide + 1}`}
            // Changed object-cover to object-contain to prevent cropping
            className="max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out"
          />
        </a>

        {/* Navigation Arrows - Glassmorphism style */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-md p-3 rounded-full text-gray-800 hover:bg-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-md p-3 rounded-full text-gray-800 hover:bg-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators - Clean Minimalism */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-2 bg-black/10 backdrop-blur-sm rounded-full">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-8 bg-indigo-600" : "w-2 bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
