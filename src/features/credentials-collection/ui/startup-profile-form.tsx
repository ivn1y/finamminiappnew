"use client";

import React, { useState } from "react";

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

export interface StartupProfileFormProps {
  onBack: () => void;
  onNext: (data: any) => void;
}

export function StartupProfileForm({ onBack, onNext }: StartupProfileFormProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [productDescription, setProductDescription] = useState("");
  const [projectStage, setProjectStage] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const stageOptions = ["Идея", "MVP", "Рост", "Масштабирование"];
  const industryOptions = [
    "FinTech",
    "EdTech",
    "HealthTech",
    "E-commerce",
    "SaaS",
    "Другое",
  ];

  const handleSelectStage = (option: string) => {
    setProjectStage(option);
    setOpenDropdown(null);
  };

  const handleSelectIndustry = (option: string) => {
    setIndustry(option);
    setOpenDropdown(null);
  };

  const isFormValid =
    productDescription.trim() !== "" && projectStage !== null && industry !== null;

  const handleNext = () => {
    if (isFormValid) {
      onNext({ productDescription, projectStage, industry });
    }
  };

  const formElementStyle = (name: string, type: "input" | "select") => {
    const isFocused =
      (type === "input" && focusedInput === name) ||
      (type === "select" && openDropdown === name);

    return {
      display: "flex",
      padding: "8px 12px 8px 16px",
      alignItems: "center",
      gap: "8px",
      alignSelf: "stretch",
      borderRadius: "8px",
      background: "rgba(79, 79, 89, 0.16)",
      justifyContent: "space-between",
      cursor: type === "select" ? "pointer" : "text",
      border: isFocused
        ? "1px solid var(--Marketing-Gradient-Border-01, #A55AFF)"
        : "1px solid transparent",
      transition: "border 0.2s ease-in-out",
      marginTop: "32px",
    };
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "393px", height: "852px", backgroundColor: "#000", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "104px", left: "50%", transform: "translateX(-50%)", width: "284px", height: "205px", borderRadius: "284px", opacity: 0.5, background: "#59307C", filter: "blur(80px)", flexShrink: 0 }} />

        <div style={{ position: "absolute", top: "171px", left: "50%", transform: "translateX(-50%)", width: "361px", color: "#FFF", textAlign: "center", fontFamily: '"Inter Tight", sans-serif', fontSize: "30px", fontStyle: "normal", fontWeight: 400, lineHeight: "110%", letterSpacing: "-0.6px" }}>
          Быстрый профиль
        </div>

        <div style={{ position: "absolute", top: "204px", left: "50%", transform: "translateX(-50%)", width: "361px", color: "rgba(255, 255, 255, 0.72)", textAlign: "center", fontSize: "17px", fontStyle: "normal", fontWeight: 400, lineHeight: "24px", letterSpacing: "-0.17px" }}>
          Расскажи о себе в нескольких словах
        </div>

        <div style={{ position: "absolute", top: "277px", width: "100%", padding: "0 16px", boxSizing: "border-box" }}>
          <div style={formElementStyle("description", "input")}>
            <input
              type="text"
              placeholder="Опиши свой продукт в трех словах"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              onFocus={() => setFocusedInput("description")}
              onBlur={() => setFocusedInput(null)}
              style={{
                color: productDescription ? "#FFF" : "#A4A4B2",
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                fontFamily: "Inter",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "-0.128px",
              }}
            />
          </div>

          <div style={formElementStyle("stage", "select")} onClick={() => setOpenDropdown(openDropdown === "stage" ? null : "stage")}>
            <span style={{ color: projectStage ? "#FFF" : "#A4A4B2", fontSize: "16px", fontFamily: "Inter", ...{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }}>
              {projectStage || "На какой стадии твой проект"}
            </span>
            <SelectArrowIcon />
          </div>

          <div style={formElementStyle("industry", "select")} onClick={() => setOpenDropdown(openDropdown === "industry" ? null : "industry")}>
            <span style={{ color: industry ? "#FFF" : "#A4A4B2", fontSize: "16px", fontFamily: "Inter", ...{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }}>
              {industry || "Сфера деятельности"}
            </span>
            <SelectArrowIcon />
          </div>
        </div>

        {openDropdown === "stage" && (
          <div style={{ position: "absolute", top: "443px", left: "20px", right: "20px", borderRadius: "8px", background: "#242426", padding: "20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px", zIndex: 10 }}>
            {stageOptions.map((option) => (
              <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="radio" name="stage" value={option} checked={projectStage === option} onChange={() => handleSelectStage(option)} style={{ display: "none" }} />
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: projectStage === option ? "1.5px solid #A55AFF" : "1.5px solid #A4A4B2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {projectStage === option && (<span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#A55AFF" }} />)}
                </span>
                <span style={{ flex: "1 0 0", color: "#EBEBF2", fontFamily: "Inter", fontSize: "14px", fontWeight: 400, lineHeight: "20px" }}>{option}</span>
              </label>
            ))}
          </div>
        )}

        {openDropdown === "industry" && (
          <div style={{ position: "absolute", top: "515px", left: "20px", right: "20px", borderRadius: "8px", background: "#242426", padding: "20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px", zIndex: 10 }}>
            {industryOptions.map((option) => (
              <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="radio" name="industry" value={option} checked={industry === option} onChange={() => handleSelectIndustry(option)} style={{ display: "none" }} />
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: industry === option ? "1.5px solid #A55AFF" : "1.5px solid #A4A4B2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {industry === option && (<span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#A55AFF" }} />)}
                </span>
                <span style={{ flex: "1 0 0", color: "#EBEBF2", fontFamily: "Inter", fontSize: "14px", fontWeight: 400, lineHeight: "20px" }}>{option}</span>
              </label>
            ))}
          </div>
        )}

        <div style={{ position: "absolute", bottom: "90px", left: "20px" }}>
          <button onClick={onBack} style={{ display: "flex", width: "56px", height: "56px", padding: "16px 24px", justifyContent: "center", alignItems: "center", borderRadius: "8px", background: "#242426", border: "none", cursor: "pointer" }}>
            <BackArrowIcon />
          </button>
        </div>

        <div style={{ position: "absolute", bottom: "90px", left: "93px", right: "20px" }}>
          <button onClick={handleNext} disabled={!isFormValid} style={{ display: "flex", width: "100%", padding: "16px 24px", justifyContent: "center", alignItems: "center", borderRadius: "8px", background: isFormValid ? "linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)" : "rgba(192, 192, 204, 0.16)", color: isFormValid ? "#FFF" : "#C0C0CC", textAlign: "center", fontSize: "17px", fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.204px", border: "none", cursor: isFormValid ? "pointer" : "not-allowed", transition: "background 0.3s ease-in-out, color 0.3s ease-in-out" }}>
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
