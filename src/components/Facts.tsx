interface FactsProps {
  facts: string | string[] | undefined;
}

export function Facts({ facts }: FactsProps) {
  if (!facts) return null;
  
  if (typeof facts === 'string') {
    return (
      <div className="mb-4">
        <div 
          className="primary-text"
          dangerouslySetInnerHTML={{ __html: facts }}
        />
      </div>
    );
  }
  
  return (
    <div className="mb-4">
      <ul className="list-disc list-inside primary-text">
        {facts.map((fact, index) => (
          <li key={index}>{fact}</li>
        ))}
      </ul>
    </div>
  );
} 