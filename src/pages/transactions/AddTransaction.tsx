import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import UserProfileCard from "../../components/UserProfileCard";
import ProductModal from "./components/ProductModal";
import { Link } from "react-router-dom";

const AddTransaction = () => {
  const [step, setStep] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const steps = [
    {
      label: "Customer Detail",
      iconActive: "/assets/images/icons/tick-square-blue.svg",
      iconInactive: "/assets/images/icons/tick-square-grey.svg",
    },
    {
      label: "Assign Products",
      iconActive: "/assets/images/icons/tick-square-blue.svg",
      iconInactive: "/assets/images/icons/tick-square-grey.svg",
    },
    {
      label: "Review Transaction",
      iconActive: "/assets/images/icons/tick-square-blue.svg",
      iconInactive: "/assets/images/icons/tick-square-grey.svg",
    },
  ];

  const ProgressBar = ({ step }: { step: number }) => {
    return (
      <div className="flex justify-between relative w-full h-[127px] rounded-3xl p-5 bg-white">
        {steps.map((item, index) => {
          const isDone = step > index + 1;
          const isActive = step === index + 1;
          // const isFuture = step < index + 1;
  
          return (
            <div
              key={index}
              className="relative flex flex-col gap-3 items-center text-center w-full"
            >
              <img
                src={
                  isDone
                    ? "/assets/images/icons/tick-square-checked-blue.svg"
                    : isActive
                    ? item.iconActive
                    : item.iconInactive
                }
                className="size-8"
                alt="icon"
              />
  
              <div className="flex flex-col gap-1">
                <p className="font-medium text-font">
                  Step {index + 1}
                </p>
                <p className="font-semibold text-lg">{item.label}</p>
              </div>
  
              {/* Render line to next step */}
              {index < steps.length - 1 && (
                <div className="absolute top-[34px] right-[-50%] h-[3px] w-full">
                  <img
                    src={
                      isDone
                        ? "/assets/images/icons/Line-blue.svg"
                        : isActive
                        ? "/assets/images/icons/line-half-blue.svg"
                        : "/assets/images/icons/Line-grey.svg"
                    }
                    className="size-full object-cover"
                    alt="line"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  

  return (
    <>
    <div id="main-container" className="flex flex-1 h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0 overflow-y-auto">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-5 mt-5 mb-5"
        >
          <UserProfileCard title="Detail Toko" backLink="/transactions" />
        </div>

        <main className="flex flex-col gap-5 flex-1">
          <ProgressBar step={step} />

          {step === 1 && <StepOne handleNextStep={() => setStep(2)} />}
           
          {step === 2 && (
            <StepTwo
              handleNextStep={() => setStep(3)}
              handlePrevStep={() => setStep(1)}
              handleOpenModal={() => setIsModalOpen(true)}
            />
          )}
          {step === 3 && <StepThree handlePrevStep={() => setStep(2)} />}
        </main>
      </div>
    </div>

    <ProductModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
    </>
  );
};

export default AddTransaction;