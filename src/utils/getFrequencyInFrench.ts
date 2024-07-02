import { AutomateType } from "@/types";

export default function getFrequencyInFrench(automateType: AutomateType): string {
    switch (automateType) {
        case "3-day":
            return "3 jours";
        case "1-week":
            return "1 semaine";
        case "1-month":
            return "1 mois";
        case "3-month":
            return "3 mois";
        default:
            return "Fréquence inconnue";
    }
}