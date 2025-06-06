'use client';
import ResetPasswordForm from "@/components/ui/ResetPasswordForm";
import { UserContext } from "@/contexts/userContext";
import { getTokenData } from "@/db/resetPasswordTokens";
import { useContext, useEffect } from "react";

export default function RecoverPasswordPage() {

    const userContext = useContext(UserContext)

    async function handleTokenValidation() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) return alert('Something went wrong')

        const tokenData = await getTokenData(token)

        userContext?.setUser(tokenData.user)
    }

    useEffect(() => {
        handleTokenValidation()
    }, []);

    return (
        <>
            {userContext!.user ? <div className="w-full h-full flex-col center gap-10">
                <div className="flex flex-col">
                    <span className="title">Reset</span>
                    <span className="title ms-4">**ssw*rd</span>
                </div>
                <div className="w-1/3">
                    <ResetPasswordForm forgotPassword={true} />
                </div>
            </div> : <>No user detected</>}
        </>
    );
}