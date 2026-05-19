import { useEffect } from "react";
import { tg } from "./webapp";

export function useMainButton(text: string, onClick: () => void, active = true) {
  useEffect(() => {
    if (!tg) return;
    const btn = tg.MainButton;
    btn.setText(text);
    if (active) {
      btn.enable();
    } else {
      btn.disable();
    }
    btn.show();
    btn.onClick(onClick);
    return () => {
      btn.offClick(onClick);
      btn.hide();
    };
  }, [text, onClick, active]);
}

export function useMainButtonProgress(loading: boolean) {
  useEffect(() => {
    if (!tg) return;
    const btn = tg.MainButton;
    if (loading) {
      btn.showProgress();
      btn.disable();
    } else {
      btn.hideProgress();
      btn.enable();
    }
  }, [loading]);
}
