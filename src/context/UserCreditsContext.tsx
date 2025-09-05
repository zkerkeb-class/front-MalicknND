"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { paymentService } from "@/services/paymentService";
import { useUser } from "@clerk/nextjs";

// Context type for the user credits
type UserCreditsContextType = {
  credits: number;
  refreshCredits: () => Promise<void>;
};

const UserCreditsContext = createContext<UserCreditsContextType>({
  credits: 0,
  refreshCredits: async () => {},
});

export const useUserCredits = () => useContext(UserCreditsContext);

export const UserCreditsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [credits, setCredits] = useState(0);

  const refreshCredits = useCallback(async () => {
    if (user?.id) {
      try {
        const data = await paymentService.getUserCredits(user.id);
        setCredits(data.credits);
      } catch {
        setCredits(0);
      }
    }
  }, [user?.id]);

  React.useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  return (
    <UserCreditsContext.Provider value={{ credits, refreshCredits }}>
      {children}
    </UserCreditsContext.Provider>
  );
};
