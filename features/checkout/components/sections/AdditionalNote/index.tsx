import { AdditionalNoteClient } from "./AdditionalNoteClient";
import AdditionalNoteSkeleton from "./skeleton";

export const AdditionalNote = Object.assign(
    function AdditionalNote() {
        return <AdditionalNoteClient />;
    },
    { skeleton: AdditionalNoteSkeleton }
);
