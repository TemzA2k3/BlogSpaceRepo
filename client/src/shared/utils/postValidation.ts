export const isValidPost = (content: string, image: File | null, hashtags: string[]) => {
    const hasText = content.trim().length > 0;
    const hasImage = !!image;
    const hasHashtags = hashtags.length > 0;
  
    return hasText || hasImage || hasHashtags;
  };
  