export const formatPhoneNumber = (input: string): string => {
    const cleaned = input.replace(/\D/g, "");
  
    if (cleaned.length === 0) {
      return "+380";
    }
  
    const digits = cleaned.startsWith("380") ? cleaned.slice(3) : cleaned;
    let formatted = "+380";
  
    if (digits.length >= 1) formatted += ` (${digits.slice(0, 2)}`;
    if (digits.length >= 3) formatted += `) ${digits.slice(2, 5)}`;
    if (digits.length >= 6) formatted += `-${digits.slice(5, 7)}`;
    if (digits.length >= 8) formatted += `-${digits.slice(7, 9)}`;
  
    return formatted;
  };