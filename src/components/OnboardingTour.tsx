import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingStep } from "@/hooks/useOnboarding";

interface OnboardingTourProps {
  isActive: boolean;
  currentStep: OnboardingStep;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export const OnboardingTour = ({
  isActive,
  currentStep,
  stepNumber,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
}: OnboardingTourProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      if (currentStep.targetSelector) {
        const element = document.querySelector(currentStep.targetSelector);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);

          let top = 0;
          let left = 0;

          switch (currentStep.position) {
            case "bottom":
              top = rect.bottom + 12;
              left = rect.left + rect.width / 2;
              break;
            case "top":
              top = rect.top - 12;
              left = rect.left + rect.width / 2;
              break;
            case "left":
              top = rect.top + rect.height / 2;
              left = rect.left - 12;
              break;
            case "right":
              top = rect.top + rect.height / 2;
              left = rect.right + 12;
              break;
          }

          setPosition({ top, left });
        }
      } else {
        setTargetRect(null);
        setPosition({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isActive, currentStep]);

  if (!isActive) return null;

  const isCenter = currentStep.position === "center" || !currentStep.targetSelector;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" />

      {/* Spotlight for targeted elements */}
      {targetRect && (
        <div
          className="fixed z-[101] rounded-lg ring-4 ring-primary/50 ring-offset-2 ring-offset-background"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      {/* Tour card */}
      <div
        className={`fixed z-[102] w-80 glass rounded-xl p-4 shadow-2xl glow ${
          isCenter ? "-translate-x-1/2 -translate-y-1/2" : ""
        } ${
          currentStep.position === "bottom" ? "-translate-x-1/2" : ""
        } ${
          currentStep.position === "top" ? "-translate-x-1/2 -translate-y-full" : ""
        } ${
          currentStep.position === "left" ? "-translate-x-full -translate-y-1/2" : ""
        } ${
          currentStep.position === "right" ? "-translate-y-1/2" : ""
        }`}
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{currentStep.title}</h3>
              <p className="text-[10px] text-muted-foreground">
                Step {stepNumber + 1} of {totalSteps}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkip}
            className="h-6 w-6 -mt-1 -mr-1"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${((stepNumber + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="h-8 text-xs text-muted-foreground"
          >
            Skip tour
          </Button>

          <div className="flex items-center gap-2">
            {stepNumber > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrev}
                className="h-8 text-xs gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={onNext}
              className="h-8 text-xs gap-1"
            >
              {stepNumber === totalSteps - 1 ? "Finish" : "Next"}
              {stepNumber < totalSteps - 1 && <ChevronRight className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
