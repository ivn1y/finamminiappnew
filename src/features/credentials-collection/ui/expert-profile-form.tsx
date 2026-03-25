"use client";

import React, { useState, useEffect, useRef } from "react";

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="20"
    viewBox="0 0 10 20"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.70448 0.259227C9.3289 -0.103986 8.74026 -0.0829544 8.38971 0.306203L0.250181 9.34234C-0.0833931 9.71266 -0.0833931 10.2873 0.250181 10.6577L8.38971 19.6938C8.74026 20.083 9.3289 20.104 9.70448 19.7408C10.0801 19.3776 10.1004 18.7676 9.74982 18.3785L2.20268 10L9.74982 1.62151C10.1004 1.23236 10.0801 0.622441 9.70448 0.259227Z"
      fill="white"
    />
  </svg>
);

const SelectArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.90203 9.96871C7.19557 9.63849 7.70122 9.60874 8.03145 9.90228L12 13.4298L15.9685 9.90228C16.2987 9.60874 16.8044 9.63849 17.0979 9.96871C17.3914 10.2989 17.3617 10.8046 17.0315 11.0981L12.5315 15.0981C12.2283 15.3676 11.7716 15.3676 11.4685 15.0981L6.96847 11.0981C6.63824 10.8046 6.6085 10.2989 6.90203 9.96871Z"
      fill="#A4A4B2"
    />
  </svg>
);

export interface ExpertProfileFormProps {
  onBack: () => void;
  onNext: (data: any) => void;
}

