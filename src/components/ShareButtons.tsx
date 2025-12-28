import { Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  position?: 'top' | 'middle' | 'bottom';
  layout?: 'horizontal' | 'vertical';
}

export default function ShareButtons({ url, title, description, position = 'top', layout = 'horizontal' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isVertical = layout === 'vertical';
  const containerClass = isVertical
    ? 'flex flex-col items-center gap-2'
    : 'flex items-center gap-2 justify-center my-6';

  return (
    <div className={containerClass}>
      {!isVertical && <span className="text-sm text-gray-600 font-medium mr-2">Share:</span>}

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-500 hover:text-white transition-colors group"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition-colors group"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white transition-colors group"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-green-500 hover:text-white transition-colors group"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      <a
        href={shareLinks.email}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-600 hover:text-white transition-colors group"
        title="Share via Email"
      >
        <Mail className="w-4 h-4" />
      </a>

      <button
        onClick={handleCopyLink}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-600 hover:text-white transition-colors group relative"
        title="Copy Link"
      >
        <LinkIcon className="w-4 h-4" />
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
