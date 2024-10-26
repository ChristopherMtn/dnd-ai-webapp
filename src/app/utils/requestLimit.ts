import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const useAPIRequestLimiter = () => {
  const { data: session } = useSession();
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!session) return;

    const currentDate = new Date().toISOString().split("T")[0];
    const storedDate = localStorage.getItem("apiRequestDate");
    const storedCount = localStorage.getItem("apiRequestCount");

    if (storedDate !== currentDate) {
      // it is a new day, reset request count
      localStorage.setItem("apiRequestDate", currentDate);
      localStorage.setItem("apiRequestCount", "0");
      setRequestCount(0);
    } else {
      // Load count from storage
      if (storedCount) {
        setRequestCount(parseInt(storedCount, 10));
      } else {
        localStorage.setItem("apiRequestCount", "0");
        setRequestCount(0);
      }
    }
  }, [session]);

  const canMakeRequest = (): boolean => {
    return (
      requestCount <
      parseInt(process.env.NEXT_PUBLIC_MAX_GENERATION_REQUESTS as string, 10)
    );
  };

  const incrementRequestCount = () => {
    const newCount = requestCount + 1;
    setRequestCount(newCount);
    localStorage.setItem("apiRequestCount", newCount.toString());
  };

  return { canMakeRequest, incrementRequestCount };
};
