"use client";

import { Jurisdiction } from "@/types/compliance";
import { JurisdictionCard } from "./JurisdictionCard";

interface JurisdictionGridProps {
  jurisdictions: Jurisdiction[];
  onSelectJurisdiction: (jurisdiction: Jurisdiction) => void;
}

export function JurisdictionGrid({ jurisdictions, onSelectJurisdiction }: JurisdictionGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Jurisdictions</h3>
        <span className="text-sm text-muted">{jurisdictions.length} active</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jurisdictions.map((jurisdiction) => (
          <JurisdictionCard
            key={jurisdiction.id}
            jurisdiction={jurisdiction}
            onClick={() => onSelectJurisdiction(jurisdiction)}
          />
        ))}
      </div>
    </div>
  );
}
