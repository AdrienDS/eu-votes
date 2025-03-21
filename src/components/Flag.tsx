import Image from 'next/image';
import { MEP_CARD } from '@/constants/styles';

interface FlagProps {
  countryCode: string;
  alt?: string;
  className?: string;
}

export function Flag({ countryCode, alt, className = "w-6 h-4" }: FlagProps) {
  return (
    <div className={`relative bg-gray-200 rounded-xs overflow-hidden ${className}`}>
      <Image
        src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
        alt={alt || `${countryCode} flag`}
        fill
        className="object-cover"
        sizes={MEP_CARD.FLAG_WIDTH}
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
} 