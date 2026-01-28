"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { Check, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const isInfo = variant === 'info';
        
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-2.5 w-full">
              {variant === "success" && (
                <div className="mt-0.5 shrink-0 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />
                </div>
              )}
              {variant === "destructive" && (
                <div className="mt-0.5 shrink-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                  <XCircle className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </div>
              )}
              {variant === "warning" && (
                <div className="mt-0.5 shrink-0 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              )}
              {isInfo && (
                <div className="mt-0.5 shrink-0 text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {!variant || variant === "default" && (
                <div className="mt-0.5 shrink-0 text-zinc-400">
                  <Info className="h-4 w-4" />
                </div>
              )}
              
              <div className="flex flex-col gap-0.5 min-w-0">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
