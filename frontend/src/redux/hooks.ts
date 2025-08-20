import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store"; // або звідти, де ти експортуєш store

// Типізований dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;
// Типізований useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
