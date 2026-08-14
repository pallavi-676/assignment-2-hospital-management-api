import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'teal', accentTag }) => {
  const colorMap = {
    teal: {
      bg: 'bg-[#E6F6F7]',
      text: 'text-[#0D5C63]',
      hoverBorder: 'hover:border-[#0D5C63]/40',
      badge: 'bg-[#E6F6F7] text-[#0D5C63]',
    },
    cyan: {
      bg: 'bg-[#ECFEFF]',
      text: 'text-[#0891B2]',
      hoverBorder: 'hover:border-[#0891B2]/40',
      badge: 'bg-[#ECFEFF] text-[#0891B2]',
    },
    yellow: {
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#D97706]',
      hoverBorder: 'hover:border-[#F59E0B]/40',
      badge: 'bg-[#FEF3C7] text-[#D97706]',
    },
    slate: {
      bg: 'bg-[#F0FAFA]',
      text: 'text-[#0B3F44]',
      hoverBorder: 'hover:border-[#0B3F44]/40',
      badge: 'bg-[#F0FAFA] text-[#0B3F44]',
    },
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div
      className={`rounded-2xl bg-white p-5 sm:p-6 border border-[#E0EEEE] shadow-xs transition-all duration-200 ${scheme.hoverBorder} flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8FA8AB]">
            {title}
          </span>
          <div className="mt-2">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0B2B2F] tracking-tight">
              {value}
            </span>
          </div>
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${scheme.bg} ${scheme.text} shadow-2xs`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(subtitle || accentTag) && (
        <div className="mt-4 flex items-center justify-between text-xs font-medium text-[#5A7175] border-t border-[#F0FAFA] pt-3">
          <span>{subtitle}</span>
          {accentTag && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${scheme.badge}`}>
              {accentTag}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
