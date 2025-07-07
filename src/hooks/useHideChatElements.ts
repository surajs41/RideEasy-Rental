import { useEffect } from 'react';

/**
 * Custom hook to hide chat elements (sliding contact buttons, chatbots, etc.) 
 * when used in admin pages and restore them when the component unmounts
 */
export const useHideChatElements = () => {
  useEffect(() => {
    // Elements to hide
    const elementsToHide = [
      '.slide-contact-buttons',
      '#tidio-chat',
      '#chatbot-btn',
      '[data-gpt-engine]',
      '.gpt-engine',
      '[class*="gpt"]',
      '[data-lyro]',
      '.lyro-chat',
      '[class*="lyro"]'
    ];

    // Store original styles for restoration
    const originalStyles = new Map();

    // Hide elements
    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        if (element instanceof HTMLElement) {
          const key = `${selector}-${index}`;
          originalStyles.set(key, element.getAttribute('style') || '');
          element.setAttribute('style', 'display: none !important');
        }
      });
    });

    // Add CSS to ensure elements stay hidden
    const style = document.createElement('style');
    style.id = 'admin-hide-chat-elements';
    style.textContent = `
      .slide-contact-buttons { display: none !important; }
      #tidio-chat { display: none !important; }
      #chatbot-btn { display: none !important; }
      [data-gpt-engine], .gpt-engine, [class*="gpt"] { display: none !important; }
      [data-lyro], .lyro-chat, [class*="lyro"] { display: none !important; }
    `;
    document.head.appendChild(style);

    // Cleanup function to restore elements when component unmounts
    return () => {
      // Remove the added CSS
      const addedStyle = document.getElementById('admin-hide-chat-elements');
      if (addedStyle) {
        addedStyle.remove();
      }

      // Restore original styles
      originalStyles.forEach((originalStyle, key) => {
        const [selector, index] = key.split('-');
        const elements = document.querySelectorAll(selector);
        const element = elements[parseInt(index)];
        if (element instanceof HTMLElement) {
          if (originalStyle) {
            element.setAttribute('style', originalStyle);
          } else {
            element.removeAttribute('style');
          }
        }
      });
    };
  }, []);
}; 