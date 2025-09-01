import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // @ts-ignore
    deferredPrompt.prompt();
    // @ts-ignore
    const result = await deferredPrompt.userChoice;
    console.log("Usuari ha triat:", result.outcome);
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* 🔹 Botó d’instal·lació personalitzat */}
        {showInstallPrompt && (
          <button
            onClick={handleInstallClick}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              padding: "12px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              cursor: "pointer",
              zIndex: 9999,
            }}
          >
            📲 Instal·la l’aplicació
          </button>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
