import { useMemo, useState } from "react";
import "./Glossary.css";

import { glossary, type GlossaryItem } from "../data/Glossarry";

function Glossary() {
    const [search, setSearch] = useState("");

    // Filter based on the search text
    const filtered = useMemo(() => {
        return glossary.filter(item =>
            item.term.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    // Group by first letter
    const grouped = useMemo(() => {
        const groups: Record<string, GlossaryItem[]> = {};

        filtered.forEach(item => {
            const letter = item.term.charAt(0).toUpperCase();

            if (!groups[letter]) {
                groups[letter] = [];
            }

            groups[letter].push(item);
        });

        return groups;
    }, [filtered]);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <div className="glossary">

            <h2>Glossary</h2>

            <input
                className="glossary-search"
                type="text"
                placeholder="Search glossary..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="alphabet">
                {alphabet.map(letter => (
                    <a
                        key={letter}
                        href={`#${letter}`}
                        className={grouped[letter] ? "active" : ""}
                    >
                        {letter}
                    </a>
                ))}
            </div>

            {Object.keys(grouped)
                .sort()
                .map(letter => (
                    <div
                        key={letter}
                        id={letter}
                        className="section"
                    >
                        <h3>{letter}</h3>

                        {grouped[letter].map(item => (
                            <div
                            key={item.term}
                            className="term"
                            >
                            <strong>{item.term}</strong>

                            <p>
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glossary-link"
                                >
                                    {item.description}
                                </a>
                            </p>
                        </div>
                    ))}
                    </div>
                ))}

        </div>
    );
}

export default Glossary;