// Versao temporaria com debug logs
import { useState, useEffect } from "react";

export const usePartesDebug = (selectedSheet: any) => {
  const [partes, setPartes] = useState<any[]>([]);
  const [loadingPartes, setLoadingPartes] = useState(false);

  useEffect(() => {
    console.log("[DEBUG] useEffect triggered, selectedSheet:", selectedSheet?.id);
    
    if (!selectedSheet) {
      console.log("[DEBUG] No selectedSheet, returning early");
      return;
    }

    let cancelled = false;

    const fetchPartes = async () => {
      console.log("[DEBUG] Starting fetchPartes, setting loadingPartes to true");
      setLoadingPartes(true);
      
      try {
        console.log("[DEBUG] Calling API.getPartesPartitura with id:", selectedSheet.id);
        const response = await fetch(`/api/partituras/${selectedSheet.id}/partes`);
        
        console.log("[DEBUG] Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log("[DEBUG] Data received:", data);
        
        if (!cancelled) {
          console.log("[DEBUG] Setting partes:", data?.length || 0, "items");
          setPartes(data || []);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("[DEBUG] Error fetching partes:", e);
          setPartes([]);
        }
      } finally {
        if (!cancelled) {
          console.log("[DEBUG] Setting loadingPartes to false");
          setLoadingPartes(false);
        }
      }
    };

    fetchPartes();

    return () => {
      console.log("[DEBUG] Cleanup - setting cancelled to true");
      cancelled = true;
    };
  }, [selectedSheet]);

  console.log("[DEBUG] Current state - partes:", partes.length, "loadingPartes:", loadingPartes);

  return { partes, loadingPartes };
};
