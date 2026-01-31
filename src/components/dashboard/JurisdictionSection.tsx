"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Jurisdiction, ComplianceStatus, JurisdictionType } from "@/types/compliance";
import { JurisdictionMap } from "./JurisdictionMap";
import { JurisdictionCard } from "./JurisdictionCard";
import { SearchFilterBar } from "./SearchFilterBar";

interface JurisdictionSectionProps {
  jurisdictions: Jurisdiction[];
  onSelectJurisdiction: (jurisdiction: Jurisdiction) => void;
}

export function JurisdictionSection({
  jurisdictions,
  onSelectJurisdiction,
}: JurisdictionSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ComplianceStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | JurisdictionType>("all");
  const [highlightedJurisdiction, setHighlightedJurisdiction] = useState<Jurisdiction | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredJurisdictions = useMemo(() => {
    return jurisdictions.filter((j) => {
      const matchesSearch =
        searchTerm === "" ||
        j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || j.status === statusFilter;
      const matchesType = typeFilter === "all" || j.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [jurisdictions, searchTerm, statusFilter, typeFilter]);

  // Handle map pin click - highlight and scroll to card
  const handleMapSelect = (jurisdiction: Jurisdiction) => {
    setHighlightedJurisdiction(jurisdiction);

    // Scroll to the card
    const cardRef = cardRefs.current[jurisdiction.id];
    if (cardRef) {
      cardRef.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Clear highlight after animation
    setTimeout(() => {
      setHighlightedJurisdiction(null);
    }, 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Jurisdictions</h3>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: Interactive Map (2 cols) */}
        <div className="xl:col-span-2">
          <JurisdictionMap
            jurisdictions={jurisdictions}
            selectedJurisdiction={highlightedJurisdiction}
            onSelectJurisdiction={handleMapSelect}
          />
        </div>

        {/* Right: Cards with Search/Filter (3 cols) */}
        <div className="xl:col-span-3">
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            resultCount={filteredJurisdictions.length}
            totalCount={jurisdictions.length}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredJurisdictions.map((jurisdiction, index) => (
              <motion.div
                key={jurisdiction.id}
                ref={(el) => {
                  cardRefs.current[jurisdiction.id] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: highlightedJurisdiction?.id === jurisdiction.id ? 1.02 : 1,
                  boxShadow: highlightedJurisdiction?.id === jurisdiction.id
                    ? "0 0 20px rgba(0, 102, 204, 0.4)"
                    : "none",
                }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="rounded-xl"
              >
                <JurisdictionCard
                  jurisdiction={jurisdiction}
                  onClick={() => onSelectJurisdiction(jurisdiction)}
                />
              </motion.div>
            ))}
          </div>

          {filteredJurisdictions.length === 0 && (
            <div className="text-center py-12 text-muted">
              <p className="text-lg mb-2">No jurisdictions found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
