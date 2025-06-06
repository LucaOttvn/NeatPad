'use client';
import ResetPasswordForm from "@/components/ui/ResetPasswordForm";

export default function RecoverPasswordPage() {

    return (
        <div className="w-full h-full flex-col center gap-10">
            <div className="flex flex-col">
                <span className="title">Reset</span>
                <span className="title ms-4">**ssw*rd</span>
            </div>
            <div className="w-1/3">
                <ResetPasswordForm forgotPassword={true} />
            </div>
        </div>
    );
}