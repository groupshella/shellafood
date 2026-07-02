// features/payment/components/sections/MyFatoorahPayment/SavedCardsList.tsx
import { CreditCard, Plus } from "lucide-react";
import type { SavedCard } from "@/features/payment/types/payment.types";

interface SavedCardsListProps {
    cards: SavedCard[];
    selectedToken: string | null; // null means "new card" is selected
    onSelect: (token: string | null) => void;
}

interface SavedCardItemProps {
    card: SavedCard;
    selected: boolean;
    onSelect: () => void;
}

function SavedCardItem({ card, selected, onSelect }: SavedCardItemProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex min-w-[160px] shrink-0 flex-col gap-2 rounded-xl border p-3 text-right transition-all ${
                selected ? "border-[#30913F] bg-[#EBFEEB]" : "border-gray-200 bg-white"
            }`}
        >
            <CreditCard
                className={`h-5 w-5 ${selected ? "text-[#30913F]" : "text-gray-400"}`}
                strokeWidth={1.8}
            />
            <span className="text-[13px] font-semibold text-gray-900">{card.brand}</span>
            {/* Masked card number only — full PAN never reaches our frontend or backend */}
            <span dir="ltr" className="text-left text-[13px] text-gray-600">
                {card.maskedCard}
            </span>
        </button>
    );
}

function AddNewCardItem({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex min-w-[110px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all ${
                selected ? "border-[#30913F] bg-[#EBFEEB]" : "border-dashed border-gray-300 bg-white"
            }`}
        >
            <Plus className={`h-5 w-5 ${selected ? "text-[#30913F]" : "text-gray-400"}`} strokeWidth={2} />
            <span
                className={`text-center text-[12px] font-medium ${
                    selected ? "text-[#30913F]" : "text-gray-700"
                }`}
            >
                بطاقة جديدة
            </span>
        </button>
    );
}

export function SavedCardsList({ cards, selectedToken, onSelect }: SavedCardsListProps) {
    if (cards.length === 0) return null;

    return (
        <div className="mb-4">
            <h3 className="mb-2 text-[14px] font-bold text-gray-900">البطاقات المحفوظة</h3>
            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                {cards.map((card) => (
                    <SavedCardItem
                        key={card.token}
                        card={card}
                        selected={selectedToken === card.token}
                        onSelect={() => onSelect(card.token)}
                    />
                ))}
                <AddNewCardItem selected={selectedToken === null} onSelect={() => onSelect(null)} />
            </div>
        </div>
    );
}
