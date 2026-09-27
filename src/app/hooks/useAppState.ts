import { useState } from "react";
import { ViewState, UserSession } from "../routes";

export interface AppState {
  currentView: ViewState;
  selectedUserType: string;
  userSession: UserSession | null;
  selectedCaseStudyId: string;
  selectedNewsId: string;
  selectedUserTypeForDetail: string;
  selectedSolutionType: string;
}

export function useAppState() {
  const [currentView, setCurrentView] = useState<ViewState>("landing");
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string>("");
  const [selectedNewsId, setSelectedNewsId] = useState<string>("");
  const [selectedUserTypeForDetail, setSelectedUserTypeForDetail] = useState<string>("");
  const [selectedSolutionType, setSelectedSolutionType] = useState<string>("");

  return {
    // State values
    currentView,
    selectedUserType,
    userSession,
    selectedCaseStudyId,
    selectedNewsId,
    selectedUserTypeForDetail,
    selectedSolutionType,
    
    // State setters
    setCurrentView,
    setSelectedUserType,
    setUserSession,
    setSelectedCaseStudyId,
    setSelectedNewsId,
    setSelectedUserTypeForDetail,
    setSelectedSolutionType,
  };
}