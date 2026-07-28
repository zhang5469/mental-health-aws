/* ──────────────────────────────────────────────
   CrisisSupport.tsx — Crisis Support Tab
   This page will provide emergency mental health
   resources, hotlines, and immediate support options.
   Coming soon.
────────────────────────────────────────────── */
import Glossary from "../components/Glossary";
import CrisisPopup from "../components/CrisisPopup";

function CrisisSupport() {
    return (
        <>
    
            <CrisisPopup/>
            
            <section className="CrisisSupport">

                <h1 className="coming-soon-heading">Crisis Support</h1>

                <Glossary />

            </section>
        </>
    );
}

export default CrisisSupport
