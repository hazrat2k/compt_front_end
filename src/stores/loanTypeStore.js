import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLoanTypeStore = create(
    persist(
        (set) => ({
            loanType: "",
            setLoanType: (value) => {
                set({
                    loanType: value,
                });
            },
            resetLoanType: () => {
                set({
                    loanType: "",
                });
            },
        }),
        {
            name: "loan-type-store", // Name of the key in localStorage
        }
    )
);

export default useLoanTypeStore;