export function ExpertProfileForm({ onBack, onNext }: ExpertProfileFormProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expertRole, setExpertRole] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [expertise, setExpertise] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const roleRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const experienceDropdownRef = useRef<HTMLDivElement>(null);

  // Обработка клика вне селектов
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (openDropdown === "role") {
        if (
          roleRef.current &&
          roleDropdownRef.current &&
          !roleRef.current.contains(target) &&
          !roleDropdownRef.current.contains(target)
        ) {
          setOpenDropdown(null);
        }
      } else if (openDropdown === "experience") {
        if (
          experienceRef.current &&
          experienceDropdownRef.current &&
          !experienceRef.current.contains(target) &&
          !experienceDropdownRef.current.contains(target)
        ) {
          setOpenDropdown(null);
        }
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const roleOptions = [
    "Ментор",
    "Трекер",
    "Внешний совет директоров",
  ];
  const experienceOptions = ["1-3 года", "3-5 лет", "5-10 лет", "Больше 10 лет"];

  const handleSelectRole = (option: string) => {
    setExpertRole(option);
    setOpenDropdown(null);
  };

  const handleSelectExperience = (option: string) => {
    setExperience(option);
    setOpenDropdown(null);
  };

  const isFormValid =
    expertRole !== null && experience !== null && expertise.trim() !== "";

  const handleNext = () => {
    if (isFormValid) {
      onNext({ expertRole, experience, expertise });
    }
  };

  const formElementWrapperStyle = (name: string, type: "input" | "select"): React.CSSProperties => {
    return {
      position: "relative",
      marginTop: "32px",
    };
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "393px", height: "852px", backgroundColor: "#000", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "44px", left: "50%", transform: "translateX(-50%)", width: "284px", height: "205px", borderRadius: "284px", opacity: 0.5, background: "#59307C", filter: "blur(80px)", flexShrink: 0 }} />

        <div className="text-white text-center font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px]" style={{ position: "absolute", top: "111px", left: "50%", transform: "translateX(-50%)", width: "361px" }}>
          Быстрый профиль
        </div>

        <div className="text-center font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px]" style={{ position: "absolute", top: "144px", left: "50%", transform: "translateX(-50%)", width: "361px", color: "rgba(255, 255, 255, 0.72)" }}>
          Расскажи о себе в нескольких словах
        </div>

        <div style={{ position: "absolute", top: "217px", width: "100%", padding: "0 16px", boxSizing: "border-box" }}>
          <div ref={roleRef} style={formElementWrapperStyle("role", "select")}>
            {openDropdown === "role" && (
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)",
                  borderRadius: "8px",
                  padding: "2px",
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#1A1A1F",
                    borderRadius: "6px",
                  }}
                />
              </div>
            )}
            <div
              style={{
                display: "flex",
                padding: "8px 12px 8px 16px",
                alignItems: "center",
                gap: "8px",
                borderRadius: "8px",
                background: "rgba(79, 79, 89, 0.16)",
                justifyContent: "space-between",
                cursor: "pointer",
                position: "relative",
                zIndex: 10,
                height: "56px",
              }}
              onClick={() => setOpenDropdown(openDropdown === "role" ? null : "role")}
            >
              <span className="font-inter text-[16px] font-normal leading-[24px] tracking-[-0.128px] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: expertRole ? "#FFF" : "#A4A4B2" }}>
                {expertRole || "Кем ты хочешь быть в Коллаб"}
              </span>
              <SelectArrowIcon />
            </div>
          </div>

          <div ref={experienceRef} style={formElementWrapperStyle("experience", "select")}>
            {openDropdown === "experience" && (
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)",
                  borderRadius: "8px",
                  padding: "2px",
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#1A1A1F",
                    borderRadius: "6px",
                  }}
                />
              </div>
            )}
            <div
              style={{
                display: "flex",
                padding: "8px 12px 8px 16px",
                alignItems: "center",
                gap: "8px",
                borderRadius: "8px",
                background: "rgba(79, 79, 89, 0.16)",
                justifyContent: "space-between",
                cursor: "pointer",
                position: "relative",
                zIndex: 10,
                height: "56px",
              }}
              onClick={() => setOpenDropdown(openDropdown === "experience" ? null : "experience")}
            >
              <span className="font-inter text-[16px] font-normal leading-[24px] tracking-[-0.128px] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: experience ? "#FFF" : "#A4A4B2" }}>
                {experience || "Сколько лет опыта в этой области"}
              </span>
              <SelectArrowIcon />
            </div>
          </div>

          <div style={formElementWrapperStyle("expertise", "input")}>
            {focusedInput === "expertise" && (
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)",
                  borderRadius: "8px",
                  padding: "2px",
                  zIndex: 0,
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#1A1A1F",
                    borderRadius: "calc(8px - 2px)",
                  }}
                />
              </div>
            )}
            <div
              style={{
                display: "flex",
                padding: "8px 12px 8px 16px",
                alignItems: "center",
                gap: "8px",
                borderRadius: "8px",
                background: focusedInput === "expertise" ? "transparent" : "rgba(79, 79, 89, 0.16)",
                justifyContent: "space-between",
                position: "relative",
                zIndex: 10,
                height: "56px",
              }}
            >
              <input
                type="text"
                placeholder="В какой области твоя экспертиза?"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                onFocus={() => setFocusedInput("expertise")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  color: expertise ? "#EBEBF2" : "#A4A4B2",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.128px",
                }}
              />
            </div>
          </div>
        </div>

        {openDropdown === "role" && (
          <div ref={roleDropdownRef} style={{ position: "absolute", top: "309px", left: "16px", right: "16px", borderRadius: "8px", background: "#242426", padding: "20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px", zIndex: 10 }}>
            {roleOptions.map((option) => (
              <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="radio" name="role" value={option} checked={expertRole === option} onChange={() => handleSelectRole(option)} style={{ display: "none" }} />
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: expertRole === option ? "1.5px solid #A55AFF" : "1.5px solid #A4A4B2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {expertRole === option && (<span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#A55AFF" }} />)}
                </span>
                <span className="flex-1 text-[#EBEBF2] font-inter text-[14px] font-normal leading-[20px]">{option}</span>
              </label>
            ))}
          </div>
        )}

        {openDropdown === "experience" && (
          <div ref={experienceDropdownRef} style={{ position: "absolute", top: "396px", left: "16px", right: "16px", borderRadius: "8px", background: "#242426", padding: "20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px", zIndex: 10 }}>
            {experienceOptions.map((option) => (
              <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="radio" name="experience" value={option} checked={experience === option} onChange={() => handleSelectExperience(option)} style={{ display: "none" }} />
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: experience === option ? "1.5px solid #A55AFF" : "1.5px solid #A4A4B2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {experience === option && (<span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#A55AFF" }} />)}
                </span>
                <span className="flex-1 text-[#EBEBF2] font-inter text-[14px] font-normal leading-[20px]">{option}</span>
              </label>
            ))}
          </div>
        )}

        <div style={{ position: "absolute", bottom: "150px", left: "20px" }}>
          <button onClick={onBack} style={{ display: "flex", width: "56px", height: "56px", padding: "16px 24px", justifyContent: "center", alignItems: "center", borderRadius: "8px", background: "#242426", border: "none", cursor: "pointer" }}>
            <BackArrowIcon />
          </button>
        </div>

        <div style={{ position: "absolute", bottom: "150px", left: "93px", right: "20px" }}>
          <button onClick={handleNext} disabled={!isFormValid} style={{ display: "flex", width: "100%", padding: "16px 24px", justifyContent: "center", alignItems: "center", borderRadius: "8px", background: isFormValid ? "linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)" : "rgba(192, 192, 204, 0.16)", color: isFormValid ? "#FFF" : "#C0C0CC", textAlign: "center", fontSize: "17px", fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.204px", border: "none", cursor: isFormValid ? "pointer" : "not-allowed", transition: "background 0.3s ease-in-out, color 0.3s ease-in-out" }}>
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
