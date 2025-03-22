import { useEffect } from "react";

export const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `Food Delivery | ${title}`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
