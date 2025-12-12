"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";

export default function HowWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const descriptionRefs = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const carSectionRef = useRef(null);
  const stepsRef = useRef(null);

  const stepsData = useMemo(
    () => [
      {
        id: 1,
        title: "Sign Up & Create a Profile",
        description:
          "Create your professional profile by highlighting your skills, expertise, and services you can offer. Specify the services you're seeking, ensuring a perfect match for skill exchange.",
      },
      {
        id: 2,
        title: "Browse & Find Matches",
        description:
          "Explore our diverse community of skilled professionals. Use our advanced matching system to find members whose skills you need and who might benefit from your expertise. Filter by category, location, and expertise level.",
      },
      {
        id: 3,
        title: "Connect & Arrange",
        description:
          "Initiate conversations with potential exchange partners through our secure messaging system. Discuss the scope of services, timeline, and establish clear expectations for the skill exchange.",
      },
      {
        id: 4,
        title: "Exchange Services",
        description:
          "Execute the service exchange professionally and efficiently. Follow our platform's guidelines to ensure a smooth transaction. Document the exchange process and maintain clear communication throughout.",
      },
      {
        id: 5,
        title: "Rate Your Service",
        description:
          "Complete the exchange by providing detailed feedback and ratings. Share your experience to help build trust in our community. Your reviews contribute to maintaining high-quality service standards across the platform.",
      },
    ],
    []
  );

  const handleStepClick = (stepNumber: number) => {
    if (activeStep === stepNumber) {
      setActiveStep(0);
    } else {
      setActiveStep(stepNumber);
    }
  };

  useEffect(() => {
    descriptionRefs.current = descriptionRefs.current.slice(
      0,
      stepsData.length
    );
  }, [stepsData]);

  return (
    <div
      className=" bg-[#F9F9F9] px-4 sm:px-6 lg:px-8 py-16"
      id="how-it-works"
      ref={sectionRef}
    >
      <div className="flex max-w-[1320px] mx-auto flex-col lg:flex-row justify-between items-stretch gap-8">
        {/* Mobile Title */}

        {/* Left section */}
        <div
          className="border border-[#E8F2FC] py-10 px-2 md:px-8 rounded-lg w-full lg:w-[50%] flex flex-col"
          ref={carSectionRef}
        >
          <div className="" ref={titleRef}>
            <h1 className="text-[#070707] text-[40px] xl:text-[48px] font-[500] leading-[57px] font-syne mb-4">
              How It Works
            </h1>
            <p className="text-[#4A4C56] text-[14px] md:text-[20px] font-[400] leading-[25px] mb-8">
              Our barter platform makes skill and service exchange seamless—no
              cash involved, just swapping what you do best for what you need!
            </p>
          </div>
          <div className="relative flex-grow-0">
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="relative z-10">
                <Image
                  src="/howitworks/howitworks.png"
                  alt="Car Image"
                  width={600}
                  height={300}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Steps (Right Side) */}
        <div className="flex-1 w-full lg:w-[50%]  flex flex-col" ref={stepsRef}>
          <div className="relative flex-grow">
            <div className="absolute left-12 top-12 h-4/5 border-l-2 border-dashed border-[#D2B9A1]"></div>
            <div className="space-y-6">
              {stepsData.map((step, index) => (
                <div key={step.id} className="relative">
                  <div
                    className={`${
                      activeStep === step.id ? "bg-[#D2B9A1]" : "bg-white  "
                    } rounded-lg p-6`}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div
                          className={`${
                            activeStep === step.id
                              ? "bg-white text-[#D2B9A1] border "
                              : "bg-[#fff] text-[#D2B9A1]"
                          }  rounded-full h-12 w-12 flex items-center border justify-center text-2xl font-bold z-10`}
                        >
                          {step.id}
                        </div>
                      </div>
                      <div className="w-full">
                        <h2
                          className={`${
                            activeStep === step.id
                              ? "text-white"
                              : "text-[#1D1F2C] "
                          } text-[20px] xl:text-[24px] font-syne font-[600] leading-[28px] mb-2 cursor-pointer`}
                          onClick={() => handleStepClick(step.id)}
                        >
                          {step.title}
                        </h2>
                        <div
                          ref={(el: HTMLDivElement | null): void => {
                            if (el) {
                              descriptionRefs.current[index] = el;
                            }
                          }}
                          style={{
                            overflow: "hidden",
                            height: activeStep === step.id ? "auto" : 0,
                            opacity: activeStep === step.id ? 1 : 0,
                            transition: "height 0.3s ease, opacity 0.3s ease",
                          }}
                        >
                          <p className="text-[#fff] text-[16px] xl:text-[18px] font-[400] leading-[25px]">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
