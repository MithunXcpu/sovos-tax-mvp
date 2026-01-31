"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Jurisdiction, ComplianceStatus, JurisdictionType } from "@/types/compliance";
import { JurisdictionCard } from "./JurisdictionCard";
import { SearchFilterBar } from "./SearchFilterBar";

interface JurisdictionGridProps {
  jurisdictions: Jurisdiction[];
  onSelectJurisdiction: (jurisdiction: Jurisdiction) => void;
}

export function JurisdictionGrid({ jurisdictions, onSelectJurisdiction }: JurisdictionGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ComplianceStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | JurisdictionType>("all");

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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Jurisdictions</h3>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJurisdictions.map((jurisdiction, index) => (
          <motion.div
            key={jurisdiction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
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
  );
}
