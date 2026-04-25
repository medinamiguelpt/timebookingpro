"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { X } from "lucide-react"

const STORAGE_KEY = "timebookingpro-cookie-consent"

export function CookieBanner() {
  const t = useTranslations("cookieBanner")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted")
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined")
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-5 bg-card border-t border-border shadow-2xl"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {t("message")}{" "}
              <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">
                {t("privacyPolicyLink")}
              </a>
              .
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={decline}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
              >
                {t("decline")}
              </button>
              <button
                onClick={accept}
                className="text-sm font-semibold bg-primary hover:bg-primary/90 text-white rounded-full px-5 py-2 transition-colors"
              >
                {t("acceptAll")}
              </button>
              <button
                onClick={decline}
                aria-label={t("closeAriaLabel")}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
