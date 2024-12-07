import { create } from "zustand";
import { persist } from "zustand/middleware";

const loanTypeStore = (set) => ({
    loanType: "",
    setLoanType: (value) => {
        set(() => ({
            loanType: value,
        }));
    },
    reset: () => {
        set({
            loanType: "",
        });
    },
});

const useLoanTypeStore = create(persist(loanTypeStore));

export default useLoanTypeStore;
