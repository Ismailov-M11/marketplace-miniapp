import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tg } from "./webapp";

export function useBackButton(onBack?: () => void) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!tg) return;
    const handler = onBack ?? (() => navigate(-1));
    tg.BackButton.show();
    tg.BackButton.onClick(handler);
    return () => {
      tg.BackButton.offClick(handler);
      tg.BackButton.hide();
    };
  }, [onBack, navigate]);
}
