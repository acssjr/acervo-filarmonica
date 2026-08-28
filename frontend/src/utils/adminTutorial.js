export const shouldWaitForAdminTutorial = ({
  tutoriaisAtivos,
  tutorialCompleted,
  isMobile
}) => tutoriaisAtivos && !tutorialCompleted && !isMobile;

export const canExecutePendingAdminAction = ({
  loading,
  tutoriaisAtivos,
  tutorialCompleted,
  tutorialClosedThisSession
}) => !loading && (
  !tutoriaisAtivos ||
  tutorialCompleted ||
  tutorialClosedThisSession
);
