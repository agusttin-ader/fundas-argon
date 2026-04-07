/**
 * URL para abrir un chat de WhatsApp con el número indicado.
 * Usa solo dígitos (código de país incluido, sin +). Ej: +54 9 11 2345-6789 → 5491123456789
 */
export function buildWhatsAppChatUrl(phone: string | undefined): string | null {
  if (!phone?.trim()) return null;
  const digits = phone.replaceAll(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}
