import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, RootState, AppStore } from "./Store";

// Used in app code instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useRootSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
