import { useCallback, useState } from 'react';

export const useValidateLyrics = () => {
  // STATE VARIABLES
  const [errors, setErrors] = useState<string[]>([]);

  const MAX_LINE_LENGTH = 70;

  const validateLyrics = useCallback((text: string) => {
    const lines: string[] = text.split('\n');
    const newErrors: string[] = lines.reduce<string[]>((acc, line, index) => {
      if (line.length > MAX_LINE_LENGTH) {
        acc.push(`Line ${index + 1} exceeds ${MAX_LINE_LENGTH} characters`);
      }
      return acc;
    }, []);
    setErrors(newErrors);
  }, []);

  return { errors, validateLyrics };
};
