"use client";
import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const GeneralError = ({ error, onRetry = null }) => {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div>
      <Alert
        variant="destructive"
        className="bg-rose-300/10 w-fit mx-auto mt-3 flex flex-col items-center"
      >
        {/* <AlertCircleIcon /> */}
        <AlertTitle>
   خطایی رخ داده است
        </AlertTitle>
     
        <AlertDescription>
          {error?.message || "خطایی رخ داده است دوباره تلاش کنید"}
        </AlertDescription>
        <Button onClick={onRetry} variant="outline">
          تلاش مجدد
        </Button>
      </Alert>
    </div>
  );
};

export default GeneralError;
