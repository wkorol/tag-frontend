import { CheckCircle2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';

type TrustBarProps = {
  className?: string;
};

export function TrustBar({ className }: TrustBarProps) {
  const { t } = useI18n();

  const items = [
    t.trustBar.instantConfirmation,
    t.trustBar.meetGreetOptional,
    t.trustBar.noPrepayment,
    t.trustBar.supportWhatsappEmail,
    t.trustBar.vatInvoice,
  ];

  return (
    <div className={className}>
      <ul className="trust-bar" aria-label={t.trustBar.ariaLabel}>
        {items.map((label) => (
          <li key={label} className="trust-bar__item">
            <CheckCircle2 className="trust-bar__icon" aria-hidden="true" />
            <span className="trust-bar__text">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

