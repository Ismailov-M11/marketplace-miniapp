import { tg } from "./webapp";

export const haptic = {
  light: () => tg?.HapticFeedback.impactOccurred("light"),
  medium: () => tg?.HapticFeedback.impactOccurred("medium"),
  heavy: () => tg?.HapticFeedback.impactOccurred("heavy"),
  success: () => tg?.HapticFeedback.notificationOccurred("success"),
  error: () => tg?.HapticFeedback.notificationOccurred("error"),
  warning: () => tg?.HapticFeedback.notificationOccurred("warning"),
  selection: () => tg?.HapticFeedback.selectionChanged(),
};
