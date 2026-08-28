"use client"
import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
const UserDialog = ({user}) => {
     const [open, setOpen] = useState(false);
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button  >
                        <Eye />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            اطلاعات کاربر {user.name}
                        </DialogTitle>
                    
                     
                    </DialogHeader>
                   ایمیل : 
                   {user.email}
                   
                    <DialogFooter>
                        <Button type="submit">Continue</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserDialog;