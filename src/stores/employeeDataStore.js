import { create } from "zustand";
import { persist } from "zustand/middleware";

const useEmployeeDataStore = create(
    persist(
        (set) => ({
            employeeData: {},
            setEmployeeData: (value) => {
                set({
                    employeeData: value,
                });
            },
            resetEmployeeData: () => {
                set({
                    employeeData: {},
                });
            },
            // resetEmployeeData: (timeout) => {
            //     setTimeout(() => {
            //         set({
            //             employeeData: {},
            //         });
            //     }, timeout);
            // },
        }),
        {
            name: "employee-data-store", // Name of the key in localStorage
        }
    )
);

export default useEmployeeDataStore;
