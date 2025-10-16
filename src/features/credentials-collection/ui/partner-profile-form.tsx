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

export interface PartnerProfileFormProps {
  onBack: () => void;
  onNext: (data: any) => void;
}

export function PartnerProfileForm({ onBack, onNext }: PartnerProfileFormProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [partnerPackage, setPartnerPackage] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [productServiceDescription, setProductServiceDescription] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const packageOptions = ["Франшиза", "White-label", "API-интеграция"];
  const industryOptions = ["FinTech", "Банкинг", "Инвестиции", "Консалтинг", "Технологии", "Другое"];

  const handleSelectPackage = (option: string) => {
    setPartnerPackage(option);
    setOpenDropdown(null);
  };

  const handleSelectIndustry = (option: string) => {
    setCompanyIndustry(option);
    setOpenDropdown(null);
  };

  const isFormValid =
    partnerPackage !== null &&
    companyName.trim() !== "" &&
    productServiceDescription.trim() !== "" &&
    companyIndustry !== null;

  const handleNext = () => {
    if (isFormValid) {
      onNext({ partnerPackage, companyName, productServiceDescription, companyIndustry });
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

        <div className="text-white text-center font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px]" style={{ position: "absolute", top: "171px", left: "50%", transform: "translateX(-50%)", width: "361px" }}>
          Быстрый профиль
        </div>

        <div className="text-center font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px]" style={{ position: "absolute", top: "204px", left: "50%", transform: "translateX(-50%)", width: "361px", color: "rgba(255, 255, 255, 0.72)" }}>
          Расскажи о себе в нескольких словах
        </div>

        <div style={{ position: "absolute", top: "277px", width: "100%", padding: "0 16px", boxSizing: "border-box" }}>
          <div style={formElementStyle("package", "select")} onClick={() => setOpenDropdown(openDropdown === "package" ? null : "package")}>
            <span className="font-inter text-[16px] font-normal leading-[24px] tracking-[-0.128px]" style={{ color: partnerPackage ? "#FFF" : "#A4A4B2" }}>
              {partnerPackage || "Что тебя интересует"}
            </span>
            <SelectArrowIcon />
          </div>

          <div style={formElementStyle("companyName", "input")}>
            <input type="text" placeholder="Название компании" value={companyName} onChange={(e) => setCompanyName(e.target.value)} onFocus={() => setFocusedInput("companyName")} onBlur={() => setFocusedInput(null)} className="font-inter text-[16px] font-normal leading-[24px] tracking-[-0.128px]" style={{ color: companyName ? "#FFF" : "#A4A4B2", background: "transparent", border: "none", outline: "none", width: "100%" }}/>
          </div>

          <div style={formElementStyle("description", "input")}>
            <input type="text" placeholder="Опиши свой продукт/услугу" value={productServiceDescription} onChange={(e) => setProductServiceDescription(e.target.value)} onFocus={() => setFocusedInput("description")} onBlur={() => setFocusedInput(null)} className="font-inter text-[16px] font-normal leading-[24px] tracking-[-0.128px]" style={{ color: productServiceDescription ? "#FFF" : "#A4A4B2", background: "transparent", border: "none", outline: "none", width: "100%" }}/>
          </div>

          <div style={formElementStyle("industry", "select")} onClick={() => setOpenDropdown(openDropdown === "industry" ? null : "industry")}>
            <span className="font-inter text-[16px] font-normal leading-[24px] tracking-[-0.128px]" style={{ color: companyIndustry ? "#FFF" : "#A4A4B2" }}>
              {companyIndustry || "Сфера деятельности компании"}
            </span>
            <SelectArrowIcon />
          </div>
        </div>
        
        {openDropdown === "package" && (
            <div style={{ position: "absolute", top: "371px", left: "20px", right: "20px", borderRadius: "8px", background: "#242426", padding: "20px", zIndex: 10, display: "flex", flexDirection: "column", gap: "20px" }}>
                {packageOptions.map(option => (
                    <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                        <input type="radio" name="package" value={option} checked={partnerPackage === option} onChange={() => handleSelectPackage(option)} style={{ display: "none" }} />
                        <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: partnerPackage === option ? "1.5px solid #A55AFF" : "1.5px solid #A4A4B2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {partnerPackage === option && <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#A55AFF" }} />}
                        </span>
                        <span className="font-inter text-[14px] font-normal leading-[20px] tracking-[-0.056px]" style={{ color: "#EBEBF2" }}>{option}</span>
                    </label>
                ))}
            </div>
        )}

        {openDropdown === "industry" && (
            <div style={{ position: "absolute", top: "599px", left: "20px", right: "20px", borderRadius: "8px", background: "#242426", padding: "20px", zIndex: 10, display: "flex", flexDirection: "column", gap: "20px" }}>
                {industryOptions.map(option => (
                    <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                        <input type="radio" name="industry" value={option} checked={companyIndustry === option} onChange={() => handleSelectIndustry(option)} style={{ display: "none" }} />
                        <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: companyIndustry === option ? "1.5px solid #A55AFF" : "1.5px solid #A4A4B2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {companyIndustry === option && <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#A55AFF" }} />}
                        </span>
                        <span className="font-inter text-[14px] font-normal leading-[20px] tracking-[-0.056px]" style={{ color: "#EBEBF2" }}>{option}</span>
                    </label>
                ))}
            </div>
        )}

        <div style={{ position: "absolute", bottom: "90px", left: "20px" }}>
            <button onClick={onBack} style={{ display: "flex", width: "56px", height: "56px", justifyContent: "center", alignItems: "center", borderRadius: "8px", background: "#242426", border: "none", cursor: "pointer", padding: "16px 24px" }}><BackArrowIcon /></button>
        </div>
        <div style={{ position: "absolute", bottom: "90px", left: "93px", right: "20px" }}>
            <button onClick={handleNext} disabled={!isFormValid} style={{ display: "flex", width: "100%", padding: "16px 24px", justifyContent: "center", alignItems: "center", borderRadius: "8px", background: isFormValid ? "linear-gradient(305deg, #FEDA3B, #EF5541, #801FDB, #7E2A89)" : "rgba(192, 192, 204, 0.16)", color: isFormValid ? "#FFF" : "#C0C0CC", border: "none", cursor: isFormValid ? "pointer" : "not-allowed", fontSize: "17px", fontWeight: 600, transition: "background 0.3s ease" }}>Готово</button>
        </div>
      </div>
    </div>
  );
}
