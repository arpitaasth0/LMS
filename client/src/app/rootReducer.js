import authReducer  from "../features/authSlice";
import {combineReducers} from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { purchaseApi } from "@/features/api/purchaseApi";



const rootReducer = combineReducers({
        [authApi.reducerPath]:authApi.reducer,
        [courseApi.reducerPath]:courseApi.reducer,
        [purchaseApi.reducerPath]:purchaseApi.reducer,
        [courseProgressApi.reducerPath]:courseProgressApi.reducer,
        auth:authReducer
})

export default rootReducer;