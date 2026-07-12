import { AdditionalNoteClient } from "./AdditionalNoteClient";
import AdditionalNoteSkeleton from "./skeleton";

export const AdditionalNote = Object.assign(
    function AdditionalNote({ isArabic }: { isArabic: boolean }) {
        return <AdditionalNoteClient isArabic={isArabic} />;
    },
    { skeleton: AdditionalNoteSkeleton }
);
