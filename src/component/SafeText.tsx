import React from "react";
import DOMPurify from "dompurify";

type SafeTextProps = {
  text: string;
  className?: string;
};

/**
 * Composant utilitaire pour afficher un texte potentiellement fourni
 * par l'utilisateur en neutralisant les attaques XSS.
 */
const SafeText: React.FC<SafeTextProps> = ({ text, className }) => {
  const safeHtml = DOMPurify.sanitize(text);
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

export default SafeText;
