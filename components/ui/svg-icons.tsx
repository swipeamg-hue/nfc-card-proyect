import React from 'react';

// ==========================================
// REDES SOCIALES OFICIALES (VECTORES OFICIALES)
// ==========================================

export function WhatsAppOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

export function InstagramOfficialIcon({
  className = 'w-5 h-5 text-white',
  withGradient = false,
}: {
  className?: string;
  withGradient?: boolean;
}) {
  if (withGradient) {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <defs>
          <linearGradient id="ig-gradient-standalone" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ig-gradient-standalone)"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export function FacebookOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function LinkedinOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

export function TikTokOfficialIcon({
  className = 'w-5 h-5 text-white',
  standalone = false,
}: {
  className?: string;
  standalone?: boolean;
}) {
  if (standalone) {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <g transform="translate(-0.7, -0.5)">
          <path
            fill="#25F4EE"
            d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.42-.04 2.72-.98 3.13-2.35.15-.49.2-.99.2-1.5V.02h-.03z"
          />
        </g>
        <g transform="translate(0.7, 0.5)">
          <path
            fill="#FE2C55"
            d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.42-.04 2.72-.98 3.13-2.35.15-.49.2-.99.2-1.5V.02h-.03z"
          />
        </g>
        <path
          fill="currentColor"
          className="text-slate-900 dark:text-white"
          d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.42-.04 2.72-.98 3.13-2.35.15-.49.2-.99.2-1.5V.02h-.03z"
        />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.42-.04 2.72-.98 3.13-2.35.15-.49.2-.99.2-1.5V.02h-.03z"/>
    </svg>
  );
}

export function XOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export function YouTubeOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function TelegramOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.942z"/>
    </svg>
  );
}

export function ThreadsOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24C5.466 24 0 18.678 0 12.12 0 5.561 5.466.24 12.186.24c6.643 0 11.964 5.174 12.008 11.666-.044 4.093-2.128 7.37-5.714 8.988-3.328 1.503-7.29 1.139-10.158-.942l1.644-2.148c2.202 1.597 5.253 1.874 7.818.718 2.658-1.198 4.2-3.639 4.23-6.616-.032-4.99-4.135-8.983-9.828-8.983-5.32 0-9.493 3.992-9.493 9.197 0 5.204 4.173 9.196 9.493 9.196 3.197 0 6.096-1.442 7.76-3.864l2.18 1.636C19.78 22.062 16.182 24 12.186 24zm-1.077-7.854c-1.849 0-3.353-1.47-3.353-3.277 0-1.808 1.504-3.277 3.353-3.277 1.849 0 3.353 1.47 3.353 3.277 0 1.807-1.504 3.277-3.353 3.277zm0-2.483c.48 0 .87-.355.87-.794s-.39-.794-.87-.794c-.48 0-.87.355-.87.794s.39.794.87.794z"/>
    </svg>
  );
}

export function OnlyFansOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.836 12.91a4.91 4.91 0 0 1-4.91 4.91c-2.712 0-4.91-2.198-4.91-4.91 0-2.712 2.198-4.91 4.91-4.91 1.053 0 2.03.332 2.83.896l-1.395 1.764a2.68 2.68 0 0 0-1.435-.417c-1.474 0-2.667 1.193-2.667 2.667 0 1.474 1.193 2.667 2.667 2.667 1.474 0 2.667-1.193 2.667-2.667 0-.256-.036-.503-.105-.738l2.203-.787c.221.48.345 1.014.345 1.579z"/>
    </svg>
  );
}

export function TwitchOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.149 0L.537 4.119v16.143H6.04V24h3.763l3.613-3.738h4.513L23.463 14.5V0H2.149zm19.164 13.045l-3.313 3.328h-5.269L9.418 19.686V16.373H4.821V2.15H21.313v10.895zM17.18 6.075h-2.15v6.433h2.15V6.075zm-6.075 0H8.955v6.433h2.15V6.075z"/>
    </svg>
  );
}

