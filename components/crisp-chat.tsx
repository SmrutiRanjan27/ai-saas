"use client"

import { useEffect } from "react";
import {Crisp} from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("33a9fade-a393-4435-aeb8-9ede8c51c418");
    }, [])

    return null;
}