'use client';
import ResetPasswordForm from "@/components/ui/ResetPasswordForm";
import { useEffect, useState } from "react";

// this is the page that gets reached by the reset password email link that the user receives whenever it clicks on forgot password button
export default function RecoverPasswordPage() {

    const [token, setToken] = useState<string | undefined>()

    // get the token from the url and pass it to the reset password form as a prop
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token')
        if (token) setToken(token)
    }, []);

    return (
        <div className="w-full h-full flex-col center gap-10">
            <div className="flex flex-col">
                <span className="title">Reset</span>
                <span className="title ms-4">**ssw*rd</span>
            </div>
            <div className="w-full px-10" style={{maxWidth: 500}}>
                {/* {token ? <ResetPasswordForm forgotPassword={true} token={token} /> : <span className="w-full center">No user available</span>} */}
                <ResetPasswordForm forgotPassword={true} token={token} />
            </div>
        </div>
    );
}