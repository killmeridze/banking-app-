import { useEffect } from "react";

export const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Bankist | ${title}`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
