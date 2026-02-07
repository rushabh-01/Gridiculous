import { useState, useEffect } from "react";

const ONBOARDING_KEY = "multiapp-onboarding-completed";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position: "top" | "bottom" | "left" | "right" | "center";
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to MultiApp Workspace! 🎉",
    description: "A powerful workspace where you can view multiple apps, websites, and files side by side. Let's take a quick tour!",
    position: "center",
  },
  {
    id: "layouts",
    title: "Manage Layouts",
    description: "Create and switch between different workspace layouts. Choose from presets or create your own custom grid with any number of panels.",
    targetSelector: "[data-tour='layouts-btn']",
    position: "bottom",
  },
  {
    id: "add-app",
    title: "Add Apps & Files",
    description: "Add web apps by URL or upload local files like PDFs, images, and videos. You can also drag & drop files directly onto empty panels!",
    targetSelector: "[data-tour='add-btn']",
    position: "bottom",
  },
  {
    id: "panels",
    title: "Panel Controls",
    description: "Each panel has controls for view modes (responsive, tablet, desktop), zoom, fullscreen, notes, and refresh. Drag panels to reorder them!",
    position: "center",
  },
  {
    id: "shortcuts",
    title: "Keyboard Shortcuts",
    description: "Use ⌘L for layouts, ⌘K to add items, ⌘B to toggle navbar, and ⌘Z/⌘⇧Z for undo/redo.",
    targetSelector: "[data-tour='shortcuts-btn']",
    position: "bottom",
  },
  {
    id: "share",
    title: "Share Your Layout",
    description: "Share your workspace setup with others via a unique URL. All panel configurations are preserved!",
    position: "center",
  },
];

export const useOnboarding = () => {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setHasCompletedOnboarding(false);
      // Auto-start onboarding for new users after a short delay
      setTimeout(() => setIsOnboardingActive(true), 500);
    }
  }, []);

  const startOnboarding = () => {
    setCurrentStep(0);
    setIsOnboardingActive(true);
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    setIsOnboardingActive(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setHasCompletedOnboarding(false);
  };

  return {
    isOnboardingActive,
    currentStep,
    currentStepData: ONBOARDING_STEPS[currentStep],
    totalSteps: ONBOARDING_STEPS.length,
    hasCompletedOnboarding,
    startOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    resetOnboarding,
  };
};
