"use client"
import GeneralError from "@/components/GeneralError";

const error = ({error,reset}) => {
    return (
       <GeneralError error={error} onRetry={reset} />
    );
};

export default error;