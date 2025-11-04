import React, { useEffect } from 'react';

const AdSenseLoader = () => {
  useEffect(() => {
    // Revisa si el script ya existe para no duplicarlo
    if (document.querySelector('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1046807606181255"]')) {
      return;
    }

    // Crea la etiqueta script
    const script = document.createElement('script');
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1046807606181255";
    script.async = true;
    script.crossOrigin = "anonymous";

    // Añade el script al <head> del documento
    document.head.appendChild(script);

    // Opcional: Limpia el script si el componente se desmonta
    // (Aunque para AdSense, usualmente se deja cargado)
    // return () => {
    //   document.head.removeChild(script);
    // };
  }, []); // El array vacío asegura que se ejecute solo una vez

  return null; // Este componente no renderiza nada visible
};

export default AdSenseLoader;