export const isValidUrl = (value: string): boolean => {
    if (!value) return true;
    
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
    return urlPattern.test(value);
};