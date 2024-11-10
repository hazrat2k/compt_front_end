import { create } from "zustand";

export const useStore = create((set) => ({
    loanType: "",
    setLoanType: (newLoanType) => set({ loanType: newLoanType }),
}));

