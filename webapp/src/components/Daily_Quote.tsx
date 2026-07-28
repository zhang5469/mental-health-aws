import { quotes } from "../data/Quotes";
import type { Quote } from "../data/Quotes";

function getQuoteOfTheDay(): Quote {
    const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
    return quotes[daysSinceEpoch % quotes.length];
}

export default function DailyQuote() {
    const quote = getQuoteOfTheDay();

    return (
        <blockquote className="daily-quote">
            <p>{quote.text}</p>
            {quote.author && <cite>— {quote.author}</cite>}
        </blockquote>
    );
}



