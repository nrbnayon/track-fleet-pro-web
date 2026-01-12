"use client";

import { useUser } from "@/hooks/useUser";
import { allSellersData } from "@/data/allSellersData";
import { allParcelsData } from "@/data/allParcelsData";
import { useMemo } from "react";

export function useSellerData() {
  const { email } = useUser();

  return useMemo(() => {
    // Find seller by email
    const seller = allSellersData.find((s) => s.seller_email === email);
    
    if (!seller) {
      return {
        seller: null,
        parcels: [],
        stats: null,
      };
    }

    // Filter parcels for this seller
    // We check by seller_id, business_name, or emails to be robust with the mock data
    const parcels = allParcelsData.filter((p) => {
      const isSeller = p.sellerInfo?.id === seller.seller_id || 
                       p.sellerInfo?.name === seller.business_name;
      
      const isSender = p.senderInfo?.id === seller.seller_id || 
                       p.senderInfo?.name === seller.business_name;

      return isSeller || isSender;
    });

    return {
      seller,
      parcels,
      stats: seller.stats,
    };
  }, [email]);
}