export function SnapchatOfficialIcon({
  className = 'w-5 h-5 text-black',
  standalone = false,
}: {
  className?: string;
  standalone?: boolean;
}) {
  if (standalone) {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="#FFFC00" />
        <path
          fill="#000000"
          d="M12.002 4.5c-2.484 0-4.088 1.83-4.102 3.864-.007.414.07.828.232 1.213-.42.096-.917.29-1.026.793-.087.403.14.735.452.924-.047.284-.11.564-.202.839-.18.536-.452.793-.82.883-.347.085-.634.33-.679.688-.052.417.202.812.597.94 1.343.435 2.112 1.258 2.217 2.062.035.267.147.45.335.547.187.098.442.098.745.002.502-.158 1.173-.37 2.251-.37 1.077 0 1.748.212 2.25.37.303.096.558.096.745-.002.188-.097.3-.28.335-.547.105-.804.874-1.627 2.217-2.062.395-.128.649-.523.597-.94-.045-.358-.332-.603-.679-.688-.368-.09-.64-.347-.82-.883a4.92 4.92 0 0 1-.202-.839c.312-.189.539-.521.452-.924-.109-.503-.606-.697-1.026-.793.162-.385.239-.799.232-1.213C16.09 6.33 14.486 4.5 12.002 4.5z"
        />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.002 4.5c-2.484 0-4.088 1.83-4.102 3.864-.007.414.07.828.232 1.213-.42.096-.917.29-1.026.793-.087.403.14.735.452.924-.047.284-.11.564-.202.839-.18.536-.452.793-.82.883-.347.085-.634.33-.679.688-.052.417.202.812.597.94 1.343.435 2.112 1.258 2.217 2.062.035.267.147.45.335.547.187.098.442.098.745.002.502-.158 1.173-.37 2.251-.37 1.077 0 1.748.212 2.25.37.303.096.558.096.745-.002.188-.097.3-.28.335-.547.105-.804.874-1.627 2.217-2.062.395-.128.649-.523.597-.94-.045-.358-.332-.603-.679-.688-.368-.09-.64-.347-.82-.883a4.92 4.92 0 0 1-.202-.839c.312-.189.539-.521.452-.924-.109-.503-.606-.697-1.026-.793.162-.385.239-.799.232-1.213C16.09 6.33 14.486 4.5 12.002 4.5z"/>
    </svg>
  );
}

export function WeChatOfficialIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.691 2.188C3.891 2.188 0 5.478 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.536 1.996 2.394-1.228a.63.63 0 0 1 .452-.053c1.002.28 2.067.433 3.166.433.228 0 .452-.007.676-.021a6.6 6.6 0 0 1-.277-1.895c0-3.805 3.535-6.89 7.898-6.89.475 0 .937.042 1.388.109C17.404 5.093 13.414 2.188 8.691 2.188zm-2.45 4.316a1.18 1.18 0 1 1 0 2.36 1.18 1.18 0 0 1 0-2.36zm4.901 0a1.18 1.18 0 1 1 0 2.36 1.18 1.18 0 0 1 0-2.36zm4.545 3.385c-3.633 0-6.58 2.573-6.58 5.748 0 3.175 2.947 5.748 6.58 5.748.835 0 1.636-.134 2.378-.363a.47.47 0 0 1 .34.04l1.83 1.005-.41-1.63a.45.45 0 0 1 .164-.51c1.4-1.033 2.278-2.557 2.278-4.29 0-3.175-2.947-5.748-6.58-5.748zm-2.057 3.305a.903.903 0 1 1 0 1.806.903.903 0 0 1 0-1.806zm4.114 0a.903.903 0 1 1 0 1.806.903.903 0 0 1 0-1.806z"/>
    </svg>
  );
}

// ==========================================
// ÍCONOS SVG VECTORIALES PARA SERVICIOS / BOTONES
// ==========================================

export function UtensilsSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"></path>
      <path d="M15 2v10"></path>
      <path d="M15 12v10"></path>
      <path d="M6 2v20"></path>
      <path d="M4 2h4"></path>
      <path d="M4 6h4"></path>
    </svg>
  );
}

export function CalendarSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <path d="m9 16 2 2 4-4"></path>
    </svg>
  );
}

export function SparklesBeautySvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path>
      <path d="M5 3v4"></path>
      <path d="M3 5h4"></path>
      <path d="M19 17v4"></path>
      <path d="M17 19h4"></path>
    </svg>
  );
}

export function ScissorsSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"></circle>
      <path d="M8.12 8.12 12 12"></path>
      <path d="M20 4 8.12 15.88"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <path d="M14.8 14.8 20 20"></path>
    </svg>
  );
}

export function CoffeeSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v2"></path>
      <path d="M14 2v2"></path>
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z"></path>
      <path d="M6 2v2"></path>
      <path d="M17 11h1a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3h-1"></path>
    </svg>
  );
}

export function ShoppingBagSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
      <path d="M3 6h18"></path>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}

export function FileTextSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <path d="M10 9H8"></path>
      <path d="M16 13H8"></path>
      <path d="M16 17H8"></path>
    </svg>
  );
}

export function ClockSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

export function CreditCardSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
      <line x1="2" x2="22" y1="10" y2="10"></line>
    </svg>
  );
}

export function StarSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
}

export function GlobeSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
      <path d="M2 12h20"></path>
    </svg>
  );
}

export function PhoneSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );
}

export function MapPinSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

export function MailSvg({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );
}

export function GoogleOfficialIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

